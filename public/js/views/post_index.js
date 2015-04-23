(function ($) {
    loadwx();
    var skx = -5;
    var bload = 1;
    var length
    $(".am-form-field").keydown(function () {
        setTimeout(function () {
            if ($(".am-form-field").val() == "" && bload == 0) {
                // $(".Delete").empty();
                $(".Publish").remove();
                // $(".am-icon-spin-extend").remove();
                skx = -5;
                loading(function () {
                    $(".Publish").on("click", function () {
                        var postview = $(this).attr("value");
                        window.location.href = "post_detail.html?id=" + postview + "";
                    });
                    $(".imgpreview").on("click", function () {
                        var cur = $(this).attr("src");
                        var url = $(this).parent().attr("value");
                        var arr = url.split(",");
                        wx.previewImage({
                            current: cur, // 当前显示的图片链接
                            urls: arr// 需要预览的图片链接列表
                        });
                        event.stopPropagation();
                    });
                    $(".imgpreview").removeClass("imgpreview");
                });
                bload = 1;
            }
        }, 20);
    });
    $(".am-input-group-label").on("click", function () {
        var val = $(".am-form-field").val();
        if (val != "") {
            //  $(".Delete").empty();
            AV.Query.doCloudQuery("select * from post where (content like \"" + val + "\")", {
                success: function (result) {
                    var select = result.results;
                    var post = AV.Object.extend("post");
                    var tags = AV.Object.extend("tags");
                    var user = AV.Object.extend("User");
                    if (select.length != 0) {
                        $(".Delete").empty();
                        $(".Publish").remove();
                        $(".am-icon-spin-extend").remove();
                        length = select.length;
                        for (var i = 0; i < select.length; i++) {
                            console.log(select[i].id);
                            var posts = AV.Object.extend("post");
                            var query = new AV.Query(posts);
                            query.include("tagkey");
                            query.include("relationimgs");
                            query.include("username");
                            query.equalTo("objectId", select[i].id);
                            query.find({
                                success: function (sele) {
                                    var posts = [];
                                    var object = sele[0];
                                    console.log(object);
                                    var newtime = new Date().getTime();
                                    var imgs = object.get('relationimgs');
                                    console.log(imgs);
                                    var query = new AV.Query
                                    var avalue = object.id;
                                    var content = object.get('content');
                                    var otagkey = object.get("tagkey");
                                    var ousername = object.get("username").attributes.authData.weixin;
                                    var username = ousername.nickname;
                                    var headimgurl = ousername.headimgurl;
                                    var tagvalue = otagkey.get("tagtitle");
                                    var oldtime = object.createdAt.getTime();
                                    var publishtime = newtime - oldtime;
                                    var day = parseInt(publishtime / 86400000);
                                    if (day > 0) {
                                        times = day + "天"
                                    } else {
                                        var hours = parseInt(publishtime / 3600000);
                                        if (hours > 0) {
                                            times = hours + "小时";
                                        }
                                        else {
                                            var minute = parseInt(publishtime / 60000);
                                            if (minute > 0) {
                                                times = minute + "分钟"
                                            }
                                        }
                                    }
                                    var osele = {
                                        name: username,
                                        usersay: content,
                                        titleimg: headimgurl,
                                        tag: tagvalue,
                                        time: times,
                                        value: avalue,
                                        img: imgs
                                    };
                                    posts.push(osele);
                                    var $tpl = $('#usercontent');
                                    var source = $tpl.text();
                                    var template = Handlebars.compile(source);
                                    var data = {posts: posts};
                                    var html = template(data);
                                    $tpl.before(html);
                                    clickevent();
                                }
                            })
                        }
                        $("<p class=\"Delete am-sans-serif\">包含“" + val + "”的结果共“" + length + "”条</p>").appendTo($("#field"));
                        bload = 0;
                    } else {
                        $(".Delete").empty();
                        $(".Publish").remove();
                        $(".am-icon-spin-extend").remove();
                        $("<p class=\"Delete am-sans-serif\">关于“" + val + "”的查询结果不存在</p>").appendTo($("#field"));
                        bload = 0;
                    }
                }
            });
        } else {
        }
    });
    $("#arrow").hide();
    loading(function () {
        //this will now be null
        //$(".title").on("click",function(){
        //    var postview=$(this).attr("value");
        //    window.location.href="post_detail.html?"+postview+"";
        //});
        $(".Publish").on("click", function () {
            var postview = $(this).attr("value");
            window.location.href = "post_detail.html?id=" + postview + "";
        });
        $(".imgpreview").on("click", function () {
            var cur = $(this).attr("src");
            var url = $(this).parent().attr("value");
            var arr = url.split(",");
            wx.previewImage({
                current: cur, // 当前显示的图片链接
                urls: arr// 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");
        $("#users").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                window.location.href = "user_detail.html?code=";
            } else {
                $.post("http://fuwuhao.dianyingren.com/weixin/getAuthUrl", {page: "http://fuwuhao.dianyingren.com/user_detail.html"}, function (res) {
                    window.location.href = res.authUrl;
                })
            }
        });
        $(".Publish").on("click", function () {
            var postview = $(this).attr("value");
            window.location.href = "post_detail.html?id=" + postview + "";
        });
        $(".imgpreview").on("click", function () {
            var cur = $(this).attr("src");
            var url = $(this).parent().attr("value");
            var arr = url.split(",");
            wx.previewImage({
                current: cur, // 当前显示的图片链接
                urls: arr// 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");
        $("#foots").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                window.location.href = "post_save.html?code=";
            } else {
                $.post("http://fuwuhao.dianyingren.com/weixin/getAuthUrl", {page: "http://fuwuhao.dianyingren.com/post_save.html"}, function (res) {
                    window.location.href = res.authUrl;
                })
            }
        });
        if ($(".imgpreview").attr("value") != 1) {

        }
        $(".imgpreview").on("click", function () {
            var cur = $(this).attr("src");
            var url = $(this).parent().attr("value");
            var arr = url.split(",");
            wx.previewImage({
                current: cur, // 当前显示的图片链接
                urls: arr // 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");
    });
    $(window).scroll(function () {
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var newheight = window.screen.availHeight;
        if (scrollTop > 400) {
            $("#arrow").show().addClass("am-animation-fade");
        } else {
            $("#arrow").hide();
            $("#arrow").hide().removeClass("am-animation-fade");
        }
        if (scrollTop + newheight + 200 >= htmlHeight) {
            if (bload != 0) {
                loading(function () {
                    $(".Publish").on("click", function () {
                        var postview = $(this).attr("value");
                        window.location.href = "post_detail.html?id=" + postview + "";
                    });
                    $(".imgpreview").on("click", function () {
                        var cur = $(this).attr("src");
                        var url = $(this).parent().attr("value");
                        var arr = url.split(",");
                        wx.previewImage({
                            current: cur, // 当前显示的图片链接
                            urls: arr// 需要预览的图片链接列表
                        });
                        event.stopPropagation();
                    });
                    $(".imgpreview").removeClass("imgpreview");
                });
            }
        }
    });
    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);

        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        var query = new AV.Query(post);
        query.count({
            success: function (skip) {
                var newtime = new Date().getTime();
                query.descending("createdAt");
                skx += 5;
                if (skx >= skip) {
                    $("#load").remove();
                }
                query.limit(5).skip(skx);
                query.include("tagkey");
                query.include("relationimgs");
                query.include("username");
                query.find({
                    success: function (arry) {
                        var times = 0;
                        var posts = [];
                        var imgurls=[];
                        var imgpattern = "";
                        for (var i = 0; i < arry.length; i++) {
                            var object = arry[i];
                            var imgs = object.get('relationimgs');
                            var query = new AV.Query(File);
                            query.equalTo("objectId", imgs[i]);
                            if (imgs) {
                                if (imgs.length == 1) {
                                    imgpattern = "imgpatternone"
                                }
                                if (imgs.length == 2 || imgs.length == 4) {
                                    imgpattern = "imgpatterntwo"
                                }
                                if (imgs.length >= 3 && imgs.length != 4) {
                                    imgpattern = "imgpatternthree"
                                }
                            }
                            console.log(object);
                            var avalue = object.id;
                            var content = object.get('content');
                            var otagkey = object.get("tagkey");
                            var ousername = object.get("username").attributes.authData.weixin;
                            var username = ousername.nickname;
                            var headimgurl = ousername.headimgurl;
                            var tagvalue = otagkey.get("tagtitle");
                            var oldtime = object.createdAt.getTime();
                            var publishtime = newtime - oldtime;
                            var day = parseInt(publishtime / 86400000);
                            if (day > 0) {
                                times = day + "天"
                            } else {
                                var hours = parseInt(publishtime / 3600000);
                                if (hours > 0) {
                                    times = hours + "小时";
                                }
                                else {
                                    var minute = parseInt(publishtime / 60000);
                                    if (minute > 0) {
                                        times = minute + "分钟"
                                    } else {
                                        times = "刚刚"
                                    }
                                }
                            }
                            var opost = {
                                name: username,
                                usersay: content,
                                titleimg: headimgurl,
                                tag: tagvalue,
                                time: times,
                                value: avalue,
                                img: imgs,
                                pattern: imgpattern
                            };
                            posts.push(opost);

                        }
                        console.log(posts);
                        var $tpl = $('#usercontent');
                        var source = $tpl.text();
                        var template = Handlebars.compile(source);
                        var data = {posts: posts};
                        var html = template(data);
                        $tpl.before(html);
                        callbak();
                    }
                });
            }
        });
    }

    function loadwx() {
        var debug, appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.ajax({
            method: "POST",
            url: "http://fuwuhao.dianyingren.com/weixin/getJsConfig",
            data: JSON.stringify({
                url: window.location.href
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                debug = result.debug;
                appId = result.appId;
                jslist = result.jsApiList;
                noncestr = result.nonceStr;
                signature = result.signature;
                timestamp = result.timestamp;
                jsApiList = result.jsApiList;
                wx.config({
                    debug: debug,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timestamp, // 必填，生成签名的时间戳
                    nonceStr: noncestr, // 必填，生成签名的随机串
                    signature: signature,// 必填，签名，见附录1
                    jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    wx.onMenuShareTimeline({
                        title: '万科三联书社',
                        link: window.location.href,
                        imgUrl: 'http://fuwuhao.dianyingren.com/imgs/wankelife.jpg',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: '万科三联书社',
                        desc: '悦读 悦心 悦生活',
                        link: window.location.href,
                        type: 'link',
                        imgUrl: 'http://fuwuhao.dianyingren.com/imgs/wankelife.jpg',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    })
                })
            },
            error: function (msg) {
                alert(msg);
            }
        });
    }

    function clickevent() {
        $(".Publish").on("click", function () {
            var postview = $(this).attr("value");
            window.location.href = "post_detail.html?id=" + postview + "";
        });
        $(".imgpreview").on("click", function () {
            var cur = $(this).attr("src");
            var url = $(this).parent().attr("value");
            var arr = url.split(",");
            wx.previewImage({
                current: cur, // 当前显示的图片链接
                urls: arr// 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");
    }

})(jQuery);


