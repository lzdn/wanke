/**
 * Created by amberglasses on 15/3/30.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var API = require('wechat-api');
var api = new API(config.appId, config.appSecret, function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile('access_token.txt', 'utf8', function (err, txt) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(txt));
    });
}, function (token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getJsConfig', function (req, res) {
    var param = {
        debug: false,
        jsApiList: ['chooseImage', 'previewImage'],
        url: config.authUrl
    };
    api.getJsConfig(param, function (err, result) {
        console.log(err);
        console.log('------------------------------');
        console.log(result);
    });
});

module.exports = router;
