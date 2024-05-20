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

/**
 * Return filtered object with only allowed fields
 * @param {Object} obj 
 * @param {...any} allowedFields
 * @returns {Object} - Return a new object with only the allowed fields 
 */
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateData = catchAsync(async (req, res, next) => {
    //1. Create error if user try to update password (POSTs password data)
    if (await req.body.password || await req.body.confirmPassword) {
        return next(new AppError('This route is not for password updates. Please use /update-password', 400));
    }

    //2. Filter only allowed to update fields to update
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
    });

    //3. Update user document
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
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