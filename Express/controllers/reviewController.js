const Review = require('../models/reviewModel');
//BUILD QUERY
const catchAsync = require('../utils/catchAsync');
const factoryHandler = require('./factoryHandler');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    //Allow nested routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.setTourUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

exports.createReview = factoryHandler.createOne(Review);

exports.updateReview = factoryHandler.updateOne(Review);

exports.deleteReview = factoryHandler.deleteOne(Review);