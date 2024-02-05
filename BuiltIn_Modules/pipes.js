//read a readable stream, connect với writeable stream
//destination stream truyền vào hàm pipe không được là readable stream
const fs = require('node:fs');
const zlib = require('node:zlib'); //giúp tạo zip file

const gzip = zlib.createGzip();

const readableStream = fs.createReadStream('./BuiltIn_Modules/file.txt', {
    encoding: 'utf-8',
    highWaterMark: 2,
});

const writeableStream = fs.createWriteStream('./BuiltIn_Modules/file2.txt');

readableStream.pipe(writeableStream);
readableStream.pipe(gzip).pipe(fs.WriteStream('./BuiltIn_Modules/file2.txt.gz'));