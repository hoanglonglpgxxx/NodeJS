const { log } = require('node:console');
const path = require('node:path');

//?path.basename : lấy tên file
//?path.extname : trả tên extension
//?path.parse: trả object các thông tin của file
//?path.format ????
//?path.isAbsolute : ktra có phải đường dẫn tuyệt đối không Ex: ./a.js là đường dẫn relative
//?path.join: concat các string bằng các '/', ngoài ra normalized string để trả về pathn đúng
//?path.resolve: trả absolute path từ dấu '/' đầu tiên gặp

// console.log(path.extname(__filename));
// console.log(path.basename(__dirname));
// console.log(path.parse(__filename));
// console.log(path.format(path.parse(__filename)));
// console.log(path.isAbsolute(__filename));
// console.log(path.join('folder1', 'folder2', 'index.html'));
// console.log(path.join('folder1', 'folder2', '../index.html'));
// console.log(path.join(__dirname, 'index.html'));
console.log(path.resolve('folder1', 'folder2', 'index.html'));
console.log(path.resolve('folder1', 'folder2', '../index.html'));
console.log(path.resolve(__dirname, 'index.html'));