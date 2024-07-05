const crypto = require('crypto');
const moment = require('moment'); // npm install moment
const { default: axios } = require('axios');

const express = require('express');

const router = express.Router();

router.post('/callback', async (req, res) => {
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

router.post('/payment', async (req, res) => {
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
module.exports = router;