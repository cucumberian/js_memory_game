class Win {
    constructor(element) {
        this.element = element;
        this.win_description = document.querySelector('p.win_description');
        this.win_text = document.querySelector(`p.win_text`);
        console.log(`win:`, this);
    }

    show() {
        this.element.classList.remove('hide');
    }

    hide() {
        this.element.classList.add('hide');
    }

    set_description(steps, n, m) {
        this.win_description.innerText = `Вы решили поле ${n}x${m} за ${steps} шагов.`
    }

}

export default Win;