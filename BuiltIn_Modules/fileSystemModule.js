const fs = require('node:fs');

//? readFileSync: trả content file
//? readFile: truyền thêm callback xử lý, 2 tham số trong callback là error và data
//? writeFileSync:ghi đè content vào file (đồng bộ)
//? writeFile:ghi đè content vào file, có callback xử lý (bất đổng bộ)

const fileContents = fs.readFileSync('./BuiltIn_Modules/file.txt', 'utf-8');
console.log(fileContents);
fs.readFile('./BuiltIn_Modules/file.txt', 'utf-8', (error, data) => {
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
});

fs.writeFileSync('./BuiltIn_Modules/note.txt', 'hihihihi');

fs.writeFile('./BuiltIn_Modules/note.txt', ' asdasdasd', { flag: "a" }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('written');
    }
}); 