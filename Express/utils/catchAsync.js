const AppError = require('./appError');
const writeLog = require('./writeLog');

module.exports = fn => (req, res, next) => {
    fn(req, res, next).catch(err => {
        res.statusCode = 400;
        writeLog(req, res);
        next(new AppError(err.message, 400));
    });
};

