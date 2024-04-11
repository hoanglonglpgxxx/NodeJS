const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a name'],
        unique: true
    },
    slug: String,
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
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: {
        virtuals: TransformStreamDefaultController
    },
    toObject: {
        virtuals: TransformStreamDefaultController
    },
});

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});// getter

//DOCUMENT MIDDLEWARE in mongoose, ONLY runs before .save() & .create()
//xử lý trước khi data được save vào db
tourSchema.pre('save', function (next) {
    //points to current process document 
    this.slug = slugify(this.name, { lower: true });
    next();
});
//có thể dùng multiple middleware cùng type
/* tourSchema.pre('save', (next) => {
    console.log('will save document...');
    next();
});

tourSchema.post('save', (doc, next) => {
    //doc ở đây cũng point to current process document
    console.log(doc);
    next();
}); */

//QUERY MIDDLEWARE in mongoose
//run before/after certain query executed
tourSchema.pre(/^find/, function (next) {
    //this points to current query
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} ms!`);
    // console.log(docs);
    next();
});

//AGGREGATION MIDDLEWARE in mongoose
tourSchema.pre('aggregate', function (next) {
    //this points to aggregation obj
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    // console.log(this.pipeline());
    next();
});

console.log(333, this);
const Tour = mongoose.model('Tour', tourSchema); //this is a model
module.exports = Tour;
