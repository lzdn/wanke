
(function($) {
    var postview=window.location.search.split('?');
    alert(postview);
    var code=postview.split("&");
    alert(code);
    var ss=postview.substring("="[1],"&");
    alert(ss);


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