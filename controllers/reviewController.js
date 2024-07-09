const Review = require('../models/reviewModel');
//BUILD QUERY
// const catchAsync = require('../utils/catchAsync');
const factoryHandler = require('./factoryHandler');

exports.getAllReviews = factoryHandler.getAll(Review);

exports.setTourUserIds = (req, res, next) => {
    //Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    next();
};

exports.getReview = factoryHandler.getOne(Review);

exports.createReview = factoryHandler.createOne(Review);

exports.updateReview = factoryHandler.updateOne(Review);

exports.deleteReview = factoryHandler.deleteOne(Review);