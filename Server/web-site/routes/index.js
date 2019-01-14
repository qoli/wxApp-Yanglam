var express = require('express');
var router = express.Router();

var auth = require('../auth');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '阳琅贸易'
    });
});

module.exports = router;
