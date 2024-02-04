const EventEmitter = require('node:events');
class PizzaShop extends EventEmitter {
    constructor() {
        super();
        this.orderNumber = 0;
    }

    order(size, topping) {
        this.orderNumber++;
        this.emit('order', size, topping);
    }

    displayOrder() {
        console.log(`current Order number: ${this.orderNumber}`);
    }
};

module.exports = PizzaShop;