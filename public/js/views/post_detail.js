(function ($) {
    var saveurl = window.location.href;
    var number = "";
    var code = "";
    var relationuser = [];
    var marktags=["约吃","约玩","约聊","约运动"];
    var userlog, userid, queryobject, nickname, phonenumber, usersid, postId, tagvalue, openid, postview;
    if (saveurl.split("=").length - 1 > 1) {
        userlog = window.location.search.split('=')[2];
        code = userlog.split("&")[0];
        postview = window.location.search.split('=')[1].split("&")[0];
    } else {
        postview = window.location.search.split('=')[1];
    }
    loadwx();
    loading(function () {
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

        $("#btnname").on("click", function () {
            var currentUser = AV.User.current();
            if (currentUser) {
                usersid = currentUser.id;
                var query = new AV.Query(AV.User);
                query.get(usersid, {
                    success: function (user) {
                        phonenumber = user.get('mobilePhoneNumber');
                    }
                });
                if (relationuser) {
                        for (var i = 0; i < relationuser.length; i++) {
                            if (relationuser[i].id == usersid) {
                                $(".usercontent").remove();
                                $(" <p class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                                $("#btnname").remove();
                                $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                            }
                        }
                }else{
                    setTimeout(function () {
                        if (phonenumber) {
                            var imgurl = currentUser.get("authData").weixin.headimgurl;
                            $(".usercontent").remove();
                            $(" <p class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                            $("#btnname").remove();
                            $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                            $(" <img src=\"" + imgurl + "\" value=\" " + usersid + "&" + phonenumber + " \" class=\"am-radius\">").appendTo("#headtle");
                            $.ajax({
                                method: "POST",
                                url: "http://fuwuhao.dianyingren.com/weixin/sendMessage",
                                data: JSON.stringify({
                                    userId: usersid,
                                    postId: postview
                                }),
                                contentType: "application/json; charset=utf-8",
                                dataType: "json",
                                success: function (data) {
                                },
                                error: function (msg) {
                                }
                            });
                            //usersid  postId  openid
                            var post = AV.Object.extend("post");
                            var query = new AV.Query(post);
                            query.equalTo("objectId", postview);
                            query.get(postview, {
                                success: function (post) {
                                    post.add("relationuser", {id: usersid, url: imgurl, phonenumber: phonenumber});
                                    post.save();
                                },
                                error: function (object, error) {
                                    console.log(object);
                                }
                            });
                        } else {
                            $('#my-prompt').modal({
                                // relatedTarget: this,
                                onConfirm: function (e) {
                                    //e.data
                                    if (/^1[3|4|5|8]\d{9}$/.test(e.data)) {
                                        var query = new AV.Query(AV.User);
                                        query.get(usersid, {
                                            success: function (user) {
                                                user.set('mobilePhoneNumber', e.data);
                                                user.save()
                                            }
                                        });
                                    } else {
                                        alert("请输入正确的电话号码");
                                    }
                                },
                                onCancel: function (e) {
                                }
                            });
                        }
                    }, 100);
                }

            } else {
                alert("没有登录");
                $.ajax({
                    method: "POST",
                    url: "http://fuwuhao.dianyingren.com/weixin/getAuthUrl",
                    data: JSON.stringify({
                        page: saveurl
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        window.location.href = data.authUrl;
                    },
                    error: function (msg) {
                        alert(msg);
                    }
                });
                //    $.post("http://fuwuhao.dianyingren.com/weixin/getAuthUrl",{page:saveurl}, function (res) {
                //        window.location.href = res.authUrl;
                //})
            }
        });
    });

    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        var query = new AV.Query(post);
        query.include("tagkey");
        query.include("imgs");
        query.include("username");
        query.equalTo("objectId", postview);
        query.find({
            success: function (results) {
                var times = 0;
                var newtime = new Date().getTime();
                var tags = [];
                var imgpattern = "";
                var object = results[0];
                console.log(object);
                var content = object.get('content');
                var imgs = object.get('relationimgs');
                relationuser = object.get("relationuser");
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
                var otagkey = object.get("tagkey");
                number = object.get("username").get("mobilePhoneNumber");
                postId = object.get("username").id;
                openid = object.get("username").get("authData").weixin.openid;
                var ousername = object.get("username").attributes.authData.weixin;
                var username = ousername.nickname;
                var headimgurl = ousername.headimgurl;
                tagvalue = otagkey.get("tagtitle");
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
                // var tagvalue = object.get('tagkey');
                var opost = {
                    name: username,
                    titleimg: headimgurl,
                    usersay: content,
                    tag: tagvalue,
                    time: times,
                    img: imgs,
                    pattern: imgpattern,
                    relationuser:relationuser
                };
                tags.push(opost);
                var $tpl2 = $('#amz-tags');
                var source2 = $tpl2.text();
                var template2 = Handlebars.compile(source2);
                var data2 = {tags: tags};
                var html2 = template2(data2);
                $tpl2.before(html2);
                callbak();
                          $(".userphone").hide();
                         for(var i=0;i<marktags.length;i++){
                             if(marktags[i]==tagvalue){
                                 $(".userphone").show();
                             }
                         }


                if (relationuser) {
                    var currentUser = AV.User.current();
                    if (currentUser) {
                        usersid = currentUser.id;
                        for (var i = 0; i < relationuser.length; i++) {
                            if (relationuser[i].id == usersid) {
                                $(".usercontent").remove();
                                $("<p id=\"usercontent\" class=\"usercontent am-sans-serif\">联系方式："+number+"</p>").prependTo(".usercont");
                                $("#btnname").remove();
                                $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                            }
                        }
                    }
                }

            }

        });


        if (code != "") {
            $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
                queryobject = res;
                nickname = res.nickname;
                AV.User._logInWith("weixin", {
                    "authData": res,
                    success: function (user) {
                        userid = user.id;
                        queryobject = user.get("authData");
                        var query = new AV.Query(AV.User);
                        query.get(userid, {
                            success: function (user) {
                                user.set('nickname', nickname);
                                user.save()
                            }
                        });

                        if (relationuser) {
                            var currentUser = AV.User.current();
                            if (currentUser) {
                                usersid = currentUser.id;
                                for (var i = 0; i < relationuser.length; i++) {
                                    if (relationuser[i].id == usersid) {
                                        $(".usercontent").remove();
                                        $("<p id=\"usercontent\" class=\"usercontent am-sans-serif\">联系方式："+number+"</p>").prependTo(".usercont");
                                        $("#btnname").remove();
                                        $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                                    }
                                }
                            }
                        }
                    }
                })
            });
        }


    }

    function loadwx() {
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.get("http://fuwuhao.dianyingren.com/weixin/getJsConfig?page=post_index", function (result) {
            console.log(result);
            appId = result.appId;
            jslist = result.jsApiList;
            noncestr = result.nonceStr;
            signature = result.signature;
            timestamp = result.timestamp;
            jsApiList = result.jsApiList;
            wx.config({
                debug: false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: noncestr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });
    }


})(jQuery);

//{
//    "weixin"
//:
//    {
//        "sex"
//    :
//        1, "nickname"
//    :
//        "动名词", "city"
//    :
//        "Mudanjiang", "headimgurl"
//    :
//        "http://wx.qlogo.cn/mmopen/PiajxSqBRaEJgfrRe3VDiaNqFHsR4dBj8Z5rWgsr0icBXAiaY1DmjoNBg85PILc6WQw1sgACOUsGNibYp2QW5KgeRpw/0", "openid"
//    :
//        "omoCDjmkB3VOX-C8SX5-AfE6GmHU", "language"
//    :
//        "zh_CN", "province"
//    :
//        "Heilongjiang", "country"
//    :
//        "China", "privilege"
//    :
//        []
//    }
//}










