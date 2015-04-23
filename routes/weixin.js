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

var api = new API(config.appId, config.appSecret);

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/getJsConfig', function (req, res) {
    console.log(config);
    var url = req.body.url;
    if (!url) {
        res.json("参数\"page\"不能为空！");
    }

    var param = {
        debug: true,
        jsApiList: [
            'chooseImage',
            'previewImage',
            'uploadImage'],
        url: url
    };
    console.log(param);
    api.getJsConfig(param, function (err, result) {
        console.log(err);
        console.log('------------------------------');
        console.log(result);
        res.json(result);
    });
});

router.post('/getAuthUrl', function (req, res) {
    var page = req.body.page;
    if (!page) {
        res.json("参数\"page\"不能为空！");
    }

    var url = client.getAuthorizeURL(page, 'lijun2015', 'snsapi_userinfo');

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
        //var accessToken = result.data.access_token;
        var openid = result.data.openid;
        client.getUser(openid, function (err, result) {
            if (err) {
                res.json(err);
            }

            res.json(result);
        });
    });
});

router.post('/sendMessage', function (req, res) {
    var userId = req.body.userId,
        postId = req.body.postId,
        text = "";
    console.log(req.body);
    if (!userId) {
        res.json("参数\"userId\"不能为空！");
    }
    if (!postId) {
        res.json("参数\"postId\"不能为空！");
    }

    var query = new AV.Query(AV.User);
    query.get(userId, {
        success: function (user) {
            console.log(user.get("authData").weixin);

            // Do stuff
            text = "活动提醒\n" +
            "有人报名了您发起的活动\n" +
            "姓名:" + user.get("authData").weixin.nickname + "\n" +
            "联系方式:" + user.get("mobilePhoneNumber") + "\n" +
            "\n" +
            "<a href=\"http://fuwuhao.dianyingren.com/post_details.html?id=" + postId + "\">点击查看详情</a>"
            "\n";
            console.log(user.get("authData").weixin);

            api.sendText(user.get("authData").weixin.openid, text, function (err, result) {
                if (err) {
                    res.json(err);
                }

                res.json(result);
            });
        }
    });
});

router.post('/uploadImage', function (req, res) {
    console.log(req.body);

    var body = JSON.parse(req.body),
        userId = body.userId,
        serverIds = body.serverIds;
    console.log("userId" + userId);
    console.log("serverIds" + serverIds);

    //if (!userId) {
    //    return res.json("参数\"userId\"不能为空！");
    //}
    //if (serverIds.length <= 0) {
    //    return res.json("参数\"serverIds\"不能为空！");
    //}


    serverIds.forEach(function (e) {
        api.getMedia(e, function (err, result, res) {
            if (err) {
                return res.json("err:" + err);
            }
            console.log(e);

            var now = new Date();
            var file = new AV.File(now.getTime() + ".png", result);
            file.save().then(function () {
                console.log("success");

                // Execute any logic that should take place after the object is saved.
                //res.json({fileId: file.id});
            }, function (error) {
                // The file either could not be read, or could not be saved to AV.
                res.json({error: error.message});
            });
        });
    });
});

module.exports = router;
