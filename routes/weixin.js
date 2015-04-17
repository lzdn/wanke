/**
 * Created by amberglasses on 15/3/30.
 */
var express = require('express');
var router = express.Router();
var config = require('../config');
var API = require('wechat-api');
var OAuth = require('wechat-oauth');
var fs = require('fs');
var path = require("path");
var AV = require('avoscloud-sdk').AV;
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
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

var api = new API(config.appId, config.appSecret, function (callback) {
    // 传入一个获取全局token的方法
    fs.readFile(path.join(__dirname, 'access_token.json'), 'utf8', function (err, txt) {
        if (err) {
            return callback(err);
        }
        callback(null, JSON.parse(txt));
    });
}, function (token, callback) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    fs.writeFile(path.join(__dirname, 'access_token.json'), JSON.stringify(token), callback);
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/getJsConfig', function (req, res) {
    console.log(config);
    var page = req.query.page;
    if (!page) {
        res.json("参数\"page\"不能为空！");
    }

    var param = {
        debug: true,
        jsApiList: [
            'chooseImage',
            'previewImage',
            'uploadImage'],
        url: config.url + "/" + page + ".html"
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
    var page = req.query.page;
    if (!page) {
        res.json("参数\"page\"不能为空！");
    }

    var url = client.getAuthorizeURL(config.url + "/" + page + ".html", 'lijun2015', 'snsapi_userinfo');

    res.json({
        authUrl: url
    });
});

router.post('/userSignUp', function (req, res) {
    var code = req.body.code,
        state = req.body.state;
    if (!code) {
        res.json("参数\"code\"不能为空！");
    }

    client.getAccessToken(code, function (err, result) {
        var accessToken = result.data.access_token;
        var openid = result.data.openid;
        client.getUser(openid, function (err, result) {
            AV.User._logInWith("weixin", {
                "authData": result,
                success: function (user) {
                    //返回绑定后的用户
                    console.dir(user);
                    res.json(user);
                },
                error: function (err) {
                    console.dir(err);
                    res.json(error);
                }
            });
        });
    });
});

router.post('/sendMessage', function (req, res) {
    var openId = req.body.openId,
        postId = req.body.postId,
        text = "";
    if (!openId) {
        res.json("参数\"openId\"不能为空！");
    }
    if (!postId) {
        res.json("参数\"postId\"不能为空！");
    }

    text = "活动提醒<br/>" +
    "<br/>" +
    "有人报名了您发起的活动<br/>" +
    "姓名: 李骏<br/>" +
    "联系方式: 18612260939<br/>" +
    "<br/>" +
    "<a href=\"http://fuwuhao.dianyingren.com/post_details.html?id=" + postId + "\">点击查看详情</a>>"
    "<br/>" +
    "";

    api.sendText(openId, text, function (err) {
        if (err) {
            res.json(err);
        }

        res.json("发送成功");
    });
});


module.exports = router;
