var express = require('express');
var router = express.Router();
var request = require('request');

let appid = "wxd81974d405fadd81"
let appsecret = "4d30a7d0776c857b474bd5d12df7053b"

router.get('/codetosession/:code', function(req, res, next) {
    console.log(req.params.code)

    // 和微信交换 session_key 和 openid
    request(
        'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + appsecret + '&js_code=' + req.params.code + '&grant_type=authorization_code', function(error, response, body) {
            r = JSON.parse(body)
            console.log(r)
            res.json(r);
        });
});

module.exports = router;
