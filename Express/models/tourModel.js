const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a name'],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'Tour must have a duration']
    },
    maxSize: {
        type: Number,
        required: [true, 'Tour must have a group size']
    },
    difficulty: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a difficulty']
    },
    ratingsAverage: {
        type: Number,
        default: 3.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour must have a price']
    },
    discountPrice: Number,
    summary: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a summary']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Tour must have a cover image']
    },
    images: [String], //an array of string
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
});

const Tour = mongoose.model('Tour', tourSchema); //this is a model

module.exports = Tour;