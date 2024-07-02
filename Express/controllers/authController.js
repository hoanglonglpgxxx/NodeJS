const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const webhookController = require('./webhookController');
const Email = require('./emaillHandler');

const signToken = id => jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN //có time để tự log out user sau 1 thời gian
});

const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000), // turn to milisec
    httpOnly: true //cookie cannot be accessed or modified in any way by the browser
};

/**
 * Tạo và gửi token cho user, sau đó trả về response
 * @param {Object} user 
 * @param {int} statusCode 
 * @param {Object} res 
 */
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined; //remove password from output

    if (process.env.NODE_ENV === 'production') { cookieOptions.secure = true; } //secure=true means will only send on https

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        lastPasswordChangeTime: req.body.lastPasswordChangeTime,
        role: req.body.role
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);

    //Login sau khi signup 
    webhookController.sendToDiscord(req, res, next);
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
        return next(new AppError('Incorrect email or password!', 401));
    }

    //Maxium login attemps to 
    /* const isMatch = (await user.correctPassword(password, user.password)) ? 1 : 0;
    console.log(isMatch);
    if (!isMatch) {
        user.loginAttempts += 1;
        await user.save();

        if (user.loginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
            return next(new AppError('You have been locked out for 12 hours', 401));
        }

        return next(new AppError('Incorrect email or password', 401));
    }

    user.loginAttempts = 0;
    await user.save(); */

    //3. If everything ok, send token to client
    createSendToken(user, 200, res);
    const token = signToken(user._id);
    res.token = token;
    webhookController.sendToDiscord(req, res, next);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000), //cookie chỉ tồn tại trong 10s
        httpOnly: true
    });
    // const token = req.headers.authorization.split(' ')[1];
    // blacklistToken(token);
    res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
    webhookController.sendToDiscord(req, res, next);
    let token;
    //1. Getting token and check if it's there
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('Require login to access', 401));
    }
    //2. Verify token
    const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
    );
    //3. Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user who has this token does no longer exist', 401));
    }
    //4. Check if user changed password after the token was issued
    if (currentUser.afterChangePassword(decoded.iat)) {
        return next(new AppError('User recently changed password, please login again', 401));
    }

    req.user = currentUser;
    next();
});

//RENDER PAGES, NO ERROR HANDLING
exports.isLoggedIn = catchAsync(async (req, res, next) => {
    webhookController.sendToDiscord(req, res, next);
    if (req.cookies.jwt) {
        try {
            //1. Verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );
            //2. Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            //3. Check if user changed password after the token was issued
            if (currentUser.afterChangePassword(decoded.iat)) {
                return next();
            }

            //There is a logged in user
            res.locals.user = currentUser; //all pug templates can access this res.locals.x variable
            return next();
        } catch (err) {
            return next();
        }

    }
    next();
});

exports.restrictRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1. get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with email address.', 404));
    }
    //2. generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //3. send to users'email
    const resetURL = `${req.protocol}://${req.hostname}/api/v1/users/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email!`;

    try {
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Your password reset token (valid for 10 minutes)',
        //     message: message
        // });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error sending the email. Try again later!', 500));
    }

    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //1. Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });//nếu passwordResetExpires > Date.now() thì mới lấy user - tức là token chưa hết hạn

    //2. If token has not expired, set new password for current user
    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3. Update changedPasswordAt property for the user
    //4. Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //1. Get user from collection
    const user = await User.findById(req.user.id).select('+password');
    //2. Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    //3. if so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    //4. log user in again, send jwt
    createSendToken(user, 200, res);
});