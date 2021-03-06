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
    var currentDate = new Date();
    var expireTime = new Date().setDate(config["expireTime"]);

    // 比较是否过期，没过期直接返回token
    if (currentDate >= expireTime) {
        console.log('--------------------------------');
        console.log('-----------token超时------------');
        api.getAccessToken(function (err, token) {
            if (err) return callback(err);
            // 记录token值
            config["access_token"] = token.accessToken;
            // 记录下一次过期时间点
            config["expireTime"] = token.expireTime;
            console.log('-----------token重新获取------------');
            console.log(token);

            callback(null, token);
        });

    } else {
        console.log('-----------token未超时------------');
        console.log('-----------token已获取------------');
        console.log(config["access_token"]);

        callback(null, config["access_token"]);
    }
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/getJsConfig', function (req, res) {
    console.log(config);
    var url = req.body.url;
    if (!url && url == "") {
        res.json("参数\"page\"不能为空！");
    }

    var param = {
        debug: false,
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'hideOptionMenu'],
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
    if (!page && page == "") {
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
    if (!code && code == "") {
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
    if (!userId && userId == "") {
        res.json("参数\"userId\"不能为空！");
    }
    if (!postId && postId == "") {
        res.json("参数\"postId\"不能为空！");
    }

    var post = AV.Object.extend('post');
    var post_query = new AV.Query(post);
    post_query.include("username");
    post_query.get(postId, function (post) {
        console.log("post.get('username').get('authData')" + post.get('username').get('authData'));
        var openId = post.get('username').get('authData').weixin.openid;
        var query = new AV.Query(AV.User);
        query.get(userId, {
            success: function (user) {
                // Do stuff
                text = "活动提醒\n" +
                "有人报名了您发起的活动\n" +
                "\n" +
                "姓名:" + user.get("authData").weixin.nickname + "\n" +
                "联系方式:" + user.get("mobilePhoneNumber") + "\n" +
                "\n" +
                "<a href=\"http://wanke.dianyingren.com/post_detail.html?id=" + postId + "\">点击查看详情</a>"
                "\n";
                console.log(user.get("authData").weixin);
                console.log(user.get("authData").weixin.openid);

                api.sendText(openId, text, function (err, result) {
                    if (err) {
                        res.json(err);
                    }

                    console.log(result);

                    res.json(result);
                });
            }
        });
    });

});

router.post('/uploadImage', function (req, res) {
    var serverId = req.body.serverId;
    if (!serverId && serverId == "") {
        return res.json("参数\"serverId\"不能为空！");
    }

    api.getMedia(serverId, function (err, result, response) {
        if (err) {
            return res.json("err:" + err);
        }

        var now = new Date();
        var file = new AV.File(now.getTime() + ".png", result);
        file.save().then(function (file) {
            console.log(file);
            //res.json("success");
            // Execute any logic that should take place after the object is saved.
            res.json({id: file.id, url: file.url()});
        }, function (error) {
            // The file either could not be read, or could not be saved to AV.
            res.json({error: error.message});
        });
    });
});
router.post('/publishMenu', function (req, res) {
    console.log(req.body);
    //var menu = {
    //    "button": [{
    //        "type": "view",
    //        "name": "易生活",
    //        "url": "http://fuwuhao.dianyingren.com/shop_index.html"
    //    }, {
    //        "type": "view",
    //        "name": "邻里圈",
    //        "url": "http://fuwuhao.dianyingren.com/post_index.html"
    //    }, {
    //        "type": "view",
    //        "name": "个人中心",
    //        "url": "http://fuwuhao.dianyingren.com/user_detail.html?code="
    //    }]
    //};
    var body = req.body;

    api.removeMenu(function (err, result) {
        if (err) {
            res.json(err);
        }

        if (body.menu.button.length > 0) {
            api.createMenu(body.menu, function (err, result) {
                if (err) {
                    res.json(err);
                }

                res.json(result);
            });
        } else {
            res.json({msg: "删除成功！"})
        }
    });
});

module.exports = router;
