const express = require('express');

const app = express();

app.get('', (req, res) => {
    setTimeout(() => console.log('time out'));

    setImmediate(() => console.log('immediate'));

    Promise.resolve().then(() => console.log('promise'));

    process.nextTick(() => console.log('next tick'));

    req.on('close', () => console.log('close request'));

    res.send('hi');
});

app.listen('3000');