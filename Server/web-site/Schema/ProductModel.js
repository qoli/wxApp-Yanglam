var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../Library/utils');

var ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    imageSrc: {
        type: String,
        required: [true, 'imageSrc is required']
    },
    mimetype: {
        type: String,
        required: [true, 'mimetype is required']
    },
    priceItem: {
        type: Number,
        required: [true, 'priceItem is required']
    },
    priceBatch: {
        type: Number,
        required: [true, 'priceBatch is required']
    },
    priceLowItem: {
        type: Number,
        required: [true, 'priceLowItem is required']
    },
    priceLowBatch: {
        type: Number,
        required: [true, 'priceLowBatch is required']
    },
    isRemove: {
        type: Boolean,
        default: false
    },
    sort: {
        type: Number,
        default: 0
    },
    created_at: Date
});

ProductSchema.pre('save', async function(next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    if (!this.created_at) {
        this.created_at = currentDate;
    }
    utils.dbLog(this)

    if (this.name === '') {
        next(new Error('缺少名称'));
    }

    if (this.imageSrc === '') {
        next(new Error('缺少图片'));
    }

    if (this.priceItem === 0) {
        next(new Error('缺少每支价格'));
    }

    if (this.priceBatch === 0) {
        next(new Error('缺少每箱价格'));
    }

    // 最低价移除
    // if (this.priceLowItem === 0) {
    //     next(new Error('缺少每支最低价'));
    // }
    // if (this.priceLowBatch === 0) {
    //     next(new Error('缺少每箱最低价'));
    // }

    if (this.priceLowItem >= this.priceItem) {
        next(new Error('每支最低价大约每支价格'));
    }

    if (this.priceLowBatch >= this.priceBatch) {
        next(new Error('每箱最低价大约每箱价格'));
    }

    next();
});

var ProductModel = mongoose.model('Product', ProductSchema);
module.exports = ProductModel;