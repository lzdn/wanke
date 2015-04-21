(function ($) {
    var code = "";
    var userlog, userid, queryobject, nickname;
    var postview = window.location.search.split('?')[1];
    if (postview.indexOf("=") > 0) {
        userlog = window.location.search.split('=')[1];
        code = userlog.split("&")[0];
        alert(code);
        id = ""
    }
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

        $('#my-confirm').modal({
            relatedTarget: this,
            onConfirm: function (options) {
                AV.User.logOut();
                var currentUser = AV.User.current();
                window.location.href = "post_index.html?id=" + currentUser.id + "";
            },
            onCancel: function () {

            }
        });

        //var query = new AV.Query(AV.User);
        //query.equalTo("authData", queryobject);  // find all the women
        //query.find({
        //    success: function (users) {
        //        id = users[0].id;
        //    }
        //});
    });

    function userloading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        if (code != "") {
            $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
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
                        callbak(null, user);
                    },
                    error: function (err) {
                        console.dir(err);
                        callbak(err);
                    }
                })
            });
        } else {
            var query = new AV.Query(AV.User);
            query.equalTo("objectId", postview);  // find all the women
            query.find({
                success: function (user) {
                    var authData = user[0].get("authData");
                    //userid = user[0].id;
                    var user = {
                        openid: authData.weixin.openid,
                        nickname: authData.weixin.nickname,
                        headUrl: authData.weixin.headimgurl
                    };
                    var $tpl = $('#user');
                    var source = $tpl.text();
                    var template = Handlebars.compile(source);
                    var data = {user: user};
                    var html = template(data);
                    $tpl.before(html);
                    callbak(null, user[0]);
                }
            });
        }
    }
})(jQuery);

