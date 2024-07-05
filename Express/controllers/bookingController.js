const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const factoryHandler = require('./factoryHandler');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);
    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/my-tours?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [{
            price_data: {
                currency: 'usd',
                unit_amount: tour.price * 100,//convert to cents
                product_data: {
                    name: `${tour.name} Tour`,
                    description: `${tour.summary}`,
                    images: ['https://www.natours.dev/img/tours/tour-1-cover.jpg'],
                },
            },
            quantity: 1,
        }],
        mode: 'payment',
    });

    // 3) Send it to the client
    res.status(200).json({
        status: 'success',
        session
    });
});