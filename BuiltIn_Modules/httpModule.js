const http = require('node:http');
const fs = require('node:fs');
const url = require('node:url');

const data = fs.readFileSync('./farm.json', 'utf-8');
const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

    // console.log(req.url);

    const pathName = req.url;

    /*  if (pathName === '/overview') {
         res.end('This is OVERVIEW');
     } else if (pathName === '/product') {
         res.end('This is product');
     } else if (pathName === '/product') {
         res.end('This is product');
     } else {
         res.writeHead(200, { 'Content-Type': 'text/html' });
         fs.createReadStream('./index.html').pipe(res);
         const html = fs.readFileSync('./index.html', 'utf-8');
         res.end(html);
     } */

    // Overview page 
    if (pathName === '/overview' || pathName === '/') {
        res.end('overview page');
        // Product page
    } else if (pathName === '/product') {
        res.end('product page');
        // API
    } else if (pathName === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

        // 404
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end('page not found');
    }
});

server.listen(3000, () => {
    console.log('server running');
});

