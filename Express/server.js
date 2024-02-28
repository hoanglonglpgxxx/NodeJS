const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

console.log(app.get('env'), process.env);

const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});