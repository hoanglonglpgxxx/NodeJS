const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
},
    {
        toJSON: {
            virtuals: TransformStreamDefaultController
        },
        toObject: {
            virtuals: TransformStreamDefaultController
        },
    }
);

reviewSchema.statics.calvAverageRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    //update các thông số trên tour
    if (stats.length) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: true }); //mỗi user chỉ được review 1 lần cho 1 tour
//-> k biết sao lỗi không tạo được index, tạo tay trong mongocompass

//khi có review mới thì update lại thông số trên tour
reviewSchema.post('save', function () {
    // this points to current review
    this.constructor.calvAverageRating(this.tour);
});

//không dùng post() ở đây được vì không select được query để lấy findOne() 
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.review = await this.findOne(); //get current review and pass to post() by using this.review
    next();
});

//sau khi set review thì có thể dùng post, lấy từ review đã set trong reviewSchema.pre()
reviewSchema.post(/^findOneAnd/, async function () {
    await this.review.constructor.calvAverageRating(this.review.tour._id);
});

reviewSchema.pre(/^find/, function (next) {
    /*  this.populate({
         path: 'tour',
         select: 'name'
     }).populate({
         path: 'user',
         select: 'name photo'
     }); */

    this.populate({
        path: 'user',
        select: 'name photo'
    });

    next();
});

const Review = mongoose.model('Review', reviewSchema); // a model
module.exports = Review;