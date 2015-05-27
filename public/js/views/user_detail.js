(function ($) {
    var blacklistid=0;
    userloading(function (err, user) {
        $("#user_post").on("click", function () {
            window.location.href = "user_post.html?id=" + user.id + "";
        });
        $("#user_address").on("click", function () {
            window.location.href = "user_address.html?id=" + user.id + "";
        });
        $("#user_contact").on("click", function () {
            window.location.href = "user_contact.html?id=" + user.id + "";
        });
        $('#confirm-logout').on('click', function () {
            AV.User.logOut();
            window.location.href = "post_index.html";
        });
    });
    function userloading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        var code = "";
        var saveurl = window.location.href;
        var userlog, userid, queryobject, nickname;
        //var postview = window.location.search.split('=')[1];
        if (saveurl.split("=").length - 1 > 1) {
            userlog = window.location.search.split('=')[1];
            code = userlog.split("&")[0];
            id = ""
        }
        if (code != "") {
            $.post(server + "/weixin/userSignUp", {code: code}, function (res) {
                queryobject = res;
                var user = {
                    openid: res.openid,
                    nickname: res.nickname,
                    headUrl: res.headimgurl
                };
                var $tpl = $('#user');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {user: user};
                var html = template(data);
                $tpl.before(html);

                AV.User._logInWith("weixin", {
                    "authData": res,
                    success: function (user) {
                        userid = user.id;
                        queryobject = user.get("authData");
                        var query = new AV.Query(AV.User);
                        query.get(userid, {
                            success: function (user) {
                                user.set('nickname', res.nickname);
                                user.save()
                            }
                        });
                        callbak(null, user);
                    },
                    error: function (err) {
                        callbak(err);
                    }
                })
            });
        } else {
            var currentUser = AV.User.current();
            if (currentUser) {
                var BlackList = AV.Object.extend('blacklist');
                var query = new AV.Query(BlackList);
                query.find({
                    success:function(blacklist){
                        if(blacklist.length>0){
                            for(var i = 0 ;i<blacklist.length;i++){
                                if(currentUser.id==blacklist[i].get('user_id')){
                                    alert("您的账户已被冻结，如有疑问请联系官方");
                                    blacklistid=1
                                    window.location.href = "post_index.html";
                                }
                            }
                            if(blacklistid!=1){
                                var authData = currentUser.get("authData");
                                var $tpl = $('#user');
                                var source = $tpl.text();
                                var template = Handlebars.compile(source);
                                var data = {
                                    user: {
                                        openid: authData.weixin.openid,
                                        nickname: authData.weixin.nickname,
                                        headUrl: authData.weixin.headimgurl
                                    }
                                };
                                var html = template(data);
                                $tpl.before(html);
                                callbak(null, currentUser);
                            }
                        }else{
                            var authData = currentUser.get("authData");
                            var $tpl = $('#user');
                            var source = $tpl.text();
                            var template = Handlebars.compile(source);
                            var data = {
                                user: {
                                    openid: authData.weixin.openid,
                                    nickname: authData.weixin.nickname,
                                    headUrl: authData.weixin.headimgurl
                                }
                            };
                            var html = template(data);
                            $tpl.before(html);
                            callbak(null, currentUser);
                        }
                    }
                });

            } else {
                $.post(server + "/weixin/getAuthUrl", {page: server + "/user_detail.html"}, function (res) {
                    window.location.href = res.authUrl;
                })
            }
        }
    }
})(jQuery);

