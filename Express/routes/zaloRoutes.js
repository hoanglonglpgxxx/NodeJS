const express = require('express');

const zaloController = require('../controllers/zaloController');

const router = express.Router();

router.post(
    '/payment/:tourId',
    // authController.protect,
    zaloController.getCheckoutSession
);

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

router.post('/payment',);
module.exports = router;