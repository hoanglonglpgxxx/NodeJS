const express = require('express');

const app = express();

app.get('/', (req, res) => {
    // res.status(200).send('Hello from server side');
    res.status(200).json({ message: 'a', app: 'b' });
});

app.post('/', (req, res) => {
    res.send('Post to endpoint');
});

const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});