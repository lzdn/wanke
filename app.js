var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var amuiHelper = require('amui-hbs-helper')(hbs);
var wechat = require('wechat');
var config = require('./config');
var AV = require('avoscloud-sdk').AV;
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");


//hbs.registerPartials(widgetDir + '/slider/src');
hbs.registerPartial('user_accordion', "{{#this}}\n  <section data-am-widget=\"accordion\" class=\"am-accordion {{#if theme}}am-accordion-{{theme}}{{else}}am-accordion-default{{/if}}{{#if widgetId}} {{widgetId}}{{/if}}{{#if className}} {{className}}{{/if}}\"{{#if id}} id=\"{{id}}\"{{/if}} data-am-accordion='{ {{#if options.multiple}}\"multiple\": true{{/if}} }'>\n    {{#each content}}\n      <dl class=\"am-accordion-item{{#if active}} am-active{{/if}}\">\n        <dt class=\"am-accordion-title\">\n          {{{title}}}\n        </dt>\n        <dd class=\"am-accordion-bd am-collapse {{#if active}}am-in{{/if}}\">\n          <!-- 规避 Collapase 处理有 padding 的折叠内容计算计算有误问题， 加一个容器 -->\n          <div class=\"am-accordion-content am-accordion-content-extend\">\n            {{{content}}}\n          </div>\n        </dd>\n      </dl>\n    {{/each}}\n  </section>\n{{/this}}\n");

var routes = require('./routes/index');
var users = require('./routes/users');
var weixin = require('./routes/weixin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/weixin', weixin);
app.use('/', wechat(config.access_token).text(function (message, req, res, next) {
    // TODO
    var Keyword = AV.Object.Extend('keyword');
    var keyword = new Keyword();
    var query = new AV.Query(Keyword);
    query.find({
        success: function (results) {
            for (var x = 0; x < results.length; x++) {
                if (results[x].get(message) != null || results[x].get(message) != '') {
                    res.reply(results[x].get('word'));
                }
            }
        }
    })
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
