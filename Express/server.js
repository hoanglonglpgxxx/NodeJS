const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', process.env.DATABASE_PASSWORD
);

mongoose
    // .connect(process.env.DATABASE_LOCAL, {
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(() => { console.log('DB CONNNECED'); });


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour must have a name'],
        unique: true
    },
    rating: {
        type: Number,
        default: 3.5
    },
    price: {
        type: Number,
        required: [true, 'Tour must have a price']
    },
});

const Tour = mongoose.model('Tour', tourSchema); //this is a model

const app = require('./app');


// console.log(app.get('env'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});