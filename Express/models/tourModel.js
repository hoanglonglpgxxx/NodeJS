const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a name'],
        unique: true,
        //maxlength, minlength ONLY AVAILABLE FOR STRING
        maxlength: [255, 'A tour name must have less or equal than 255 characters'],
        minlength: [10, 'A tour name must have more or equal than 15 characters']
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
        required: [true, 'Tour must have a difficulty'],
        //ENUM ONLY AVAILABLE FOR STRING
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 3.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour must have a price']
    },
    discountPrice: {
        type: Number,
        validate: {
            validator: function (val) {
                //this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) must be below regular price'//VALUE NÀY LÀ TỪ MONGOOSE
        }
    },
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
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    secretTour: {
        type: Boolean,
        default: false
    },
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
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

/* tourSchema.pre('save', async function (next) {
    const guidesPromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidesPromises);

    next();
}); */
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
//Run before/after certain query executed
tourSchema.pre(/^find/, function (next) {
    //this points to current query
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
    next();
});

//Populate guides field in tourSchema
tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();
});

//Run after query executed
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

const Tour = mongoose.model('Tour', tourSchema); //this is a model
module.exports = Tour;
