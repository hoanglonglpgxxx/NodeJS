const AppError = require('./appError');

module.exports = fn => (req, res, next) => {
    fn(req, res, next).catch(err => {
        res.statusCode = 400;
        next(new AppError(err.message, 400));
    });
};

