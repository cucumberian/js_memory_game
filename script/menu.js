class Menu {
    constructor(element) {
        this.element = element;
        this.header_button = document.querySelector('.header_menu');
    }

    hide() {
        console.log(`menu hide`);
        this.element.classList.add("hide");
    }
    show() {
        console.log(`menu show`);
        this.element.classList.remove("hide");
    }

    toggle() {
        console.log('toggle');
        if (this.element.classList.contains("hide")) {
            this.show();
        }        
        else {
            this.hide();
        }
    }
}

export default Menu;
