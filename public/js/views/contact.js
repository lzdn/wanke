(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    var postview = window.location.search.split('?')[1];
    // alert(postview);
    var phonenum=""
    var bnum = 0;
    var userid="5527741ce4b0f5436839060c";


    $('#phonenum').keydown(function () {
        setTimeout(function () {
            if ($('#phonenum').val() && /^1[3|4|5|8]\d{9}$/.test($('#phonenum').val())) {
                bnum = 1;
                phonenum = $('#phonenum').val();
            } else {
                bnum = 0;
                $("#usr-sbm-sub").addClass("am-disabled");
            }
        }, 10);
    });
    $("#content").keydown(function () {
        setTimeout(function () {
            if ($("#phonenum").val() == "" || bnum == 1) {
                if ($("#wxnum").val() + $('#phonenum').val() != "") {
                    $("#usr-sbm-sub").removeClass("am-disabled");

                } else {
                    $("#usr-sbm-sub").addClass("am-disabled");
                }
            }


        }, 20);
    });

    $('#phonenum').blur(function(){
        if($('#phonenum').val() && /^1[3|4|5|8]\d{9}$/.test($('#phonenum').val())){

        } else{
            if($("#phonenum").val()!=""){
                alert("请输入正确手机号");
            }
        }
    });

    $("#usr-sbm-sub").on("click",function(){
        var wxnum=$("#wxnum").val();

        var user = AV.Object.extend("User");
        var query = new AV.Query(user);
        query.equalTo("objectId",userid);
        query.find({
            success:function(gameScore){
               console.log(gameScore[0]);
                console.log(gameScore[0].get("mobilePhoneNumber"));
                console.log(gameScore[0].get("wxnumber"));
                gameScore[0].set("mobilePhoneNumber",phonenum);
                gameScore[0].save({
                    success:function(){
                        alert("haha");
                    }
                });
               // if(phonenum!=""){
               //     console.log(phonenum);
               //     results[0].set("mobilePhoneNumber",phonenum);
               //     results.save();
               // }

            }
        });



    });

})(jQuery);




