const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const webhookController = require('./webhookController');

const signToken = id => jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN //có time để tự log out user sau 1 thời gian
});

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    //Login sau khi signup 
    webhookController.sendToDiscord(req, res, next);

    const token = signToken(newUser._id);

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
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    webhookController.sendToDiscord(req, res, next);
    //3. If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    webhookController.sendToDiscord(req, res, next);
    let token;
    //1. Getting token and check if it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('Require login to access', 401));
    }
    //2. Verify token
    const decoded = await promisify(jwt.verify(token, process.env.JWT_SECRET));
    console.log(decoded);
    //3. Check if user still exists

    //4. Check if user changed password after the token was issued
    next();
});