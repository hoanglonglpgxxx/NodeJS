const fs = require('node:fs');

//ghi data từ file này sang file khác sử dụng Stream
//4 types of streams
//readble
//writable
//duplex: write & read
//transform: can modify / transform data as it is written and read (sử dụng cho compressed & de-compressed files)
const readableStream = fs.createReadStream('./BuiltIn_Modules/file.txt', {
    encoding: 'utf-8',
    highWaterMark: 2,//2 character 1 lúc, thay vì 64KB như size của buffer
});

const writeableStream = fs.createWriteStream('./BuiltIn_Modules/file2.txt');

readableStream.on('data', (chunk) => {
    console.log(chunk);
    writeableStream.write(chunk);
});