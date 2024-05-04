const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const webhookController = require('./webhookController');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    //Login sau khi signup 
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN //có time để tự log out user sau 1 thời gian
    });
    webhookController.sendToDiscord(req, res, next);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body; //destructuring ES6
    //1. Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password'), 400);
    }
    //2. Check if user exists && password is correct
    const user = await User.findOne({ email: email }).select('+password');
    if (password === user.password) {
        console.log(1111);
    } else {
        console.log(222);
    }
    console.log(user);
    webhookController.sendToDiscord(req, res, next);
    //3. If everything ok, send token to client
    const token = '';
    res.status(200).json({
        status: 'success',
        token
    });
});