(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    loadwx();
    var blacklistid=0;
    $("#advertising,#commentslist").hide();
    $("#divider").hide();

    var saveurl = window.location.href;
    var number = "";
    var code = "";
    var relationuser = [];
    var marktags = ["约吃", "约玩", "约聊", "约运动"];
    var commentuserid;
    var userlog, userid, queryobject, content, nickname, phonenumber, usersid, postId, tagvalue, openid, postview, username, headimgurl, headUrl, theuserid;
    if (saveurl.split("=").length > 2) {
        userlog = window.location.search.split('=')[2];
        code = userlog.split("&")[0];
        postview = window.location.search.split('=')[1].split("&")[0];
    } else {
        postview = window.location.search.split('=')[1];
    }
    if (code != "") {
        $.post(server + "/weixin/userSignUp", {code: code}, function (res) {
            queryobject = res;
            nickname = res.nickname;
            AV.User._logInWith("weixin", {
                "authData": res,
                success: function (user) {
                    userid = user.id;
                    commentuserid = userid
                    queryobject = user.get("authData");
                    var query = new AV.Query(AV.User);
                    query.get(userid, {
                        success: function (user) {
                            user.set('nickname', nickname);
                            user.save()
                        }
                    });
                    loading_event();
                }
            })
        });
    } else {
        var currentUser = AV.User.current();
        if (currentUser) {
            loading_event()
        } else {
            $.ajax({
                method: "POST",
                url: server + "/weixin/getAuthUrl",
                data: JSON.stringify({
                    page: saveurl
                }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    window.location.href = data.authUrl;
                },
                error: function (msg) {
                    // alert(msg);
                }
            });
        }
    }

    function loading_event() {
        loading(function () {
            $(".close").hide();
            $("#advertising,#commentslist").show();
            $("#divider").show();
            var currentUser = AV.User.current();
            usersid = currentUser.id;
            var authData = currentUser.get("authData");
            headUrl = authData.weixin.headimgurl
            $(".nullusershow").attr("src", headUrl);
            $(".replypublish").hide();
            var aclose = document.getElementsByClassName("close");
            for (var i = 0; i < aclose.length; i++) {
                var commentuser = aclose[i].className.substr(14);
                if (commentuser == commentuserid) {
                    aclose[i].className = "close hide";
                    $(".hide").show();
                } else {
                }
            }
            $(".close").on("click", function () {
                var close = $(this).parent().attr("value");
                destroycomment(close);
            });
            $(".reply").on("click", function () {
                $(".replypublish").hide();
                var reply = $(this).parent().attr("value");
                var $reply = $(this).parent().siblings("." + reply + "");
                if ($reply.attr("bshow") == 0) {
                    $reply.show();
                    $reply.attr("bshow", "1");
                } else {
                    $reply.hide();
                    $reply.attr("bshow", "0");
                }
                $(".reply").removeClass("reply");
            })
            $(".smpublish").on("click", function () {
                var currentUser = AV.User.current();
                theuserid = currentUser.id;
                var publishsay = $(this).parent().siblings(".textarea").children().val();
                var BlackList = AV.Object.extend('blacklist');
                var query = new AV.Query(BlackList);
                query.find({
                    success:function(blacklist){
                        if(blacklist.length>0){
                            for(var i = 0 ;i<blacklist.length;i++){
                                if(currentUser.id==blacklist[i].get('user_id')){
                                    alert("您已经被官方冻结，请联系官方");
                                    blacklistid=1;
                                }
                            }
                            if(blacklistid!=1){
                                alert("1haocuowu");
                                up_smpublish(publishsay);
                            }
                        }else{
                            alert("2haocuowu");
                            up_smpublish(publishsay);
                        }
                    }
                });
            });
            $("#maxpublish").on("click", function () {
                var currentUser = AV.User.current();
                theuserid = currentUser.id;

                var publishsay = $(this).parent().siblings(".textarea").children().val();
                var BlackList = AV.Object.extend('blacklist');
                var query = new AV.Query(BlackList);
                query.find({
                    success:function(blacklist){
                        if(blacklist.length>0){
                            for(var i = 0 ;i<blacklist.length;i++){
                                if(currentUser.id==blacklist[i].get('user_id')){
                                    alert("您已经被官方冻结，请联系官方");
                                    blacklistid=1;
                                }
                            }
                            if(blacklistid!=1){
                                up_maxpublish(publishsay);
                            }
                        }else{
                            up_maxpublish(publishsay);
                        }
                    }
                });

            });
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

            $("#btnname").on("click", function () {
                var currentUser = AV.User.current();
                theuserid = currentUser.id;
                var query = new AV.Query(AV.User);
                query.get(currentUser.id, {
                    success: function (user) {
                        phonenumber = user.get('mobilePhoneNumber');
                    }
                });
                var BlackList = AV.Object.extend('blacklist');
                    var query = new AV.Query(BlackList);
                    query.find({
                        success:function(blacklist){
                            if(blacklist.length>0){
                                for(var i = 0 ;i<blacklist.length;i++){
                                    if(currentUser.id==blacklist[i].get('user_id')){
                                        alert("您已经被官方冻结，请联系官方");
                                        blacklistid=1;
                                    }
                                }
                                if(blacklistid!=1){
                                    up_btnname();
                                }
                            }else{
                                up_btnname();
                            }
                        }
                    });

            });
        });
    }
    function loading(callbak) {
        var load = 0 //ject.createWithoutData('className',id);
        var currentUser = AV.User.current();
        commentuserid = currentUser.id;
        var authData = currentUser.get("authData");
        nickname = authData.weixin.nickname
        headimgurl = authData.weixin.headimgurl
        load += 1
        if (load == 3) {
            callbak();
        }
        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        var comment = AV.Object.extend("comment");
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
                content = object.get('content');
                var imgs = object.get('relationimgs');
                relationuser = object.get("relationuser");
                if (imgs) {
                    if (imgs.length == 1) {
                        imgpattern = "imgpatternone"
                    }
                    if (imgs.length >= 2) {
                        imgpattern = "imgpatterntwo"
                    }
                }
                var otagkey = object.get("tagkey");
                number = object.get("username").get("mobilePhoneNumber");
                postId = object.get("username").id;
                openid = object.get("username").get("authData").weixin.openid;
                var ousername = object.get("username").attributes.authData.weixin;
                username = ousername.nickname;
                headimgurl = ousername.headimgurl;
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
                    relationuser: relationuser
                };
                tags.push(opost);
                var $tpl2 = $('#amz-tags');
                var source2 = $tpl2.text();
                var template2 = Handlebars.compile(source2);
                var data2 = {tags: tags};
                var html2 = template2(data2);
                $tpl2.before(html2);
                load += 1
                if (load == 3) {
                    callbak();
                }
                $(".userphone").hide();
                for (var i = 0; i < marktags.length; i++) {
                    if (marktags[i] == tagvalue) {
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
                                $("<p id=\"usercontent\" class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                                $("#btnname").remove();
                                $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                            }
                        }
                    }
                }
            }
        });
        //…………………………………………以下为加载评论………………………………
        var query = new AV.Query(post);
        query.equalTo("objectId", postview);
        query.find({
            success: function (post) {
                var object = post[0].get("relationcomment")
                if (object) {
                    var comment = AV.Object.extend("comment");
                    for (var i = 0; i < object.length; i++) {

                        var query = new AV.Query("comment");
                        query.include("commentrelation");
                        query.include("commentuser");
                        query.equalTo("objectId", object[i].id);
                        query.find({
                            success: function (comment) {
                                var times = 0;
                                var newtime = new Date().getTime();
                                var oldtime = comment[0].createdAt.getTime();
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
                                var commentid = comment[0].id;
                                var commentuserids = comment[0].get("commentuserid");
                                var commentusername = comment[0].get("commentusername");
                                var commentcontent = comment[0].get("commentcontent");
                                var commentusershow = comment[0].get("commentusershow");
                                var commentrelation = comment[0].get("commentrelation");
                                var comments = [];
                                var comment = {
                                    commentid: commentid,
                                    commentusername: commentusername,
                                    commentuserid: commentuserids,
                                    commentcontent: commentcontent,
                                    commentusershow: commentusershow,
                                    relation: commentrelation,
                                    times: times
                                }
                                comments.push(comment);
                                var $tpl3 = $('#comments');
                                var source3 = $tpl3.text();
                                var template3 = Handlebars.compile(source3);
                                var data3 = {comments: comments};
                                var html3 = template3(data3);
                                $tpl3.before(html3);
                                if ($(".commentlength").length == object.length) {
                                    load += 1
                                    if (load == 3) {
                                        callbak();
                                    }
                                }
                            }
                        })
                    }
                } else {
                    load += 1
                    if (load == 3) {
                        callbak();
                    }
                }
            }
        })
        //……………………………………………………………………………………………
    }

    function loadwx() {
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
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
                        title: '' + tagvalue + '',
                        link: window.location.href,
                        imgUrl: '' + headimgurl + '',
                        success: function () {
                        },
                        cancel: function () {
                        }
                    });
                    wx.onMenuShareAppMessage({
                        title: '' + tagvalue + '',
                        desc: '' + content + '',
                        link: window.location.href,
                        type: 'link',
                        imgUrl: '' + headimgurl + '',
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
    function loadingcomment(comment) {
        var times = 0;
        var newtime = new Date().getTime();
        var oldtime = comment.createdAt.getTime();
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
        var commentid = comment.id;
        var commentusername = comment.get("commentusername");
        var commentcontent = comment.get("commentcontent");
        var commentusershow = comment.get("commentusershow");
        var commentrelation = comment.get("commentrelation");
        var comments = [];
        var comment = {
            commentid: commentid,
            commentusername: commentusername,
            commentuserid: commentuserid,
            commentcontent: commentcontent,
            commentusershow: commentusershow,
            relation: commentrelation,
            times: times
        }
        comments.push(comment);
        var $tpl3 = $('#comments');
        var source3 = $tpl3.text();
        var template3 = Handlebars.compile(source3);
        var data3 = {comments: comments};
        var html3 = template3(data3);
        $tpl3.before(html3);
        $(".replypublish").hide();
        $(".nullusershow").attr("src", headUrl);
        $(".reply").on("click", function () {
            $(".replypublish").hide();
            var reply = $(this).parent().attr("value");
            var $reply = $(this).parent().siblings("." + reply + "");
            if ($reply.attr("bshow") == 0) {
                $reply.show();
                $reply.attr("bshow", "1");
            } else {
                $reply.hide();
                $reply.attr("bshow", "0");
            }
            $(".reply").removeClass("reply");
        })
        $(".close").on("click", function () {
            var close = $(this).parent().attr("value");
            destroycomment(close);
        })
        $(".smpublish").on("click", function () {
            var publishsay = $(this).parent().siblings(".textarea").children().val();
            if (publishsay) {
                var comment = AV.Object.extend("comment");
                var post = AV.Object.extend("post");
                var relationcommentid = $(this).attr("value");
                var relationcommentusername = $(this).attr("username");
                var relationcommentcontent = $(this).attr("usersay");
                var relationcommentusershow = $(this).attr("usershow");
                var relationcommentuserid = $(this).attr("userid");
                var posts = new post();
                posts.id = postview;
                var commentrelation = [];
                commentrelation.push({
                    commentid: relationcommentid,
                    commentusername: relationcommentusername,
                    commentcontent: relationcommentcontent,
                    commentuserid: relationcommentuserid,
                    commentusershow: relationcommentusershow
                });
                var comment = new comment();
                comment.save({
                    commentcontent: publishsay,
                    commentpost: posts,
                    commentuserid: commentuserid,
                    commentusername: nickname,
                    commentusershow: headUrl,
                    commentrelation: commentrelation
                }, {
                    success: function (comment) {
                        loadingcomment(comment);
                        var query = new AV.Query(post);
                        //query.equalTo("objectId", postview);
                        query.get(postview, {
                            success: function (post) {
                                post.add("relationcomment", {id: comment.id});
                                post.save();
                            },
                            error: function (object, error) {
                                console.log(object);
                            }
                        });
                    }
                })
            } else {
                alert("你要说点什么");
            }

        })
    }
    function destroycomment(commentid) {
        $(".destroy" + commentid + "").remove();
        var post = AV.Object.extend("post");
        var query = new AV.Query(post);
        //query.equalTo("objectId", postview);
        $("textarea").val("")
        query.get(postview, {
            success: function (post) {
                post.remove("relationcomment", {id: commentid});
                post.save();
            }
        });
        var comment = AV.Object.extend("comment");
        var query2 = new AV.Query(comment);
        query2.get(commentid, {
            success: function (comment) {
                comment.destroy();
            }
        })
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
    function up_btnname(){
        if (relationuser) {
            var bregistration = 0;
            for (var i = 0; i < relationuser.length; i++) {
                if (relationuser[i].id == currentUser.id) {
                    $(".usercontent").remove();
                    $(" <p class=\"usercontent am-sans-serif\">联系方式：" + number + "</p>").prependTo(".usercont");
                    $("#btnname").remove();
                    $(" <div id=\"btnname\"><button type=\"button\" class=\"am-btn am-btn-warning am-disabled\">已报名</button></div>").prependTo(".userphone");
                } else {
                    bregistration += 1;
                }
                if (bregistration == relationuser.length) {
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
                                url: server + "/weixin/sendMessage",
                                data: JSON.stringify({
                                    userId: theuserid,
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
                                    post.add("relationuser", {
                                        id: usersid,
                                        url: imgurl,
                                        phonenumber: phonenumber
                                    });
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
                                    if (/^1[3|4|5|7|8]\d{9}$/.test(e.data)) {
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
            }
        } else {
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
                        url: server + "/weixin/sendMessage",
                        data: JSON.stringify({
                            userId: theuserid,
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
                            if (/^1[3|4|5|7|8]\d{9}$/.test(e.data)) {
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
    }
    function up_smpublish(publishsay){
        if (publishsay) {
            var comment = AV.Object.extend("comment");
            var post = AV.Object.extend("post");
            var relationcommentid = $(this).attr("value");
            var relationcommentusername = $(this).attr("username");
            var relationcommentcontent = $(this).attr("usersay");
            var relationcommentusershow = $(this).attr("usershow");
            var relationcommentuserid = $(this).attr("userid");
            console.log(relationcommentid + "$" + relationcommentusername + "$" + relationcommentcontent + "$" + relationcommentusershow)
            var posts = new post();
            posts.id = postview;
            var commentrelation = [];
            commentrelation.push({
                commentid: relationcommentid,
                commentusername: relationcommentusername,
                commentcontent: relationcommentcontent,
                commentuserid: relationcommentuserid,
                commentusershow: relationcommentusershow
            });
            console.log(commentrelation);
            var comment = new comment();
            comment.save({
                commentcontent: publishsay,
                commentpost: posts,
                commentuserid: commentuserid,
                commentusername: nickname,
                commentusershow: headUrl,
                commentrelation: commentrelation
            }, {
                success: function (comment) {
                    $("textarea").val("");
                    loadingcomment(comment);
                    var query = new AV.Query(post);
                    query.get(postview, {
                        success: function (post) {
                            post.add("relationcomment", {id: comment.id});
                            post.save();
                        },
                        error: function (object, error) {
                            console.log(object);
                        }
                    });
                }
            })
        } else {
            alert("你要说点什么");
        }
    }
    function up_maxpublish(publishsay){
        var post = AV.Object.extend("post");
        var comment = AV.Object.extend("comment");
        if (publishsay) {
            var posts = new post();
            posts.id = postview;
            var coment = new comment();
            coment.save({
                commentcontent: publishsay,
                commentpost: posts,
                commentusername: nickname,
                commentuserid: commentuserid,
                commentusershow: headUrl
            }, {
                success: function (comment) {
                    var query = new AV.Query(post);
                    $("textarea").val("");
                    loadingcomment(comment);
                    query.get(postview, {
                        success: function (post) {
                            post.add("relationcomment", {id: comment.id});
                            post.save();
                        },
                        error: function (object, error) {
                            console.log(object);
                        }
                    });
                }
            });
        } else {
            alert("你要说点什么");
        }
    }
})(jQuery);


