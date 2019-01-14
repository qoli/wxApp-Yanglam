var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../Library/utils');

var OrderSchema = new Schema({
    loginCode: String,
    productList: [{
        productId: String,
        productName: String,
        price: Number,
        count: Number,
        isRetail: Boolean
    }],
    address: String,
    phone: String,
    nickname: String,
    totalPrice: Number,
    isPay: Boolean, //已支付
    isDeliver: Boolean, //已发送
    deliverSerial: String, //物流编号
    isDone: Boolean, //已完成
    created_at: Date
});
var OrderModel = mongoose.model('Order', OrderSchema);

// 訂單時間
OrderSchema.pre('save', async function(next) {
    var currentDate = new Date();
    utils.dbLog(this)

    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    next();
});


module.exports = OrderModel;