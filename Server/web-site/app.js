var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment');

var app = express();

// Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
// mongodb 線上環境
// mongoose.connect("mongodb://WXaJxwWEB2:WtHSu68q@mongodb:27017/db_yanglam", {
//     useNewUrlParser: true
// });

// 本地開發環境
mongoose.connect("mongodb://WXaJxwWEB2:WtHSu68q@localhost:27017/db_yanglam", {
    useNewUrlParser: true
});

var db = mongoose.connection;
db.on('error',
    console.error.bind(console, 'connection error:')
);
db.once('open', function() {
    console.log('MongoDB Connected')
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app use
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Log handler
app.use(function(req, res, next) {
    console.log('');
    console.log('> Time         :', moment().format('MMMM Do YYYY, h:mm:ss a'));
    console.log('> Request Type :', req.method);
    console.log('> Request Url  :', req.originalUrl);
    console.log('_');
    next();
});

// http auth
var auth = require('./auth');
app.use(auth);

// 清理和優化
var optimize = require('./optimize');
optimize()

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/get', require('./routes/get'));
app.use('/login', require('./routes/login'));
app.use('/product', require('./routes/product'));
app.use('/target', require('./routes/target'));
app.use('/order', require('./routes/order'));

// 
app.use('/public', require('./routes/public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
