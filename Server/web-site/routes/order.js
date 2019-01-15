var express = require('express');
var router = express.Router();
var fetch = require("node-fetch");
const querystring = require('querystring');
const crypto = require('crypto');
const {toXML} = require('jstoxml');
const parser = require('xml2json');

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

        tp = tp + req.body.productList[pl].basePrice * req.body.productList[pl].quantity
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

    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=9_1
    // https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=4_3

    // 準備數據
    var data = {
        appid: 'wxd81974d405fadd81',
        mch_id: 1514801521,
        device_info: 'wxApp',
        nonce_str: get_nonce_str(32),
        sign_type: 'MD5',
        body: '阳琅贸易-商品购买', // 商品简单描述，该字段请按照规范传递，具体请见参数规定
        out_trade_no: req.params.id + '0000000', // 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*且在同一个商户号下唯一。
        total_fee: parseInt(req.body.totalPrice * 100),
        spbill_create_ip: ip.origin,
        notify_url: 'http://wxpay.wxutil.com/pub_v2/pay/notify.v2.php',
        trade_type: 'JSAPI',
        openid: req.body.openid
    }

    // 顯示結果
    data['sign'] = dataSign(data)
    console.log(data)

    // to XML
    var xml = toXML(data);
    xml = '<xml>' + xml + '</xml>'
    console.log(xml)

    // 统一支付接口
    var wechatResponse = await fetch('https://api.mch.weixin.qq.com/pay/unifiedorder', {
        method: 'post',
        body: xml,
        headers: {
            'Content-Type': 'text/xml'
        },
    })
    const r = await wechatResponse.text();
    console.log(r)

    // to JSON
    var rJSON = parser.toJson(r);
    rJSON = JSON.parse(rJSON)
    console.log(rJSON)
    console.log(rJSON.xml.return_msg)

    // return 
    switch (rJSON.xml.return_code) {
    case 'FAIL':
        res.json({
            isSuccess: false,
            message: rJSON.xml.return_msg
        })
        break;
    case 'SUCCESS':
        res.json({
            isSuccess: true,
            message: rJSON.xml.return_msg,
            data: rJSON.xml,
            nonceStr: data.nonceStr,
            paySign: data.sign
        })
        break;
    default:
        res.json({
            isSuccess: false,
            message: rJSON.xml.return_msg
        })
        break;
    }
});

// [POST] packageSign
router.post('/packageSign', async function(req, res, next) {

    // 準備數據
    var data = {
        appid: 'wxd81974d405fadd81',
        nonce_str: get_nonce_str(32),
        package: req.body.package,
        signType: 'MD5',
        timeStamp: req.body.timeStamp
    }

    data['sign'] = dataSign(data)
    console.log(data)

    // JSON to XML
    var xml = toXML(data);
    xml = '<xml>' + xml + '</xml>'
    console.log(xml)

    res.json({
        data: data
    })
});

module.exports = router;

/**
 * 生成指定长度的随机数
 * @param {*int} len 
 */
const get_nonce_str = (len) => {
    let str = '';
    while (str.length < len) {
        str += Math.random().toString(36).slice(2);
    }
    return str.slice(-len);
}

function dataSign(data) {
    const key = 'deEHnEqQwfslTxqr94GNoQKeNr7GrYf6'
    // js的默认排序即为ASCII的从小到大进行排序(字典排序)
    let arr = Object.keys(data).sort().map(item => {
        return `${item}=${data[item]}`;
    });
    let stringSignTemp = arr.join('&') + '&key=' + key;
    // md5
    var sign = crypto.createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase()
    return sign
}