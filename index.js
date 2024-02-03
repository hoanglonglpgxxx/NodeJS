//always available in nodeJS
// const addFn = require("./add");

// const sum = addFn(1, 3);
// console.log('index234234js', sum);

//module scope
//each module has its own scope
// require('./a');
const dItem = require('./d');
console.log(dItem.getName());
dItem.setName('Name 2');
console.log(dItem.getName());

const newdItem = require('./d');
console.log(newdItem.getName());