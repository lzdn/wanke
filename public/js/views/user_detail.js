(function ($) {
    var postview = window.location.search.split('=')[1];
    var code = postview.split("&")[0];
    var id=""

 loading(function(){
     AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
     var files = AV.Object.extend("File");
     $("#userpost").on("click", function () {
         window.location.href = "user_post.html?";
     });
     $("#user_address").on("click", function () {
         window.location.href = "user_address.html?";
     });
     $("#user_contact").on("click", function () {
         window.location.href = "user_contact.html?";
     });

     var query = new AV.Query(files);
     query.equalTo("username", "a6rpfbylhhgeunael1jmn5f4d");
     query.find({
         success: function(results) {
             alert("haha");
             alert(results);
         },
         error: function(error) {
             alert("Error: " + error.code + " " + error.message);
         }
     });
 });
    function loading(callbak){
        var files = AV.Object.extend("File");
        $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp", {code: code}, function (res) {
            alert(res);
            var object=res.authData.weixin;
            var name=object.nickname;
            var img =object.headimgurl;
            id=object.openid;
            var user=[
                {
                    id:id,
                    name:name,
                    img:img
                }
            ]

            var $tpl = $('#user');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {tags: user};
            var html = template(data);
            $tpl.before(html);
            callbak();
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