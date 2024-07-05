const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
// const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const { default: axios } = require('axios');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');
const reviewRouter = require('./routes/reviewRoutes');

//GLOBAL MIDDLEWARES
//1. Set security HTTP headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'",
            "https://api.mapbox.com/mapbox-gl-js/v2.9.1/mapbox-gl.js",
            "https://cdnjs.cloudflare.com/ajax/libs/axios/1.7.2/axios.min.js",
            "ws://127.0.0.1:63670/"], //set script source to allow only from self and mapbox
        workerSrc: ["'self'", "blob:"], //set script source to allow only from self and mapbox
        connectSrc: ["'self'", "https://api.mapbox.com", "https://events.mapbox.com", "ws://127.0.0.1:63670/"], //set script source to allow only from self and mapbox
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
app.post('/zalopay', async (req, res) => {
    const config = {
        appid: "553",
        key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
        key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
        endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
    };

    const embeddata = {
        merchantinfo: "embeddata123",
    };

    const items = [{
        itemid: "knb",
        itemname: "kim nguyen bao",
        itemprice: 198400,
        itemquantity: 1
    }];

    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        appid: config.appid,
        apptransid: `${moment().format('YYMMDD')}_${transID}`, // mã giao dich có định dạng yyMMdd_xxxx
        appuser: "demo",
        apptime: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embeddata: JSON.stringify(embeddata),
        amount: 50000000,
        description: "ZaloPay Integration Demo",
        bankcode: "",
        // callbackurl: "https://5a2f-14-160-24-61.ngrok-free.app/callback",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = `${config.appid}|${order.apptransid}|${order.appuser}|${order.amount}|${order.apptime}|${order.embeddata}|${order.item}`;
    order.mac = crypto.createHmac('sha256', config.key1)
        .update(data)
        .digest('hex').toString();

    try {
        const result = await axios.post(config.endpoint, null, { params: order });
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
});

app.post('/callback', async (req, res) => {
    const config = {
        key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3"
    };

    const result = {};

    try {
        const dataStr = req.body.data;
        const reqMac = req.body.mac;

        const mac = crypto.createHmac('sha256', config.key2)
            .update(dataStr)
            .digest('hex').toString();
        console.log("mac =", mac);


        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
            // callback không hợp lệ
            result.returncode = -1;
            result.returnmessage = "mac not equal";
        }
        else {
            // thanh toán thành công
            // merchant cập nhật trạng thái cho đơn hàng
            const dataJson = JSON.parse(dataStr, config.key2);
            console.log("update order's status = success where apptransid =", dataJson.apptransid);

            result.returncode = 1;
            result.returnmessage = "success";
            //ở đây cần đoạn khi thành công thì lưu gì đó vào DB
        }
    } catch (ex) {
        result.returncode = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.returnmessage = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
});

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