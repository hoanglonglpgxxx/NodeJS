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
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Send Error in Development
 * @param {Object} err
 * @param {Object} res
 * @return {Object} AppError
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

/**
 * Send Error in Production
 * @param {Object} err
 * @param {Object} res
 * @return {Object} AppError
 */
const sendErrorProd = (err, res) => {
    //Operation/trusted err: send msg to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        //Programming or other unknown err: dont leak err details
    } else {
        console.error('ERROR 💥', err);

        res.status(500).json({
            status: 'error',
            message: 'Something wrong!!!'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = err;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTTokenErrorDB(error);
        sendErrorProd(error, res);
    }
};