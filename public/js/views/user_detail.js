
(function($) {
    var postview=window.location.search.split('=')[1];
    var code=postview.split("&")[0];
    $.post("http://fuwuhao.dianyingren.com/weixin/userSignUp?"+code+"",function(res){
        alert(res);
        console.log(res);
    });

    $("#userpost").on("click",function(){
        window.location.href="user_post.html?";
    });
    $("#user_address").on("click",function(){
        window.location.href="user_address.html?";
    });
    $("#user_contact").on("click",function(){
        window.location.href="user_contact.html?";
    });
})(jQuery);