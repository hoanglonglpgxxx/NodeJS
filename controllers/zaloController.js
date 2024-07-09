const crypto = require('crypto');
const moment = require('moment'); // npm install moment
const { default: axios } = require('axios');

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getCheckoutSession = catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.tourId);

    const config = {
        appid: "553",
        key1: "9phuAOYhan4urywHTh0ndEXiV3pKHr5Q",
        key2: "Iyz2habzyr7AG8SgvoBCbKwKi3UzlLi3",
        endpoint: "https://sandbox.zalopay.com.vn/v001/tpe/createorder"
    };

    const embeddata = {
        redirecturl: "https://drive.google.com/drive/u/0/folders/1wVx2_xZyEiPzmY59cIUc4vOWh2geUznU",
        promotioninfo: {
            campaigncode: "123",
        },
        columninfo: {
            branch_id: "123",
            store_id: "123",
            store_name: "ZaloPay Store",
            mc_campaign_id: "123",
        },
        merchantinfo: "embeddata123",
    };

    const items = [{
        itemid: `${tour.id}`,
        itemname: `${tour.name}`,
        itemprice: tour.price,
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
        amount: tour.price * 5000,
        description: "Lazada - Thanh toán đơn hàng #180208_007242",

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