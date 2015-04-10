(function ($) {
    // var userid=window.location.search.split('?')[1];
    var userid ="55277430e4b0f543683906ac";
    var skx = -5;
    var postview

    $("#arrow").hide();
    loading(function () {
        $(".Publish").on("click", function () {
             postview = $(this).attr("value");
        });
        $("#users").on("click", function () {
            window.location.href = "users.html";
        });

    });

    $(window).scroll(function () {
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        var newheight = window.screen.availHeight;
        if (scrollTop > 800) {
            $("#arrow").show().addClass("am-animation-fade");
        } else {
            $("#arrow").hide();
            $("#arrow").hide().removeClass("am-animation-fade");
        }
        if (scrollTop + newheight + 200 >= htmlHeight) {
            loading(function () {
                $(".Publish").on("click", function () {
                    postview = $(this).attr("value");
                });
                $("#users").on("click", function () {
                    window.location.href = "users.html";
                });

            });
        }
    });

    $(".seecontent").on("click",function(){
        window.location.href = "post_detail.html?" + postview + "";
    });
    $(".destroy").on("click",function(){
        destroy(postview);
    });

    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var post = AV.Object.extend("post");
        var tags = AV.Object.extend("tags");
        var user = AV.Object.extend("User");
        var newtime = new Date().getTime();
        var query2 = new AV.Query(user);
        query2.equalTo("objectId",userid);
        query2.find({
            success: function (res) {
                var query = new AV.Query(post);
                query.equalTo("username", res[0]);
                query.count({
                    success: function (skip) {
                        var newtime = new Date().getTime();
                        query.descending("createdAt");
                         skx+=5;
                        if(skx>=skip){
                            $("#load").remove();
                        }
                        query.limit(5).skip(skx);
                        query.descending("createdAt");
                        query.include("tagkey")
                        query.include("imgs")
                        query.include("username")
                        query.equalTo("username", res[0]);
                        query.find({
                            success: function (arry) {
                                var times = 0;
                                var tags = [];
                                for (var i = 0; i < arry.length; i++) {
                                    var object = arry[i];
                                   // console.log(arry[i]);
                                    var avalue = object.id;
                                    var content = object.get('content');
                                    var imgs = object.get('imgs');
                                   // console.log(imgs);
                                    var otagkey = object.get("tagkey");
                                    var ousername = object.get("username");
                                    var username = ousername.get("username");
                                    var tagvalue = otagkey.get("tagtitle");
                                    var oldtime = object.createdAt.getTime();
                                    var publishtime = newtime - oldtime;
                                    var day = parseInt(publishtime / 86400000);
                                    if (day > 0) {
                                        times = day + "天"
                                    } else {
                                        var hours = parseInt(publishtime / 3600000);
                                        if (hours > 0) {
                                            times = hours + "小时";
                                        }
                                        else {
                                            var minute = parseInt(publishtime / 60000);
                                            if (minute > 0) {
                                                times = minute + "分钟"
                                            }
                                        }
                                    }
                                    // var tagvalue = object.get('tagkey');
                                    var imge = object.get('imgs')
                                    var opost = {
                                        name: username,
                                        usersay: content,
                                        tag: tagvalue,
                                        time: times,
                                        value: avalue
                                        //img: imge
                                    };
                                    tags.push(opost);
                                }
                                var $tpl = $('#amz-tags');
                                var source = $tpl.text();
                                var template = Handlebars.compile(source);
                                var data = {tags: tags};
                                var html = template(data);
                                $tpl.before(html);
                                callbak();
                            }
                        });
                    }
                });
            }
        });

    }




    function destroy(postid){
        var post = AV.Object.extend("post");
        var query = new AV.Query(post);
        query.equalTo("objectId",postid);
        query.find({
            success:function(res){
                var destroyid= res[0].id;
                res[0].destroy({
                    success: function(myObject) {
                        alert(destroyid);
                        $("#"+destroyid+"").remove();
                    }
                });
            }
        });
    }


})(jQuery);


