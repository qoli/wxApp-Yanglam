var express = require('express');
var router = express.Router();
var moment = require('moment');

// Mongoose Schema
var OrderModel = require('../Schema/OrderModel')

router.get('/notify_url', function(req, res, next) {
    res.send('SUCCESS');
});

router.post('/notify_url/:id', async function(req, res, next) {
    console.log('＊＊＊');
    console.log('> Wechat Call  :');
    console.log('> POST         :', '\x1b[33m' + moment().format('MMMM Do YYYY, h:mm:ss a') + '\x1b[0m');
    console.log(req.body)
    console.log('＊＊＊');
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
    res.send('<xml> <return_code><![CDATA[SUCCESS]]></return_code> <return_msg><![CDATA[OK]]></return_msg> </xml>');
});

module.exports = router;
