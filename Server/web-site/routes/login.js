var express = require('express');
var router = express.Router();
var fetch = require("node-fetch");

router.get('/codetosession/:code', async function(req, res, next) {
    console.log(req.params.code)

    let appid = "wxd81974d405fadd81"
    let appsecret = "4d30a7d0776c857b474bd5d12df7053b"
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + appsecret + '&js_code=' + req.params.code + '&grant_type=authorization_code'

    const response = await fetch(url)
    const r = await response.json();
    res.json(r);
});

module.exports = router;
