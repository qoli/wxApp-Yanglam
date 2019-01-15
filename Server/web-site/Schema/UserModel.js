var moment = require('moment');
var mongoose = require('mongoose');

// https://www.npmjs.com/package/bcrypt
var bcrypt = require('bcrypt');
const saltRounds = 10;

var Schema = mongoose.Schema;

var utils = require('../Library/utils');

var roleArray = ['Administrator', 'Developer', 'Salesman', 'Shop'];
var UserSchema = new Schema({
    role: {
        type: String,
        enum: roleArray
    },
    inviteCode: String,
    loginCode: String,
    nickname: String,
    address: String,
    password: {
        type: String,
        select: false
    },
    openid: String,
    created_at: Date
});

// comparePassword
UserSchema.methods.comparePassword = function(candidatePassword) {
return bcrypt.compareSync(candidatePassword, this.password);
};

UserSchema.pre('findOneAndUpdate', async function(next) {
    doc = this._update.$set
    if (doc.hasOwnProperty('password')) {
        doc.password = bcrypt.hashSync(doc.password.toString(), saltRounds);
    }
    next();
});

// 排重和密碼加密
UserSchema.pre('save', async function(next) {
    var currentDate = new Date();
    utils.dbLog(this)

    let isExist = await UserModel.find({
        loginCode: this.loginCode
    })
    if (isExist.length > 0) {
        var err = new Error('loginCode already exists in system');
        next(err);
    }

    if (isExist.length == 0) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        this.updated_at = currentDate;
        if (!this.created_at) {
            this.created_at = currentDate;
        }
        next();
    }

});

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;