const http = require('node:http');
const fs = require('node:fs');
const url = require('node:url');
const slugify = require('slugify');

//--------------OWN MODULES----------
const replaceTempate = require('../modules/replaceTemplate');

//-----------------CODE---------------
const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

const data = fs.readFileSync('./farm.json', 'utf-8');
const dataObj = JSON.parse(data);
// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);
    const pathName = req.url;
    /*
         res.writeHead(200, { 'Content-Type': 'text/html' });
         fs.createReadStream('./index.html').pipe(res);
         const html = fs.readFileSync('./index.html', 'utf-8');
         res.end(html);
      */

    // Overview page 
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTempate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);

        // Product page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTempate(tempProduct, product);
        res.end(output);

        // API
    } else if (pathname === '/api') {
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

