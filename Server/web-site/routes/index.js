var express = require('express');
var router = express.Router();

var auth = require('../auth');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: '阳琅贸易'
    });
});

/* GET home page. */
router.get('/robots.txt', function(req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

module.exports = router;
