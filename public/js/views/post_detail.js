
(function($) {
    var postview=window.location.search.split('?')[1];
    var number="";
   // alert(postview);
    loadwx();
    loading(function(){
        $("#users").on("click",function(){
            window.location.href="user_detail.html?sss";
        });
        thread_url= "http://localhost:63342/wanke/public/post_detail.html?55223dcfe4b0cd5b62664791";
        thread_key= postview;
        console.log(postview);
        thread_title = 'post_detail';
        //$("<div id=\"ds-thread\" class=\"ds-thread\" data-thread-key=postview+\"\" data-title=\"post_detail\" data-url=\"http://localhost:63342/wanke/public/post_detail.html?55223dcfe4b0cd5b62664791\"></div>"
        //).prependTo("#thread");
        $(".imgpreview").on("click",function(){
            var cur= $(this).attr("src");
            var  url=$(this).parent().attr("value");
            var arr=url.split(",");
            wx.previewImage({
                current:cur, // 当前显示的图片链接
                urls:arr// 需要预览的图片链接列表
            });
            event.stopPropagation();
        });
        $(".imgpreview").removeClass("imgpreview");

        $("#btnname").on("click",function(){
            var currentUser = AV.User.current();
            if (currentUser) {
               // window.location.href= "user_detail.html?"+currentUser.id+"";
             var imgurl=currentUser.get("authData").weixin.headimgurl;
             $(".usercontent").remove();
                $(" <p class=\"usercontent am-sans-serif\">联系方式："+number+"</p>").prependTo(".userphone");
                $(" <img src=\""+imgurl+"\" class=\"am-radius\">").appendTo("#headtle");
            } else {
                alert("没有登录")
                $.post("http://fuwuhao.dianyingren.com/weixin/getAuthUrl?page=user_detail",function(res){
                    window.location.href=res.authUrl;
                })
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
                console.log(results[0]);
                var content = object.get('content');
                var imgs = object.get('imgs');
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
                var ousername = object.get("username");
                number=ousername.get("mobilePhoneNumber");
                var username = ousername.get("username");
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
                // var tagvalue = object.get('tagkey');
                var opost = {
                    name: username,
                    usersay: content,
                    tag: tagvalue,
                    time: times,
                    img: imgs,
                    pattern: imgpattern
                };
                tags.push(opost);
                console.log(opost.name);
                console.log(opost.usersay);
                console.log(opost.tag);
                console.log(opost.time);

                var $tpl = $('#amz-tags');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {tags: tags};
                var html = template(data);
                $tpl.before(html);
                callbak();
            }
        });
    }

    function loadwx(){
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