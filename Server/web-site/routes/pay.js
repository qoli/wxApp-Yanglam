var express = require('express');
var router = express.Router();
var randomstring = require("randomstring");

var auth = require('../auth');

/* GET home page. */
router.get('/payment', function(req, res, next) {
    var str32 = randomstring.generate(32);
    url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    data = {
    	appid: 'wxd81974d405fadd81',
    	mch_id: '1514801521',
    	device_info: 'wxApp',
    	nonce_str: str32,
    	sign: '',
    	sign_type: 'MD5',
    	body: '',
    	detail: '',
    	attach: '',
    	out_trade_no: '',
    	total_fee:'',
    	spbill_create_ip:'',
    	notify_url:'',
    	trade_type:'JSAPI',
    	product_id: ''
    }
    res.render('index', {
        title: '阳琅贸易'
    });
});

module.exports = router;
