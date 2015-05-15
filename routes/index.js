var express = require('express');
var router = express.Router();
var wechat = require('wechat');
var config = require('../config');
var AV = require('avoscloud-sdk').AV;
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");

/* GET users listing. */
router.get('/', function(req, res) {
    res.send(req.query.echostr);
    //res.send('respond with a resource');
});

module.exports = router;
