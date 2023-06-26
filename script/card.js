import {FSMminini} from './minini.js';

class Card extends FSMminini {
    class_name = 'game_card';
    hidden_class_name = 'backside';
    content_class_name = 'content';

    constructor(parent, content=undefined, card_number) {
        super();
        this.parent = parent;
        this.content = content;
        this.card_number = card_number;
        this.render();
        this.state = "init";
        this.change_state("hidden");
    }

    render() {
        this.element = document.createElement('div');
        this.element.classList.add(
            this.class_name,
            this.hidden_class_name
        );
        this.element.setAttribute("card_number", `${this.card_number}`);
        this.parent.append(this.element);
    }

    flip() {
        this.dispatch("flip");
    }

    show() {
        this.dispatch('show');
    }

    hide() {
        this.dispatch('hide');
    }

    freeze() {
        this.dispatch('to_frozen');
    }

    transitions = {
        'init': {
            init() {},
            leave() {},
        },
        'hidden': {
            init() {
                this.element.replaceChildren();
                // если есть карта без контента, 
                // то открываем и замораживаем её
                // для случая с нечетным количеством карт
                if (this.content === undefined) {
                    this.content = '';
                    this.dispatch('reveal_and_freeze');
                }
            },
            leave() {
                const content = document.createElement('p');
                content.classList.add(this.content_class_name);
                content.innerText = this.content;
                this.element.append(content);},
            show() {
                this.element.classList.remove(this.hidden_class_name);
                // console.log(`dispatch ${this.state}.show()`);
                this.change_state('shown');
            },
            flip() {
                this.dispatch('show');
            },
            reveal_and_freeze() {
                this.element.classList.remove(this.hidden_class_name);
                this.change_state('frozen');
            },
        },
        'shown': {
            init() {},
            leave() {},
            hide() {
                // console.log(`dispatch ${this.state}.hide()`);
                this.element.classList.add(this.hidden_class_name);
                this.change_state('hidden');
            },
            flip() {
                this.dispatch('hide');
            },
            to_frozen () {
                this.change_state('frozen');
            },
        },
        'frozen': {
            init() {
                // console.log(`card "${this.content}" frozen`);
            },
            leave() {},
        }
    }
}

export default Card;