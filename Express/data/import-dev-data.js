//import data from json to DB, only once
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const Tour = require('../models/tourModel');
const Review = require('../models/reviewModel');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', process.env.DATABASE_PASSWORD
);


mongoose.connect(
    DB,
    { useFindAndModify: false, useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
    (err) => {
        if (err) return console.log("Error: ", err);
        console.log("MongoDB Connection -- Ready state is:", mongoose.connection.readyState);
    }
);

//READ JSON FILE
const toursData = JSON.parse(fs.readFileSync(path.join(__dirname, 'tours-simple.json'), 'utf-8'));
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf-8'));
const reviewsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'reviews.json'), 'utf-8'));

//IMPORT DATA TO DB
const importData = async () => {
    try {
        await Tour.create(toursData);
        await User.create(usersData, { validateBeforeSave: false });
        await Review.create(reviewsData);

    } catch (err) {
        console.log(err);
    }
};

//DELETE DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('deleted Data');
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

console.log(process.argv);