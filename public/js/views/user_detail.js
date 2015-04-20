(function ($) {
    var postview = window.location.search.split('?')[1];
    alert(postview);
    if(postview.indexOf("=") > 0 ){
        alert("asdsadasd");
    }else{
        alert("heihei");
    }
    var userlog = window.location.search.split('=')[1];
    var code = userlog.split("&")[0];
    alert(code);
    var id=""
    var queryobject


    //var currentUser = AV.User.current();
    //if (currentUser) {
    //    alert(currentUser);
    //} else {
    //    userloading();
    //}

    userloading(function(err,user){
     $("#userpost").on("click", function () {
         window.location.href = "user_post.html?";
     });
     $("#user_address").on("click", function () {
         window.location.href = "user_address.html?";
     });
     $("#user_contact").on("click", function () {
         window.location.href = "user_contact.html?";
     });

     var query = new AV.Query(AV.User);
     query.equalTo("authData",queryobject);  // find all the women
     query.find({
         success: function(users) {
             alert(users);
             id=users[0].id;
             alert(id);
         }
     });
 });
    function userloading(callbak){
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
            queryobject=res;
            var user=[
                {
                    id:res.openid,
                    nickname:res.nickname,
                    headUrl:res.headimgurl
                }
            ]
            var $tpl = $('#user');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {tags: user};
            var html = template(data);
            $tpl.before(html);

            AV.User._logInWith("weixin", {
                "authData": res,
                success: function(user){
                    //返回绑定后的用户
                    alert(user);
                    queryobject=user.get("authData");
                    callbak(null,user);
                },
                error: function(err){
                    console.dir(err);
                    alert("失败！");
                    callbak(err);
                }
            })
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