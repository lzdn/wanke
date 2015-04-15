/**
 * Created by amberglasses on 15/3/30.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var API = require('wechat-api');
var OAuth = require('wechat-oauth');
var client = new OAuth(config.appId, config.appSecret);
var fs = require('fs');

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
        url: config.authUrl + "/post_save.html"
    };
    console.log(param);
    api.getJsConfig(param, function (err, result) {
        console.log(err);
        console.log('------------------------------');
        console.log(result);
        res.json(result);
    });
});

router.get('/getMenu', function (req, res) {

});


module.exports = router;
