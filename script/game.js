import { FSMminini } from "./minini.js";
import Menu from "./menu.js";
import CardBoard from "./cardboard.js";
import Win from "./win.js";


class Game extends FSMminini {
    cardboard_selector = `.game_board`;
    menu_selector = '.game_menu';
    menu_start_button_selector = '.menu_game_start';
    win_selector = '#game_win';

    constructor() {
        super();

        this.menu = new Menu(document.querySelector(this.menu_selector));
        this.menu_start_button = document.querySelector(this.menu_start_button_selector);
        this.menu_start_button.addEventListener('click', () => {
            this.dispatch('to_play');
        });
        this.menu.header_button.addEventListener('click', () => {
            this.dispatch('header_menu');
        });

        this.win = new Win(document.querySelector(this.win_selector));
        this.win.win_button.addEventListener('click', () => {
            this.dispatch('win_button');
        });
        this.win.hide();
        console.log(this.win);

        this.state = "init";
        this.dispatch("init");
        this.prev_state = "init";

        document.addEventListener('keydown', event => {
            console.log(event.key);
            if (event.key === "Escape") {
                this.dispatch("escape");
            }
        });
    }


    transitions = {
        "init": {
            init() {
                this.change_state('menu');
            },
            leave () {},
        },
        "menu": {
            init() {
                this.menu.show();
            },
            leave() {
                this.menu.hide();
            },
            to_play() {
                this.read_settings_and_start_game();
            },
            escape() {
                console.log('menu escape');
            },
        },
        "play": {
            init() {    
                const card_board = document.querySelector(this.cardboard_selector);
                card_board.innerText = '';
                this.cb = new CardBoard(
                    card_board,
                    this.n_cols,
                    this.n_rows,
                    this,
                );
            },
            to_play() {
                this.read_settings_and_start_game();
            },
            leave() {},
            to_win() {
                this.change_state('win');
            },
            escape() {
                console.log('escape');
                this.menu.toggle();
            },
            header_menu() {
                this.menu.toggle();
            },
        },
        "win": {
            init() {
                this.win.set_description(this.cb.steps, this.n_rows, this.n_cols);
                this.win.show();
            },
            leave() {
                this.win.hide();
            },
            escape () {
                this.change_state('menu');
            },
            win_button() {
                this.change_state('menu');
            },
        },
        "gameover": {},
    };

    read_settings_and_start_game() {
        const input_n = document.querySelector(`input[name="n_cols"]`);
        const input_m = document.querySelector(`input[name="m_rows"]`);
        this.n_rows = input_n.value;
        this.n_cols = input_m.value;
        console.log(`play ${this.n_rows}x${this.n_cold}`);
        this.change_state('play');
        this.menu.hide();
    }
}

export default Game;
