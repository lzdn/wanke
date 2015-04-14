
(function($) {
    var postview=window.location.search.split('?')[1];
    //alert(postview);

    $("#userpost").on("click",function(){
        window.location.href="user_post.html?";
    });

})(jQuery);