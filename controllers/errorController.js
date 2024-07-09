const AppError = require('../utils/appError');

/**
 * Handle cast DB Error
 * @param {Object} err
 * @return {Object} AppError
 */
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};
/**
 * Handle duplicate fields DB Error
 * @param {Object} err
 * @return {Object} AppError
 */
const handleDuplicateFieldsDB = err => new AppError('Invalid token Please login again', 400);

/**
 * Handle  validatation DB Error
 * @param {Object} err
 * @return {Object} AppError
 */
const handleValidationErrorDB = err => {
    //từ mảng error, lấy các value là mảng error của từng field -> lấy message trong các mảng đó
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Handle JWT Token Error
 * @param {Object} err
 * @return {Object} AppError
 */
const handleJWTTokenErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Expired token, please login again: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Handle expired JWT Token Error
 * @param {Object} err 
 * @returns {Object} AppError
 */
const handleTokenExpiredErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Send Error in Development
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 * @return {Object} AppError
 */
const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // console.log(req);
        res.status(err.statusCode).render('error', {
            title: '404',
            msg: err.message,
            user: req.user
        });
    }
};

/**
 * Send Error in Production
 * @param {Object} err
 * @param {Object} res
 * @return {Object} AppError
 */
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
            //Programming or other unknown err: dont leak err details
        }
        console.error('ERROR 💥', err);

        return res.status(500).json({
            status: 'error',
            message: 'Something wrong!!!'
        });
    }
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Some thing wrong!!!',
            msg: err.message,
        });
        //Programming or other unknown err: dont leak err details
    }
    console.error('ERROR 💥', err);

    return res.status(err.statusCode).render('error', {
        title: 'Some thing wrong!!!',
        msg: err.message
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTTokenErrorDB(error);
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredErrorDB(error);
        console.log(error.message);
        sendErrorProd(error, req, res);
    }
};