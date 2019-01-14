var _ = require('underscore')
var fs = require('fs');
var path = require('path');

var ProductModel = require('./Schema/ProductModel')

async function optimize() {
    console.log('> 清理不在數據庫的對應文件')

    let allProduct = await ProductModel.find()
    var dbProduct = new Array()
    for (var i = allProduct.length - 1; i >= 0; i--) {
        dbProduct.push(allProduct[i].imageSrc)
    }

    var filePath = __dirname + '/public/uploads';
    fs.readdir(filePath, function(err, files) {
        var fileProduct = new Array()

        for (var i = files.length - 1; i >= 0; i--) {
            fileProduct.push('public/uploads/' + files[i])
        }

        var diff = _.difference(fileProduct, dbProduct)

        for (var i = diff.length - 1; i >= 0; i--) {
            rmPath = __dirname + '/' + diff[i]
            fs.unlinkSync(rmPath)
        }
    })

}

module.exports = optimize;
