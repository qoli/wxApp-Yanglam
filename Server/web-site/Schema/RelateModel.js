var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var utils = require('../Library/utils');

var RelateSchema = new Schema({
    username: String,
    openid: String,
    created_at: Date
});
var RelateModel = mongoose.model('Relate', RelateSchema);

// 排重保存
RelateSchema.pre('save', async function(next) {
    var currentDate = new Date();
    utils.dbLog(this)

    let isExist = await RelateModel.find({
        openid: this.openid
    })
    if (isExist.length > 0) {
        var err = new Error('[Mongoose] RelateModel: unsave, isExist.length: ' + isExist.length);
        next(err);
    }

    if (isExist.length == 0) {
        this.updated_at = currentDate;
        if (!this.created_at) {
            this.created_at = currentDate;
        }
        next();
    }
});


module.exports = RelateModel;