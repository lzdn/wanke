(function ($) {
    $(".menu_btn").hide();
    $("input[name=docVlGender]:eq(0)").attr("checked",'checked');
    $("input[name=docVlGender]").on("click",function(){
        if($("input[name='docVlGender']:checked").val()=="null"){
           $(".input_menu_url").attr("disabled",true);
        }else{
            $(".input_menu_url").val("");
            $('.input_menu_url').attr("disabled",false);
        }
    })
    $(".btn_content").mouseout(function () {
        $(this).children().hide();
    }).mousemove(function () {
        $(this).children().show();
    });

    $(".add-menu-btn,.menu_btn,.menu_list,.add_menu_list").on("click",function(){
        $('#my-prompt').modal();
    });

    $(".save_menu").on("click",function(){
        var menuname = $(".input_menu_name").val();
        var menuurl = $(".input_menu_url").val();
        var menutitle=$("input[name='docVlGender']:checked").val();
        alert(menuname+"$$$$"+menuurl+"$$$$"+menutitle);
        $(".input_menu_name").val("");
        $(".input_menu_url").val("");
    });
})(jQuery);
