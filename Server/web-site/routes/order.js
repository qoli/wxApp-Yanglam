var express = require('express');
var router = express.Router();

// Mongoose Schema
var OrderModel = require('../Schema/OrderModel')

// [GET] list
router.get('/list/:loginCode', async function(req, res, next) {
    let l
    if (req.params.loginCode == 'all') {
        l = await OrderModel.find()
    } else {
        l = await OrderModel.find({
            loginCode: req.params.loginCode
        })
    }

    if (l) {
        res.json({
            isSuccess: true,
            data: l
        })
    } else {
        res.json({
            isSuccess: false,
            message: '找不到对应订单'
        })
    }
});

// [GET] listOne
router.get('/listOne/:id', async function(req, res, next) {
    let l = await OrderModel.findOne({
        _id: req.params.id
    })

    if (l) {
        res.json({
            isSuccess: true,
            data: l
        })
    } else {
        res.json({
            isSuccess: false,
            message: '找不到对应订单'
        })
    }
});

// [GET] RePay
router.get('/RePay/:id', async function(req, res, next) {
    let l = await OrderModel.findOne({
        _id: req.params.id
    })
    res.json(l)
});

// [POST] RePay
router.post('/RePay/:id', async function(req, res, next) {

    let l = await OrderModel.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            isPay: true
        }
    }, {
        new: true
    }
    )

    res.json({
        isSuccess: true,
        data: l
    })
});

// [POST] AddCart
router.post('/NewOrder', async function(req, res, next) {

    // console.log(req.body)

    var dbProductList = []
    var isR
    var tp = 0

    for (pl in req.body.productList) {

        // console.log(req.body.productList[pl])

        if (req.body.productList[pl].priceType == 'Item') {
            isR = true
        } else {
            isR = false
        }

        dbProductList.push({
            productId: req.body.productList[pl].productID,
            productName: req.body.productList[pl].productName,
            count: req.body.productList[pl].quantity,
            price: req.body.productList[pl].basePrice,
            isRetail: isR
        })

        tp = tp + req.body.productList[pl].basePrice
    }

    var saveDate = new OrderModel({
        loginCode: req.body.loginCode,
        productList: dbProductList,
        address: req.body.address.address,
        phone: req.body.address.phone,
        nickname: req.body.address.nickname,
        totalPrice: tp,
        isPay: false,
        isDeliver: false,
        deliverSerial: ''
    })

    console.log(saveDate)

    try {
        let db = await saveDate.save()
        res.json({
            isSuccess: true,
            data: db,
            message: '订单成功增加'
        })
    } catch ( err ) {
        console.log(err)
        res.json({
            isSuccess: false,
            message: err.message
        })
    }
});

module.exports = router;