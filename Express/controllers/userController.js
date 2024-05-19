const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users: users
        }
    });
});

exports.updateData = catchAsync(async (req, res, next) => {
    //1. Create error if user try to update password (POSTs password data)
    if (req.body.password || req.body.confirmPassword) {
        return next(new AppError('This route is not for password updates. Please use /update-password', 400));
    }
    //2. Update user document


    res.status(200).json({
        status: 'success',
        /* data: {
            user
        } */
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};
exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};