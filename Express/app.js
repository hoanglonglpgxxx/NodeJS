const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1. Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));//get detail of request
}
app.use(express.json());//express.json là 1 middleware
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});



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