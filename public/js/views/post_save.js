$(function () {
    var saveurl = window.location.href;
    var user = AV.User;
    var posts = AV.Object.extend("post");
    var tags = AV.Object.extend("tag");
    var newtag = 1;
    var code = "";
    var serverIds=[];
    var userlog, userid, queryobject, nickname
    var postview = window.location.search.split('=')[1];
    alert(postview);
    if (postview.indexOf("=") > 0) {
        userlog = window.location.search.split('=')[1];
        code = userlog.split("&")[0];
        alert(code);
        id = ""
    }

    dataLoad(function () {
        $("#usr-sbm-s").on("click", function () {
            window.location.href = "post_index.html";
        });
        //wx.ready(function () {
        //   // alert("绑定事件:隐藏菜单");
        //    wx.hideOptionMenu();
        //});

        var aNav = document.getElementsByClassName("am-btn-extend");
        aNav[0].className = "am-btn-extend am-btn am-round am-btn-primary";
        for (var i = 0; i < aNav.length; i++) {
            aNav[i].onclick = function () {
                for (var j = 0; j < aNav.length; j++) {
                    aNav[j].className = "am-btn-extend am-btn am-round";
                    this.className = "am-btn-extend am-btn am-round am-btn-primary";
                }
                console.log(this);
                newtag = ($(this).attr("value"));
            };
        }
    });
    $("#doc-ta-1").keydown(function () {
        setTimeout(function () {
            var aUserval = $("#doc-ta-1").val();
            if (aUserval.length > 140) {
                $(".usr-say-leg-2").html("<p>" + aUserval.length + "</p>").addClass("maxlegcss");
            } else {
                $(".usr-say-leg-2").html("<p>" + aUserval.length + "</p>").removeClass("maxlegcss");
            }
            if ($("#doc-ta-1").val() != "") {
                $("#usr-sbm-sub").removeClass("am-disabled");
            } else {
                $("#usr-sbm-sub").addClass("am-disabled");
            }
        }, 100);
    });
    $("#usr-sbm-s").on("click", function () {
        var aUserval3 = $("#doc-ta-1").val();
        if (aUserval3 != "") {
            $("#modal-confirm").modal({
                onConfirm: function () {
                    savecontent()
                },
                onCancel: function () {
                }
            });
        }
    });
    $("#usr-sbm-sub").on("click", function () {
        var aUserval2 = $("#doc-ta-1").val();
        if (aUserval2.length > 140) {
            $("#my-alert").modal();
        } else {
            //alert('准备上传');
            savecontent()
        }
    });
    $("#addimg").hide();
    //var postc = AV.posts.current();
    var postc = new posts();
    var relation = postc.relation("imgs");

    $(".chooseImage").on("click", function () {
        //var ofileid;
        //var localIds;

        wx.chooseImage({
            success: function (res) {
                var  localIds = res.localIds;
                $("#addimg").hide();
                for(var i=0;i<localIds.length;i++){
                    uploadIds(localIds[i]);
                }
                }
        });
    });

    //…………………………保存心情 和 tagkey………………………………
    function savecontent() {
        alert(serverIds.length);
        alert(serverIds);
        //var aUserval2 = $("#doc-ta-1").val();
        //var tag = new tags();
        //tag.id = newtag;
        //var postc = new posts();
        //var user = AV.User.current();
        //postc.save({
        //    content: aUserval2,
        //    tagkey: tag,
        //    //imgs: relation,
        //    username: user
        //}, {
        //    success: function (object) {
        //        alert("发表成功");
        //        window.location.href = "post_index.html"
        //    }
        //});
    }

//………………………………储备函数…………………………………………
    function dataLoad(callbak) {
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.post("http://fuwuhao.dianyingren.com/weixin/getJsConfig", {url: "" + saveurl + ""}, function (result) {
            console.log(result);
            appId = result.appId;
            jslist = result.jsApiList;
            noncestr = result.nonceStr;
            signature = result.signature;
            timestamp = result.timestamp;
            jsApiList = result.jsApiList;

            wx.config({
                debug: result.debug,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: noncestr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });

        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        var tags = AV.Object.extend("tag");
        var query = new AV.Query(tags);
        query.find({
            success: function (results) {
                var tags = [];
                newtag = results[0].id;
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var tagid = object.id;
                    var tagvalue = object.get('tagtitle');
                    var tag = {
                        key: tagid,
                        value: tagvalue
                    };
                    tags.push(tag);
                }
                var $tpl = $('#amz-tags');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {tags: tags};
                var html = template(data);
                $tpl.before(html);
                callbak();
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
                        alert(userid);
                        queryobject = user.get("authData");
                        var query = new AV.Query(AV.User);
                        query.get(userid, {
                            success: function (user) {
                                user.set('nickname', nickname);
                                user.save()
                            }
                        });
                    }
                })
            });
        } else {
            var query = new AV.Query(AV.User);
            query.equalTo("objectId", postview);  // find all the women
            query.find({
                success: function (user) {
                    userid = user[0].id;
                    alert(userid);
                }
            });
        }

    }

    function uploadIds (localIds){
            wx.uploadImage({
            localId:localIds+"",
            isShowProgressTips: 1,
            success: function (img) {
                $("#addimg").show();
                var serverId = img.serverId; // 返回图片的服务器端ID
                serverIds.push(serverId);
                $("<div id=\"" + serverId + "\" class=\"imgnav\"><img src=\"" + localIds + "\" alt=\"\"/><a id=\"destroy" + serverId + "\" class=\"am-icon-close \" value=\"" + serverId + "\"  \"></a></div>").prependTo("#imgwall");
                $("#destroy" + serverId + "").on("click",function(){
                    //serverIds.remove($(this).attr("value"));
                    //var val=this.val();
                    //alert(val);
                    serverIds.remove(serverId);
                    $("#" + serverId + "").remove();
                    if($(".imgnav").length==0){
                        $("#addimg").hide();
                    }
                });
                // alert(serverId)
                //$.post("http://fuwuhao.dianyingren.com/weixin/uploadImage", {serverId:""+serverId+""}, function (imgid) {
                //    alert(imgid);
                //    // relation.add(imgid);
                //});
            }
        });

    }


});




