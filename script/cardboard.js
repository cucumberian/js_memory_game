import { FSMminini, shuffle, range } from "./minini.js";
import Card from "./card.js";


class CardBoard extends FSMminini{
    max_opened_cards = 4;
    timeout = 1000;
    steps_selector = ".game_header > div.steps";
    card_wrapper_class = 'cards_wrapper';

    constructor(parent, n, m, game_object) {
        super();
        this.parent = parent;
        this.n = n;
        this.m = m;
        // this.element = document.createElement('div');
        this.element = parent;

        this.cards_wrapper = document.createElement('div');
        this.cards_wrapper.style.gridTemplateColumns = `repeat(${this.m}, 1fr)`;

        this.render();
        this.change_state("init");
        this.game_object = game_object;
    }

    generate_content() {
        const codes = shuffle(range(2451, 3472));
        
        const content_length = this.n * this.m;
        const half_length = Math.floor(content_length / 2); 
        let content = new Set();
        // let i = 0;
        // while (content.size < half_length) {
        //     const symbol = String.fromCharCode(codes[i]);
        //     i++;
        //     if (this.charIsVisible(symbol, this.cards_wrapper)) {
        //         console.log(`${symbol}: ${codes[i]}, i=${i}, content.size=${content.size}`);
        //         content.add(symbol);
        //     }
        // }
        for (let i = 0; content.size < half_length; i++) {
            const symbol = String.fromCharCode(codes[i]);
            if (this.charIsVisible(symbol, this.cards_wrapper)) {
                console.log(`${symbol}: ${codes[i]}, i=${i}, content.size=${content.size}`);
                content.add(symbol);
            }
            if (i > 65000) {
                break;
            }
        }
        // for (let i = 0; i < half_length; i++){
        //     const symbol = String.fromCharCode(codes[i]);
        //     if (isEmptySymbol(symbol, this.cards_wrapper)) {

        //     }

        //     console.log(`${symbol}: ${codes[i]}`)
        //     content.add(symbol);
        // }
        content = [...content, ...content];
        content = shuffle(content);
        return content;
    }


    charIsVisible(char, parent) {
        const element = document.createElement('div');
        element.innerText = char;

        parent.append(element);
        const isVisible = element.offsetWidth > 0 && element.offsetHeight > 0;
        element.remove();
        return isVisible;
    }

    create_cards() {
        const cards = [];
        const content = this.generate_content();
    
        for (let i = 0; i < this.n; i++) {
            for (let j = 0; j < this.m; j++) {
                const index = i * this.m + j;
                const card = new Card(this.cards_wrapper, content[index], cards.length);
                card.element.addEventListener('click', () => {
                    this.dispatch('card_click', card);
                });
                cards.push(card)
            }
        }
        return cards;
    }

    get number_opened_cards() {
        return this.opened_cards.size;
    }

    get_cards_with_state(state) {
        return this.cards.filter(card => card.state === state)
    }

    get opened_content() {
        return this.opened_cards.map(card => card.content);
    }

    add_step() {
        this.set_steps(++this.steps);
    }

    set_steps(steps) {
        this.steps = steps;
        document.querySelector(this.steps_selector).innerText = `${steps}`;
    }

    /**
     * Freeze some cards from shown
     * @param {Card} card 
     * @returns Bool - was freezed or not
     */
    frozen_same_opened_cards(card) {
        const cards_with_same_content = Array.from(this.opened_cards.values())
            .filter(elem => elem.content === card.content);
        if (cards_with_same_content.length > 0) {
            card.freeze()
            for (let element of cards_with_same_content) {
                this.opened_cards.delete(element); // удаляем карту из открытых
                element.freeze();
            }
            return true;    // есть совпадения
        }
        return false;   // не было найдено совпадений
    }

    hide_card(card) {
        card.hide();
        this.opened_cards.delete(card);
    }

    check_win() {
        return this.get_cards_with_state("frozen").length === this.cards.length;
    }
    
    game_reset() {
        console.log('reset');
        this.set_steps(0);
        this.cards_wrapper.innerText = [];
        this.change_state('init');
    }

    transitions = {
        "init" : {
            init() {
                this.cards = this.create_cards();
                this.content = this.generate_content();
                this.change_state('play');
                this.opened_cards = new Set(); // множество карт, которые были открыты
            },
            leave () {},
            leave() {},
        },

        "play": {
            init() {
                this.steps = 0;
            },
            leave() {},
            card_click(card) {
                // console.log('card_click');
                if (card.state === "frozen") {
                    return; // не делаем ничего 
                }
                else if (card.state === "shown") {
                    // если карта показана, то скрываем её
                    this.hide_card(card);
                }
                else if (card.state === "hidden") {
                    if (this.opened_cards.size >= this.max_opened_cards) {
                        return; // если открыто карт слишком много - ничего не делаем
                    }
                    card.show();
                    this.add_step();
                    const frozen = this.frozen_same_opened_cards(card);
                    if (!frozen) {
                        this.opened_cards.add(card);
                        // если открыто макс количество карт (текущая и начальная)
                        if(this.number_opened_cards >= 2) {
                            // setTimeout(() => {
                            //     this.hide_card(card);
                            // }, this.timeout);   // скрываем текущую карту

                            // скрываем все открытые карты
                            this.opened_cards.forEach(element => {
                                setTimeout(() => {
                                    this.hide_card(element);
                                }, this.timeout);
                            });
                        }
                    }
                    const is_win = this.check_win();
                    if (this.check_win()) {
                        this.dispatch("to_win");
                    }

                }
                
            },
            to_win() {
                this.change_state("win");
            },
            reset() {
                this.game_reset();
            },
        },
        "win": {
            init() {
                console.log('Победа!');
                this.game_object.dispatch('to_win');
            },
            leave() {},
            reset() {
                this.game_reset();
            },
        },
    };

    render() {
        this.cards_wrapper.classList.add(this.card_wrapper_class);

        const reset_button = document.createElement(`button`);
        reset_button.classList.add('reset');
        reset_button.addEventListener('click', () => {
            this.dispatch('reset');
        });

        this.element.append(this.cards_wrapper, reset_button);
        // this.parent.append(this.element);
    }
}

export default CardBoard;