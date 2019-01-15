
var express = require('express');
var router = express.Router();

// Mongoose Schema
var RelateModel = require('../Schema/RelateModel')
var UserModel = require('../Schema/UserModel')
const roleAPI = require('../Library/roleAPI')

const passwordAPI = {
    newPassword: function() {
        return Math.floor(100000 + Math.random() * 900000)
    }
}

// [GET] init
router.get('/init', async function(req, res, next) {

    let saveAdministrator = new UserModel({
        role: "Administrator",
        loginCode: "admin",
        nickname: "管理员",
        password: "ehdhQ3CSrJv5"
    });
    let saveDeveloper = new UserModel({
        role: "Developer",
        loginCode: "dev",
        nickname: "开发者",
        password: "0$e8nE0"
    });
    try {
        let rA = await saveAdministrator.save()
        let rD = await saveDeveloper.save()
        res.json({
            rA: rA,
            rD: rD
        });
    } catch ( err ) {
        console.log(err)
        res.json(err.message)
    }

});

// [GET] shopByCode
router.get('/shopByCode/:code', async function(req, res, next) {

    if (req.params.code.length == 6 || req.params.code.length == 9) {
        let sh

        if (req.params.code.substring(0, 3) === 'SH:') {
            sh = await UserModel.findOne({
                loginCode: req.params.code
            })
        } else {
            sh = await UserModel.findOne({
                loginCode: "SH:" + req.params.code
            })
        }

        if (sh) {
            res.json({
                isMatch: true,
                message: sh.nickname + ' ' + sh.loginCode,
                shopCode: sh.loginCode
            })
        } else {
            res.json({
                isMatch: false,
                message: '没有此代码'
            })
        }
    } else {
        res.json({
            isMatch: false,
            message: '请输入正确代码'
        })
    }

});

// [POST] removeUser
router.post('/removeUser', async function(req, res, next) {

    if (roleAPI.isAdmin(await roleAPI.codetoRole(req.body.delCode))) {
        res.json('目标用户无法删除')
        return false
    }

    if (roleAPI.isAdmin(await roleAPI.codetoRole(req.body.myCode))) {
        try {
            var user = await UserModel.findOneAndRemove(
                {
                    "loginCode": req.body.delCode
                }
            )
            res.json('用戶已經被刪除')
            return true
        } catch ( e ) {
            // statements
            console.log(e);
            res.json('遇到错误')
        }
    }
    res.json('遇到错误')
    return false
});

// 
// myCode: wepy.$instance.globalData.apiUser.loginCode,
// otherCode: this.shopCode
// [POST] resetPassword 重置密码到 888888
router.post('/resetPassword', async function(req, res, next) {
    var nextStep = false
    var newPass = 888888

    // 判断管理员与否
    if (roleAPI.isAdmin(await roleAPI.codetoRole(req.body.myCode))) {
        nextStep = true
    }

    // 判断修改密码发起人是否为商户邀请人
    var otherCode = await UserModel.findOne({
        "loginCode": req.body.otherCode
    })
    if (otherCode.inviteCode === req.body.myCode) {
        nextStep = true
    }

    // 修改逻辑
    if (nextStep) {
        var user = await UserModel.findOneAndUpdate(
            {
                "loginCode": req.body.otherCode
            },
            {
                $set: {
                    "password": newPass
                }
            },
            {
                new: true
            }
        ).select("+password")
        if (user) {
            res.json({
                isSuccess: true,
                data: user,
                message: '新密码：' + newPass
            })
        } else {
            res.json({
                isSuccess: false,
                message: '密码重置失败'
            })
        }
    } else {
        res.json({
            isSuccess: false,
            message: '用户权限不足'
        })
    }

});



// [POST] updatePassword
router.post('/updatePassword', async function(req, res, next) {
    console.log(req.body)
    var user = await UserModel.findOneAndUpdate(
        {
            "loginCode": req.body.myCode
        },
        {
            $set: {
                "password": req.body.newPassword
            }
        },
        {
            new: true
        }
    ).select("+password")
    if (user) {
        res.json({
            isSuccess: true,
            data: user,
            message: '新密码：' + req.body.newPassword
        })
    } else {
        res.json({
            isSuccess: false,
            message: '密码重置失败'
        })
    }
});

// [GET] /byInviteCode/:code
router.get('/byInviteCode/:code', async function(req, res, next) {
    try {
        let u = await UserModel.find({
            inviteCode: req.params.code
        })
        if (u) {
            res.json(u)
        } else {
            res.json([{}])
        }
    } catch ( e ) {
        res.json([{}])
    }

});


// [GET] query users by code
router.get('/list/:loginCode', async function(req, res, next) {

    try {
        if (req.params.loginCode === "all") {
            let allUsers = await UserModel.find()
            res.json(allUsers)
        } else {
            let user = await UserModel.find({
                loginCode: req.params.loginCode
            })
            res.json(user)
        }
    } catch ( e ) {
        res.json([{}])
    }

});

// [POST] 登入用戶
router.post('/login', async function(req, res) {

    console.log(req.body)

    try {
        let user = await UserModel.findOne({
            loginCode: req.body.loginCode
        }).select("+password")

        let isMatch = user.comparePassword(req.body.password)

        if (isMatch) {
            res.json({
                isMatch: isMatch,
                role: user.role,
                nickname: user.nickname,
                loginCode: user.loginCode,
                inviteCode: user.inviteCode
            });
        } else {
            res.json({
                isMatch: isMatch
            });
        }

    } catch ( e ) {
        // statements
        console.log(e);
        res.json(e.message)
    }
});

// [GET] 生成唯一代号
router.get('/codeGenerate/:role', async function(req, res, next) {
    var r = "";
    switch (req.params.role) {
    case "Salesman":
        r = "SA:" + Math.floor(100000 + Math.random() * 900000)
        break;
    case "Shop":
        r = "SH:" + Math.floor(100000 + Math.random() * 900000)
        break;
    default:
        r = "unknow"
        break;
    }

    let user = await UserModel.findOne({
        loginCode: r
    })

    if (!user) {
        res.json(r)
    }

    if (user) {
        res.json('生成代号重复，请再试一次')
    }


});

//[POST] newUser
router.post('/newUser', async function(req, res, next) {
    //获得 POST 内容:req.body.name

    let saveData = {
        role: req.body.role,
        inviteCode: req.body.inviteCode,
        loginCode: req.body.code,
        nickname: req.body.name,
        address: req.body.address,
        password: 888888
    }
    let saveDB = new UserModel(saveData);

    try {
        await saveDB.save()
        res.json(saveData);
    } catch ( err ) {
        console.log(err)
        res.json(err.message)
    }


});

// [GET] openid
router.get('/openidLogin/:openid', async function(req, res, next) {
    if (req.params.openid === 'undefined') {
        res.json({
            isSuccess: false,
            message: '此代码无法登入'
        })
        return false
    }
    let data = await RelateModel.findOne({
        openid: req.params.openid
    })

    if (data) {
        let user = await UserModel.findOne({
            loginCode: data.username
        })
        res.json({
            isSuccess: true,
            data: user
        })
    } else {
        res.json({
            isSuccess: false,
            message: '此用戶尚未激活微信登入'
        })
    }

});

// [GET] 用户名和openid关联
router.get('/link/:username/:openid', function(req, res, next) {

    var saveDB = new RelateModel({
        username: req.params.username,
        openid: req.params.openid
    });

    saveDB.save(function(err) {
        if (err) console.log(err)
    });

    res.json(saveDB)
});


module.exports = router;