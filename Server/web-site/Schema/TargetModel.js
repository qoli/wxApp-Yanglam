var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../Library/utils');
var ProductModel = require('../Schema/ProductModel')

var TargetSchema = new Schema({
    SalesmanCode: {
        type: String,
        required: [true, 'SalesmanCode is required']
    },
    ShopCode: {
        type: String,
        required: [true, 'ShopCode is required']
    },
    ProductID: {
        type: String,
        required: [true, 'ProductID is required']
    },
    priceItem: {
        type: Number,
        required: [true, 'priceItem is required']
    },
    priceBatch: {
        type: Number,
        required: [true, 'priceBatch is required']
    },
    created_at: Date
});

TargetSchema.pre('save', async function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    utils.dbLog(this)

    let p = await ProductModel.findOne({
        _id: this.ProductID
    })

    if (this.priceItem < p.priceLowItem) {
        next(new Error('每支价格过低（最低价：' + p.priceLowItem + '）'));
    }

    if (this.priceBatch < p.priceLowBatch) {
        next(new Error('每箱价格过低（最低价：' + p.priceLowBatch + '）'));
    }

    if (this.priceItem === 0) {
        next(new Error('缺少每支价格'));
    }

    if (this.priceBatch === 0) {
        next(new Error('缺少每箱价格'));
    }

    next();
});

var TargetModel = mongoose.model('Target', TargetSchema);
module.exports = TargetModel;