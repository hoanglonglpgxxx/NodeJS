//always available in nodeJS
// const addFn = require("./add");

// const sum = addFn(1, 3);
// console.log('index234234js', sum);

//module scope
//each module has its own scope
// require('./a');
// const dItem = require('./d');
// console.log(dItem.getName());
// dItem.setName('Name 2');
// console.log(dItem.getName());

//! Import Export Patterns
/* const math = require('./math');

//deconstruct object math
const { add, sub } = math;
console.log(add(3, 2));

const data = require('./data.json');
console.log(data, data.name); */

/* const buffer = new Buffer.from('Long');
buffer.write('asd');
console.log(buffer.toString(),buffer.toJSON(),buffer); */