const http = require('node:http');

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('test');
});

server.listen(3000, () => {
    console.log('server running');
});

