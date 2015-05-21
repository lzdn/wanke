(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    loadwx();
    var load_href;
    $("#load").hide();
    //var $selected = $("#js-selected");
    //for(var i = 0; i<5;i++){
    //    $selected.append("<option value=\""+i+"&"+i+"\">\""+i+"\"</option>");
    //}
    //querytag();
    var skx = -5;
    var bload = 1;
    var length;
    var width = "";
    var tagname = "全部"
    $("select").change(function () {
        $(".Delete").empty();
        $(".am-form-field").val("");
        var adoremove = document.getElementsByClassName("doremove");
        if (adoremove.length < 5) {
            $("#load").hide();
        }
        selectchange(function (width) {
            $(".tagsearch").css("width", "" + width + "px");
            var iconleft = width - 20;
            $(" .am-selected-icon").css("left", "" + iconleft + "px")
        })
    })
    $(".am-form-field").keydown(function () {
        setTimeout(function () {
            if ($(".am-form-field").val() == "" && bload == 0) {
                $(".Delete").empty();
                $(".Publish").remove();
                $("hr").remove();
                skx = -5;
                var tag = $("select").val().split('&')[0];
                if (tag == "全部") {
                    loading(function () {
                        clickevent();
                    });
                } else {
                    loadtag(tag, function () {
                        clickevent();
                    });
                }
                bload = 1;
            }
        }, 20);
    });
    $(".am-input-group-label").on("click", function () {
        var val = $(".am-form-field").val();
        if (val != "") {
            AV.Query.doCloudQuery("select * from post where (content like \"" + val + "\")", {
                success: function (result) {
                    var select = result.results;
                    console.log(select)
                    var post = AV.Object.extend("post");
                    var tags = AV.Object.extend("tags");
                    var user = AV.Object.extend("User");
                    if (select.length != 0) {
                        $(".Delete").empty();
                        $(".Publish").remove();
                        $("hr").remove();
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
                                    var imgpattern = "";
                                    var object = sele[0];
                                    var newtime = new Date().getTime();
                                    var imgs = object.get('relationimgs');
                                    if (imgs) {
                                        if (imgs.length == 1) {
                                            imgpattern = "imgpatternone"
                                        }
                                        if (imgs.length >= 2) {
                                            imgpattern = "imgpatterntwo"
                                        }
                                    }
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
                                        img: imgs,
                                        pattern: imgpattern
                                    };
                                    if (tagname != "全部") {
                                        if (tagname == tagvalue) {
                                            posts.push(osele);
                                        }
                                    } else {
                                        posts.push(osele);
                                    }
                                    console.log(osele);
                                    var $tpl = $('#usercontent');
                                    var source = $tpl.text();
                                    var template = Handlebars.compile(source);
                                    var data = {posts: posts};
                                    var html = template(data);
                                    $tpl.before(html);
                                    clickevent();
                                    var publish = document.getElementsByClassName("Publish").length;
                                    $(".Delete").empty();
                                    $("<p class=\"Delete am-sans-serif\">包含“" + val + "”的结果共“" + publish + "”条</p>").appendTo($("#field"));
                                }
                            })
                        }
                        bload = 0;
                    } else {
                        $(".Delete").empty();
                        $(".Publish").remove();
                        $("hr").remove();
                        $(".am-icon-spin-extend").remove();
                        $("<p class=\"Delete am-sans-serif\">关于“" + val + "”的查询结果不存在</p>").appendTo($("#publish"));
                        bload = 0;
                    }
                }
            });
        } else {
        }
    });
    $("#arrow").hide();
    skx = -5;
    loading(function () {
        var adoremove = document.getElementsByClassName("doremove");
        if (adoremove.length < 5) {
            $("#load").hide();
        }
        //$(".Publish").on("click", function () {
        //    var postview = $(this).attr("value");
        //    window.location.href = "post_detail.html?id=" + postview + "";
        //});
        $("#users").on("click", function () {
            window.location.href = "user_detail.html?code=";
        });
        clickevent();
        $("#foots").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                window.location.href = "post_save.html?code=";
            } else {
                $.post(server + "/weixin/getAuthUrl", {page: server + "/post_save.html"}, function (res) {
                    window.location.href = res.authUrl;
                })
            }
        });

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
            var tag = $("select").val().split('&')[0];
            if (bload != 0) {
                if (tag == "全部") {
                    loading(function () {
                        clickevent();
                    });
                } else {
                    loadtag(tag, function () {
                        clickevent();
                    });
                }

            }
        }
    });
    function loading(callbak) {
        $("#foots").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                load_href = server + "/post_detail.html";
            } else {
                $.post(server + "/weixin/getAuthUrl", {page: server + "/post_detail.html"}, function (res) {
                    load_href=res.authUrl;
                })
            }
        });


        $("#load").show();
        var post = AV.Object.extend("post");
        var user = AV.Object.extend("User");
        var query = new AV.Query(post);
        query.count({
            success: function (skip) {
                var newtime = new Date().getTime();
                query.descending("createdAt");
                skx += 5;
                if (skx >= skip) {
                    $("#load").hide();
                }
                query.limit(5).skip(skx);
                query.include("tagkey");
                query.include("relationimgs");
                query.include("username");
                query.find({
                    success: function (arry) {
                        var times = 0;
                        var posts = [];
                        var imgurls = [];
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
                                if (imgs.length >= 2) {
                                    imgpattern = "imgpatterntwo"
                                }
                            }
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
                                times = day + "天前"
                            } else {
                                var hours = parseInt(publishtime / 3600000);
                                if (hours > 0) {
                                    times = hours + "小时前";
                                }
                                else {
                                    var minute = parseInt(publishtime / 60000);
                                    if (minute > 0) {
                                        times = minute + "分钟前"
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
                                pattern: imgpattern,
                                href:load_href
                            };
                            posts.push(opost);
                        }
                        var $tpl = $('#usercontent');
                        var source = $tpl.text();
                        var template = Handlebars.compile(source);
                        var data = {posts: posts};
                        var html = template(data);
                        $tpl.before(html);
                        $("#load").hide();
                        callbak();
                    }
                });
            }
        });
    }

    function loadtag(tagid, callbak) {
        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        $(".Delete").empty();
        var query = new AV.Query(post);
        query.count({
            success: function (skip) {
                var newtime = new Date().getTime();
                query.descending("createdAt");
                skx += 5;
                if (skx >= skip) {
                    $("#load").hide();
                }
                query.limit(5).skip(skx);
                query.include("tagkey");
                query.include("relationimgs");
                query.include("username");
                var tag = new tags();
                tag.id = tagid;
                query.equalTo("tagkey", tag);
                query.find({
                    success: function (arry) {
                        var times = 0;
                        var posts = [];
                        var imgurls = [];
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
                                if (imgs.length >= 2) {
                                    imgpattern = "imgpatterntwo"
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
                                times = day + "天前"
                            } else {
                                var hours = parseInt(publishtime / 3600000);
                                if (hours > 0) {
                                    times = hours + "小时前";
                                }
                                else {
                                    var minute = parseInt(publishtime / 60000);
                                    if (minute > 0) {
                                        times = minute + "分钟前"
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
                        if (posts == "") {
                            $(".Delete").empty();
                            if ($(".Publish").length == 0) {
                                $("<p class=\"Delete am-sans-serif\">搜索结果不存在</p>").appendTo($("#field"));
                            }
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
            url: server + "/weixin/getJsConfig",
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
                        imgUrl: server + '/imgs/wankelife.jpg',
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
                        imgUrl: server + '/imgs/wankelife.jpg',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    })
                })
            },
            error: function (msg) {
                // alert(msg);
            }
        });
    }


    function selectchange(callback) {
        var tag = $("select").val().split('&')[0];
        var taglength = $("select").val().split('&')[1].length;
        tagname = $("select").val().split('&')[1];
        width = taglength * 15 + 45;
        if (tag == "全部") {
            $("hr").remove();
            $(".Publish").remove();
            skx = -5;
            loading(function () {
                clickevent();
                callback(width);
            });
        } else {
            $("hr").remove();
            $(".Publish").remove();
            skx = -5;
            loadtag(tag, function () {
                clickevent();
            });
            callback(width);
        }
    }

    function clickevent() {
        //$(".Publish").on("click", function () {
        //    var postview = $(this).attr("value");
        //    window.location.href = "post_detail.html?id=" + postview + "";
        //});
        $(".imgpreview").on("click", function () {
            var cur = $(this).attr("src");
            var url = $(this).parent(".images").attr("value");
            var arr = url.split(",");
            wx.previewImage({
                current: cur, // 当前显示的图片链接
                urls: arr // 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");
        var aimg_thumbnail = ($(".imgpatterntwo .img"));
        for (var i = 0; i < aimg_thumbnail.length; i++) {
            var url = aimg_thumbnail[i].className.split(" ")[1];
            aimg_thumbnail[i].className = ("imgthumbnail");
            console.log(aimg_thumbnail[i]);
            img_thumbnail($(".imgthumbnail"), url, 70);
            aimg_thumbnail[i].className = ("");
        }
    }

    function img_thumbnail(obj, url, length) {
        var img = new Image();
        img.src = url;
        img.onload = function () {
            var imgwidth = this.width;
            var imgHeight = this.height;
            if (imgwidth == imgHeight) {
                obj.css({
                    width: '' + length + 'px',
                    height: '' + length + 'px'
                });
            } else {
                if (imgwidth > imgHeight) {
                    var newmargin
                    var imgwidth = imgwidth / (imgHeight / length);
                    var newmargin = -(imgwidth - length) / 2;
                    obj.css({
                        height: '' + length + 'px'
                    });
                    obj.css("margin-left", "" + newmargin + "px");
                } else {
                    var newheight = imgHeight / (imgwidth / length);
                    newmargin = -(newheight - length) / 2;
                    obj.css({
                        width: '' + length + 'px',
                        height: '' + newheight + 'px'
                    });
                    obj.css("margin-top", "" + newmargin + "px");
                }
            }
        }
    }

    function location(href,value){
        alert(href+value);
       // window.location.href = href;
    }

})(jQuery);


