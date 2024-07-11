const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const User = require('../models/userModel');

exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();
    res.status(200).render('overview', {
        title: 'All tours',
        tours
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError(`There is no tour with that name ${req.params.slug} ${req.params}`, 404));
    }

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.getLoginForm = catchAsync(async (req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account'
    });
});

exports.getAccount = catchAsync(async (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
        user: req.user
    });
});

exports.getMyTours = catchAsync(async (req, res,) => {
    // 1) Find all bookings
    const bookings = await Booking.find({ user: req.user.id });
    // 2) Find tours with the returned IDs
    const tourIds = bookings.map(el => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIds } });

    res.status(200).render('overview', {
        title: 'Your account',
        tours
    });
    //virtual populate for booking NOT FINISHED, NOT WORKING
    /* const bookings = await Booking.find({ user: req.user.id }).populate({
        path: 'tour',
        select: 'name'
    }); */
});

exports.updateUserData = catchAsync(async (req, res,) => {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true,
        runValidators: true
    });
    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});