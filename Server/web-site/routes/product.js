var express = require('express');
var router = express.Router();
var multer = require('multer')
var upload = multer({
    dest: 'public/uploads/'
})

// Mongoose Schema
var ProductModel = require('../Schema/ProductModel')
var TargetModel = require('../Schema/TargetModel')
const roleAPI = require('../Library/roleAPI')

// [GET] list all product
router.get('/list/:loginCode/:id', async function(req, res, next) {
    try {
        if (req.params.id == 'all') {
            let a = await ProductModel.find({
                isRemove: false
            }).sort({
                'sort': -1
            })
            res.json(a)
        } else {
            let p = await ProductModel.findOne({
                _id: req.params.id,
                isRemove: false
            })
            // 聯動查詢針對性價格
            let t = await TargetModel.findOne({
                ShopCode: req.params.loginCode,
                ProductID: req.params.id
            })
            if (t) {
                p.priceItem = t.priceItem
                p.priceBatch = t.priceBatch
            }
            res.json(p)
        }
    } catch ( e ) {
        console.warn(e.message);
        res.json({})
    }
});

// [GET] show product by id
router.get('/name/:id', async function(req, res, next) {
    try {
        let p = await ProductModel.findOne({
            _id: req.params.id,
            isRemove: false
        })
        if (p) {
            res.json(p.name)
        } else {
            res.json('产品不存在')
        }

    } catch ( e ) {
        // statements
        console.log(e);
    }
});

// [GET] remove 刪除商品
router.get('/remove/:loginCode/:id', async function(req, res, next) {
    if (roleAPI.isAdmin(await roleAPI.codetoRole(req.params.loginCode))) {

        var p = await ProductModel.findOneAndUpdate(
            {
                _id: req.params.id
            },
            {
                $set: {
                    "isRemove": true
                }
            },
            {
                new: true
            }
        )

        // let r = await p.remove()
        if (p) {
            console.log(req.params.id + ' successfully deleted!');
            res.json('产品已删除')
        } else {
            res.json('遇到错误')
        }
    } else {
        res.json('用户权限不足')
    }

});

// [POST] new product & upload image
router.post('/new', upload.single('image'), async function(req, res, next) {
    var saveDate = new ProductModel({
        name: req.body.name,
        imageSrc: req.file.path,
        mimetype: req.file.mimetype,
        priceItem: req.body.priceItem,
        priceBatch: req.body.priceBatch,
        priceLowItem: req.body.priceLowItem,
        priceLowBatch: req.body.priceLowBatch,
        sort: req.body.sort
    })

    console.log(saveDate)

    try {
        let db = await saveDate.save()
        res.json({
            product: db,
            message: '商品添加成功'
        })
    } catch ( err ) {
        console.log(err)
        res.json({
            message: err.message
        })
    }
})

// [POST] updatePrice
router.post('/updatePrice/:pid', async function(req, res, next) {

    let p = await ProductModel.findOneAndUpdate({
        _id: req.params.pid
    }, {
        $set: {
            priceItem: req.body.priceItem,
            priceBatch: req.body.priceBatch,
            priceLowItem: req.body.priceLowItem,
            priceLowBatch: req.body.priceLowBatch
        }
    }, {
        new: true
    }
    )

    if (p) {
        res.json({
            isSuccess: true,
            product: p,
            message: '商品已更新价格'
        })
    } else {
        res.json({
            isSuccess: false,
            message: '遇到错误'
        })
    }
});

module.exports = router;