const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//GLOBAL MIDDLEWARES
//1. Set security HTTP headers
app.use(helmet());

//2. Get detail of request
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//3.Limit request from same
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, //1 hour
    message: 'Too many requests, please try again in an hour'
});

app.use('/api', limiter);//apply for all APIs
//4. Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//5. Data sanitization against NoSQL query injection, disable query injection in req.body, req.query, req.params
app.use(mongoSanitize());

//6. Data sanitization against XSS, clean any malicious HTML code
app.use(xss());

//8. Prevent parameter pollution, remove duplicate query string
app.use(hpp({
    whitelist: [
        'duration', 'ratingsQuantity', 'ratingsAverage', 'maxSize', 'difficulty', 'price'
    ]
}));//get the last query string

//9. Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);

    next();
});

//ROUTE
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);

/* app.get('/api/v1/tours/:id/:x?', getTour);

app.patch('/api/v1/tours/:id', updateTour);

app.delete('/api/v1/tours/:id', deleteTour); */


app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //method : Mounting Router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);


//run for all HTTP METHODS
app.all('*', (req, res, next) => { //handling unhandled routes
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//GLOBAL ERROR HANDLING MIDDLEWARE, tự nhảy vào middleware này khi lỗi
app.use(globalErrorHandler);

module.exports = app;