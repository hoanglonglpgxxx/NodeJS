const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//GLOBAL MIDDLEWARES
//1. Get detail of request
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//2.Count request from sender's IP, if too much -> block request
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, //1 hour
    message: 'Too many requests, please try again in an hour'
});

app.use('/api', limiter);//apply for all APIs
//3. Body parser, reading data from body into req.body
app.use(express.json());

//4. Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//3. Route
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

/* app.get('/api/v1/tours/:id/:x?', getTour);

app.patch('/api/v1/tours/:id', updateTour);

app.delete('/api/v1/tours/:id', deleteTour); */

app.use('/api/v1/tours', tourRouter); //method : Mounting Router
app.use('/api/v1/users', userRouter);


//run for all HTTP METHODS
app.all('*', (req, res, next) => { //handling unhandled routes
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//GLOBAL ERROR HANDLING MIDDLEWARE, tự nhảy vào middleware này khi lỗi
app.use(globalErrorHandler);

module.exports = app;