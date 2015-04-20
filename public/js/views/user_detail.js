
(function($) {
    var postview=window.location.search;
    var index1=postview.indexOf("?");
    var index2=postview.indexOf("&");
    alert(postview.substring(index1,index2));

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