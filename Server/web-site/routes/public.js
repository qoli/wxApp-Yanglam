var express = require('express');
var router = express.Router();

router.get('/uploads/*', async function(req, res, next) {

    res.redirect(req.originalUrl.substr(7))
});


module.exports = router;
