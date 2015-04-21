(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    var postview = window.location.search.split('?id=')[1];
    var id = window.location.search.split('?id=')[1];
    load(function(){
        var phonenum = "";
        var bnum = 0;
        $("#haederleft").on("click", function () {
            window.location.href = "user_detail.html?" + postview + "";
        });

        $('#phonenum').keydown(function () {
            setTimeout(function () {
                if ($('#phonenum').val() && /^1[3|4|5|8]\d{9}$/.test($('#phonenum').val())) {
                    bnum = 1;
                    phonenum = $('#phonenum').val();
                    $(".am-alert").alert('close');
                } else {
                    bnum = 0;
                    // $("#usr-sbm-sub").addClass("am-disabled");
                }
            }, 10);
        });
        $("#content").keydown(function () {
            setTimeout(function () {
                if ($('#phonenum').val() != "") {
                    $("#usr-sbm-sub").removeClass("am-disabled");

                } else {
                    $("#usr-sbm-sub").addClass("am-disabled");
                }
            }, 20);
        });
        //$("#content").keydown(function () {
        //    setTimeout(function () {
        //            if ($("#wxnum").val() + $('#phonenum').val() != "") {
        //                $("#usr-sbm-sub").removeClass("am-disabled");
        //
        //            } else {
        //                $("#usr-sbm-sub").addClass("am-disabled");
        //            }
        //    }, 20);
        //});
        //$('#phonenum').blur(function(){
        //    if($('#phonenum').val() && /^1[3|4|5|8]\d{9}$/.test($('#phonenum').val())){
        //
        //    } else{
        //        if($("#phonenum").val()!=""){
        //            bnum = 0;
        //            //alert("请输入正确手机号");
        //        }
        //    }
        //});

        $("#usr-sbm-sub").on("click", function () {
            phonenum = $("#phonenum").val();
            if (bnum == 1) {
                var query = new AV.Query(AV.User);
                query.get(postview, {
                    success: function (user) {
                        user.set('mobilePhoneNumber', phonenum);
                        user.save().then(function () {
                            window.location.href = "user_detail.html?" + postview + "";
                        });
                    },
                    error: function (object, error) {
                        console.log(object);
                        // The object was not retrieved successfully.
                        // error is a AV.Error with an error code and description.
                    }
                });


            } else {
                //alert("sb");
                $("<div class=\"am-alert am-alert-danger\" data-am-alert>\
            <button type=\"button\" class=\"am-close\">&times;</button>\
            请输入正确的手机号\
            </div>").appendTo($("#phone"));
            }
        });
    });
})(jQuery);

function load(callback) {
    var query = new AV.Query(AV.User);
    query.find(id, {
        success: function (err, user) {
            $('#phonenum').value = user.get("mobilePhoneNumber");
            callback(null);
        },
        error: function (err) {
            callback(err);
        }
    })
}
