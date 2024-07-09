const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
// const CryptoJS = require('crypto-js'); // npm install crypto-js

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const zalopayRouter = require('./routes/zaloRoutes');

//GLOBAL MIDDLEWARES
//1. Set security HTTP headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
            "'self'",
            "https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js",
            "https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js",
            "https://js.stripe.com/v3/",
            "ws://127.0.0.1:51311/"], //set script source to allow only from self and mapbox
        workerSrc: ["'self'", "blob:"], //set script source to allow only from self and mapbox
        connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com", "https://js.stripe.com/v3/", "ws://127.0.0.1:51311/"], //set script source to allow only from self and mapbox
        imgSrc: ["'self'", "https://*.mapbox.com", "data:"],
        frameSrc: ["'self'", "https://js.stripe.com/"] // Add this line to allow frames from Stripe
    }
}));

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
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

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
    next();
});

//ROUTE
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter); //method : Mounting Router
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/zalopay', zalopayRouter);
/* app.post('/payment', async (req, res) => {
    //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    //parameters
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const orderInfo = 'pay with MoMo';
    const partnerCode = 'MOMO';
    const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
    const requestType = "payWithMethod";
    const amount = '50000';
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = '';
    const paymentCode = 'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
    const orderGroupId = '';
    const autoCapture = true;
    const lang = 'vi';

    //before sign HMAC SHA256 with format
    //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    //puts raw signature
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);
    //signature
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    //option for axios
    const options = {
        method: 'POST',
        url: 'https://test-payment.momo.vn/v2/gateway/api/create',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        },
        data: requestBody
    };

    let result;
    try {
        result = await axios(options);
        return res.status(200).json({
            status: 'success',
            data: result.data
        });
    } catch (err) {
        return res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}); */

/* app.post('/order-status', async (req, res) => {
    
let postData = {
    appid: config.appid,
    apptransid: "<apptransid>", // Input your apptransid
}

let data = postData.appid + "|" + postData.apptransid + "|" + config.key1; // appid|apptransid|key1
postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


let postConfig = {
    method: 'post',
    url: config.endpoint,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify(postData)
};

axios(postConfig)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
}) */


//run for all HTTP METHODS
app.all('*', (req, res, next) => { //handling unhandled routes
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

//GLOBAL ERROR HANDLING MIDDLEWARE, tự nhảy vào middleware này khi lỗi
app.use(globalErrorHandler);

module.exports = app;