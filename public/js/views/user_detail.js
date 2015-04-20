(function ($) {
    var postview = window.location.search.split('=')[1];
    var code = postview.split("&")[0];
    alert(code);
    $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
        alert(res);
        var object=res.authData;
        alert(object);
        alert(object.weixin);
        var object2 = object.weixin;
        alert(object2.nickname);
    });

    $("#userpost").on("click", function () {
        window.location.href = "user_post.html?";
    });
    $("#user_address").on("click", function () {
        window.location.href = "user_address.html?";
    });
    $("#user_contact").on("click", function () {
        window.location.href = "user_contact.html?";
    });
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