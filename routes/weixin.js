/**
 * Created by amberglasses on 15/3/30.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var API = require('wechat-api');
var OAuth = require('wechat-oauth');
var fs = require('fs');
var client = new OAuth(config.appId, config.appSecret, function (openid, callback) {
    // 传入一个根据openid获取对应的全局token的方法
    fs.readFile(openid + ':access_token.txt', 'utf8', function (err, txt) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(txt));
    });
}, function (openid, token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    // 持久化时请注意，每个openid都对应一个唯一的token!
    fs.writeFile(openid + ':access_token.txt', JSON.stringify(token), callback);
});

var api = new API(config.appId, config.appSecret);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getJsConfig', function (req, res) {
    console.log(config);
    var param = {
        debug: true,
        jsApiList: [
            'chooseImage',
            'previewImage',
            'uploadImage'],
        url: config.url + "/post_save.html"
    };
    console.log(param);
    api.getJsConfig(param, function (err, result) {
        console.log(err);
        console.log('------------------------------');
        console.log(result);
        res.json(result);
    });
});

router.get('/getAuthUrl', function (req, res) {

    var url = client.getAuthorizeURL(config.url + "user_detail.html", 'lijun2015', 'snsapi_userinfo');

    res.json({
        authUrl: url
    });
})
;


module.exports = router;
