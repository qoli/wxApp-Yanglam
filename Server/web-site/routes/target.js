var express = require('express');
var router = express.Router();

// Mongoose Schema
var TargetModel = require('../Schema/TargetModel')


// [GET] all
router.get('/:ProductID', async function(req, res, next) {

    try {
        if (req.params.code === 'all') {
            let t = await TargetModel.find()
            res.json(t)
        } else {
            let t = await TargetModel.find({
                ProductID: req.params.ProductID
            })
            res.json(t)
        }
    } catch ( e ) {
        res.json({})
    }

});

// [POST] update
router.post('/update/:ProductID/:ShopCode', async function(req, res, next) {
    let t = await TargetModel.findOneAndUpdate({
        ProductID: req.params.ProductID,
        ShopCode: req.params.ShopCode
    }, {
        $set: {
            priceItem: req.body.priceItem,
            priceBatch: req.body.priceBatch
        }
    }, {
        new: true
    })

    if (t) {
        res.json({
            isSuccess: true,
            message: '价格更新成功',
            data: t
        })
    } else {
        res.json({
            isSuccess: false,
            message: '更新失败'
        })
    }

});

// [POST] new
router.post('/new', async function(req, res, next) {
    var saveDate = new TargetModel({
        SalesmanCode: req.body.SalesmanCode,
        ShopCode: req.body.ShopCode,
        ProductID: req.body.ProductID,
        priceItem: req.body.priceItem,
        priceBatch: req.body.priceBatch
    })

    try {
        let db = await saveDate.save()
        if (db) {
            res.json({
                isSuccess: true,
                data: db,
                message: '设定针对价格成功'
            })
        } else {
            res.json({
                isSuccess: false,
                message: '遇到错误'
            })
        }
    } catch ( e ) {
        console.log(e);
        res.json({
            isSuccess: false,
            message: e.message
        })
    }



});

module.exports = router;