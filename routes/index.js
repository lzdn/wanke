var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var config = require('../config');
var AV = require('avoscloud-sdk').AV;
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;

//exports.reply = wechat(config.access_token).text(function (message, req, res, next) {
//    // TODO
//    var Keyword = AV.Object.Extend('keyword');
//    var keyword = new Keyword();
//    var query = new AV.Query(Keyword);
//    query.find({
//        success: function (results) {
//            for (var x = 0; x < results.length; x++) {
//                if (results[x].get(message.trim()) != null || results[x].get(message.trim()) != '') {
//                    res.reply(results[x].get('word'));
//                }
//            }
//        }
//    })
//});
