var basicAuth = require('basic-auth');

var auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

    if (req.originalUrl.indexOf('/public/') === 0) {
        return next();
    }

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }
    if (user.name === 'r2qra3ggend8' && user.pass === 'Wcw6H@Gc6w78') {
        return next();
    } else {
        return unauthorized(res);
    }
};

module.exports = auth;
