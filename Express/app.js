const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1. Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));//get detail of request
}
app.use(express.json());//express.json là 1 middleware
app.use(express.static(`${__dirname}/public`));

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
app.use('/api/v1/user', userRouter);

//run for all HTTP METHODS
app.all('*', (req, res, next) => { //handling unhandled routes
    /* res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    }); */

    const err = new Error(`Can't find ${req.originalUrl} on this server`);
    err.status = 'fail';
    err.statusCode = 404;

    next(err);
});

//GLOBAL ERROR HANDLING MIDDLEWARE
//tự nhảy vào middleware này khi lỗi
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;