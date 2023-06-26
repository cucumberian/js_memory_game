
/**
 * generate random integer in range [a, b]
 * @param {int} a
 * @param {int} b 
 * @returns int
 */
function randint(a, b) {
    if (b === undefined) {
        [a, b] = [0, a];
    }

    if (a > b) {
        [a, b] = [b, a];
    }

    a = a - 0.5;
    b = b + 0.5;
    return Math.round(
        Math.random() * (b-a) + a
    );
}

/**
 * generate random number in range [a, b)
 * @param {int} a 
 * @param {int} b 
 * @returns int
 */
function randInt(a, b) {
    if (b === undefined) {
        [a, b] = [0, a];
    }
    if (a > b) {
        [b, a] = [a, b];
    }
    return Math.floor(Math.random()*(b - a) + a);
}

/**
 * Return random element from array
 * @param {list} arr 
 * @returns random element from arr
 */
function random_choice(arr) {
    const rand_ind = randInt(arr.length);
    return arr[rand_ind];
}

/**
 * Create copy of arr and random shuffle it
 * @param {*} arr 
 * @returns shuffled cloned array
 */
function shuffle(arr) {
    const arr_copy = structuredClone(arr);
    for (let i = arr_copy.length - 1; i > 0; i--) {
        const rand_ind = randInt(0, i); // случайный индекс [0, i)
        // меняем местами последний элемент со случайно выбранным 
        // может случиться что будет выбран последний
        [arr_copy[i], arr_copy[rand_ind]] = [arr_copy[rand_ind], arr_copy[i]];
    }
    return arr_copy;
}

/**
 * Returns an array of integers in [a, b)
 * @param {int} a 
 * @param {int} b 
 * @returns array if intgers in [a, b)
 */
function range(a, b) {
    const arr = [];
    if (a > b) {
        [a, b] = [b, a];
    }
    for (let i = a; i < b; i++) {
        arr.push(i);
    }
    return arr;
}

class FSMminini {
    constructor() {
        this.state = "init";
    }

    change_state(new_state) {
        console.log(`change_state ${this.state} => ${new_state}`)
        if (new_state in this.transitions) {
            this.dispatch('leave');
            this.state = new_state;
            this.dispatch('init');
        }
        else {
            console.warn(`no such state "${new_state}"`);
        }
    }

    dispatch(action_name, payload) {
        // console.log(`dispatch ${this.state}.${action_name}`)
        const actions = this.transitions[this.state];
        if (action_name in actions) {
            const action = actions[action_name];
            action.call(this, payload);
        }
        else {
            console.warn(`no such state "${action_name}" in state "${this.state}"`)
        }
    }

    transitions = {
        "init": {
            init() {},
            leave() {},
        },
    };
}

export {randint, randInt, random_choice, range, shuffle, FSMminini}; 