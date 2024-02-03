//!export pattern 1
// const add = (a, b) => {
//     return a + b;
// };
// module.exports = add;

//!export pattern 2
// module.exports = (a, b) => {
//     return a + b;
// };

//!export pattern 3
module.exports.add = (a, b) => {
    return a + b;
};

module.exports.sub = (a, b) => {
    return a - b;
};

//nếu key and value same thì chỉ cần truyền 1, không cần truyền cả key and value
//nếu dùng gán biến cho các func thì mới cần module.exports như dưới, còn không có thể như trên
// module.exports = {
//     add,
//     sub,
// };