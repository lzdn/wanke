var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var config = require('../config');
var AV = require('avoscloud-sdk').AV;
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");

/* GET users listing. */
router.get('/', function (req, res) {
    res.send(req.query.echostr);
    //res.send('respond with a resource');
});

router.post('/', wechat(config.token, function (req, res, next) {
    var message = req.weixin;
    console.log('req.weixin:' + req.weixin);
    console.log('req.body:' + req.body);
    if (message.MsgType === 'text') {
        var Keyword = AV.Object.extend('keyword');
        var query = new AV.Query(Keyword);
        query.find({
            success: function (results) {
                for (var x = 0; x < results.length; x++) {
                    if (results[x].get('key') == message.Content) {
                        res.reply(results[x].get('word'));
                    }
                }
            }
            ,
            error: function (results, error) {
                res.reply("服务器在向我们发起进攻，我们的工程师和首席打气官正英勇的与其战斗...");
            }
        });
    }else if((message.MsgType === 'event')){
        var Keyword = AV.Object.extend('keyword');
        var query = new AV.Query(Keyword);
        query.find({
            success: function (results) {
                for (var x = 0; x < results.length; x++) {
                    if (results[x].get('key') == message.EventKey) {
                        res.reply(results[x].get('word'));
                    }
                }
            }
            ,
            error: function (results, error) {
                res.reply("服务器在向我们发起进攻，我们的工程师和首席打气官正英勇的与其战斗...");
            }
        });
    }
}));


module.exports = router;
