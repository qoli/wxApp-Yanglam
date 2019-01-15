var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");
var fetch = require("node-fetch");
const querystring = require('querystring');

// Mongoose Schema
var OrderModel = require('../Schema/OrderModel')

// [GET] list
router.get('/list/:loginCode', async function(req, res, next) {
    let l
    if (req.params.loginCode == 'all') {
        l = await OrderModel.find()
    } else {
        l = await OrderModel.find({
            loginCode: req.params.loginCode
        })
    }

    if (l) {
        res.json({
            isSuccess: true,
            data: l
        })
    } else {
        res.json({
            isSuccess: false,
            message: '找不到对应订单'
        })
    }
});

// [GET] listOne
router.get('/listOne/:id', async function(req, res, next) {
    let l = await OrderModel.findOne({
        _id: req.params.id
    })

    if (l) {
        res.json({
            isSuccess: true,
            data: l
        })
    } else {
        res.json({
            isSuccess: false,
            message: '找不到对应订单'
        })
    }
});

// [GET] RePay
router.get('/RePay/:id', async function(req, res, next) {
    let l = await OrderModel.findOne({
        _id: req.params.id
    })
    res.json(l)
});

// [POST] RePay
router.post('/RePay/:id', async function(req, res, next) {

    let l = await OrderModel.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            isPay: true
        }
    }, {
        new: true
    }
    )

    res.json({
        isSuccess: true,
        data: l
    })
});

// [POST] AddCart
router.post('/newOrder', async function(req, res, next) {

    // console.log(req.body)

    var dbProductList = []
    var isR
    var tp = 0

    for (pl in req.body.productList) {

        // console.log(req.body.productList[pl])

        if (req.body.productList[pl].priceType == 'Item') {
            isR = true
        } else {
            isR = false
        }

        dbProductList.push({
            productId: req.body.productList[pl].productID,
            productName: req.body.productList[pl].productName,
            count: req.body.productList[pl].quantity,
            price: req.body.productList[pl].basePrice,
            isRetail: isR
        })

        tp = tp + req.body.productList[pl].basePrice
    }

    var saveDate = new OrderModel({
        loginCode: req.body.loginCode,
        productList: dbProductList,
        address: req.body.address.address,
        phone: req.body.address.phone,
        nickname: req.body.address.nickname,
        totalPrice: tp,
        isPay: false,
        isDeliver: false,
        deliverSerial: '' // 物流訂單號碼
    })

    console.log(saveDate)

    try {
        let db = await saveDate.save()
        res.json({
            isSuccess: true,
            data: db,
            message: '订单生成完毕'
        })
    } catch ( err ) {
        console.log(err)
        res.json({
            isSuccess: false,
            message: err.message
        })
    }
});

// [POST] Pay
router.post('/pay/:id', async function(req, res, next) {

    const response = await fetch('http://httpbin.org/ip')
    const ip = await response.json();
    console.log(ip);

    console.log(req.body)

    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=4_3
    // 支付文檔
    var str32 = randomstring.generate(32);
    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    var data = {
        appid: 'wxd81974d405fadd81',
        mch_id: '1514801521',
        device_info: 'wxApp',
        nonce_str: str32,
        sign: '',
        sign_type: 'MD5',
        body: '阳琅贸易-商品购买', // 商品简单描述，该字段请按照规范传递，具体请见参数规定
        out_trade_no: req.params.id + '0000000', // 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*且在同一个商户号下唯一。
        total_fee: req.body.totalPrice,
        spbill_create_ip: ip.origin,
        notify_url: '',
        trade_type: 'JSAPI'
    }

    console.log(data)

    // 拼接API密钥
    var stringA = querystring.stringify(data)
    var stringSignTemp = stringA + "&key=192006250b4c09247ec02edce69f6a2d"
    sign = MD5(stringSignTemp).toUpperCase()
    sign = hash_hmac("sha256", stringSignTemp, key).toUpperCase()
    console.log(sign)

    res.json({
        isSuccess: true,
        data: data
    })
});

module.exports = router;