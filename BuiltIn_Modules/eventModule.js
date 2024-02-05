//work with event in nodejs
//return 1 class là EventEmitter is
//emit(): trigger event
//catch mỗi event có thể dùng nhiều callback khác nhau, cái nào trước thì thực hiện trưóc
/* const EventEmitter = require('node:events');

const emitter = new EventEmitter();

emitter.on('order-pizza', (size, topping) => {
    console.log(`order received a ${size} ${topping}`);
});

emitter.on('order-pizza', (size) => {
    if (size === 'large') {
        console.log('size is OK');
    }
});

emitter.emit('order-pizza', 'large', 'eggs');
 */

const PizzaShop = require('./extendEventEmitter');
const DrinkMachine = require('./drink_machine');

const pizzaShop = new PizzaShop();
const drinkMachine = new DrinkMachine();

pizzaShop.on('order', (size, topping) => {
    console.log(`order received a ${size} ${topping}`);
    drinkMachine.serveDrink(size);
});

pizzaShop.order('large', 'egg');
pizzaShop.displayOrder();