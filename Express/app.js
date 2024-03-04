const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//1. Middleware
//console.log(process.env.NODE_ENV);
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
module.exports = app;