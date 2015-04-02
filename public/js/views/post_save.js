/**
 * Created by amberglasses on 15/3/24.
 */
$(function (){

    $.get("http://123.57.14.126/weixin/getJsConfig",function(json){
        alert(json);
        console.log(json);
    });

    var user = AV.User;
    var post = AV.Object.extend("post");
    var tags = AV.Object.extend("tags");
    var newtag = 1;
    dataLoad(function () {
        var aNav = document.getElementsByClassName("am-btn-extend");
        aNav[0].className = "am-btn-extend am-btn am-btn-primary am-round";
        for (var i = 0; i < aNav.length; i++) {
            aNav[i].index = i + 1;
            aNav[i].onclick = function () {
                for (var j = 0; j < aNav.length; j++) {
                    aNav[j].className = "am-btn-extend am-btn am-btn-link am-round";
                }
                this.className = "am-btn-extend am-btn am-btn-primary am-round";
                newtag = this.index;
            }
        }
    });
    $("#usr-sbm-sub").css({color: "rgba(68,68,68,3)"});
    $("#doc-ta-1").keydown(function () {
        setTimeout(function () {
            var aUserval = $("#doc-ta-1").val();
            if (aUserval.length > 140) {
                $(".usr-say-leg-2").html("<p>" + aUserval.length + "</p>").addClass("maxlegcss");
            } else {
                $(".usr-say-leg-2").html("<p>" + aUserval.length + "</p>").removeClass("maxlegcss");
            }
            if ($("#doc-ta-1").val() != "") {
                $("#usr-sbm-sub").removeClass("am-disabled").css({color: "#ff8200"});
            } else {
                $("#usr-sbm-sub").addClass("am-disabled").css({color: "rgba(68,68,68,3)"});
            }
        }, 100);
    });
    $("#usr-sbm-s").on("click", function () {
        var aUserval3 = $("#doc-ta-1").val();
        if (aUserval3 != "") {
            $("#modal-confirm").modal({
                onConfirm: function () {
                    savecontent()
                },
                onCancel: function () {
                }
            });
        }
    });
    $("#usr-sbm-sub").on("click", function () {
        var aUserval2 = $("#doc-ta-1").val();
        if (aUserval2.length > 140) {
            $("#my-alert").modal();
        } else {
            //alert('准备上传');
            savecontent()
        }
    });
    $("#addimg").hide();
    //$("#addimg").hide();
    //$("#dophoto").on("click", function () {
    //    $("#addimg").hide();
    //});
    //$("#photolibrary").on("click", function () {
    //    $("#addimg").show();
    //});
    //$("#escphoto").on("click", function () {
    //
    //});$("#addimg").hide();


    //var postc = AV.post.current();
    var postc = new post();
    var relation = postc.relation("imgs");
    $("#photolibrary").on("click", function () {
        var ofileid = "";
        var file = AV.File.withURL('img11.jpg', 'imgs/mm3.jpg');
        file.save({
            success: function (ofile) {
                ofileid = ofile.id;
                console.log(ofileid);
            }
        }).then(function () {
            var postc = new post();
            var relation = postc.relation("imgs");
            //relation.add(file);
            // postc.save();

            // var postc = new post();
            // postc.set("imgs", file);
            // postc.save(null, {
            //     success: function (object) {
            //         alert("发表成功");
            //     }
            // });
            $("<div class=\"imgnav imgnav-" + ofileid + " \" ><a href=\"#\" value=\"" + ofileid + "\" class=\"am-close\">&times;</a><img src=\"imgs/mm1.jpg\" alt=\"#\"/></div>").prependTo("#imgwall");
            $("#addimg").show();
            var aimgnav = $(".am-close");
            for (var i = 0; i < aimgnav.length; i++) {
                aimgnav[i].onclick = function () {
                    var remobeidx = $(this).attr('value');
                    console.log(remobeidx);
                    var query = new AV.Query('_File');
                    query.get(remobeidx, {
                        success: function (ofile) {
                            // The object was retrieved successfully.
                            console.log("ofile.id:" + ofile.id);
                            //ofile.remove(ofile);
                            ofile.destroy().then(function () {
                                //删除成功
                                console.log('删除成功');
                            }, function (error) {
                                //删除失败
                                console.dir(error);
                            });
                        },
                        error: function (object, error) {
                            // The object was not retrieved successfully.
                            // error is a AV.Error with an error code and description.
                        }
                    });
                    //file.equalTo("objectId", "" + remobeidx + "");
                    //file.find({
                    //    success: function (ofile) {
                    //
                    //    }
                    //});
                    $(".imgnav-" + remobeidx + "").remove();
                    var aimgshow = $(".imgnav");
                    if (aimgshow.length == 0) {
                        $("#addimg").hide();
                    }
                };
            }
        });

    });


    //var query = new AV.Query(GameScore);

    //    $("").get(url,{},function(data){
    //
    //},json)

    //……………………………………数据库操作……………………………………………
    //………………保存图片索引……………………
    //function saveimg(){
    //    var postc = new post();
    //    postc.set("imgs", file);
    //    postc.save(null, {
    //        success: function (object) {
    //            alert("发表成功");
    //        }
    //    });
    //};
    //…………………………保存心情 和 tagkey………………………………
    function savecontent() {
        var aUserval2 = $("#doc-ta-1").val();
        var savetags = "";
        switch (newtag) {
            case 1:
                savetags = "5518eaf3e4b04d688d6b2f60";
                break;
            case 2:
                savetags = "5518eafbe4b04d688d6b2f83";
                break;
            case 3:
                savetags = "551b72c8e4b04d688d7fa777";
                break;
            case 4:
                savetags = "551b72fbe4b04d688d7fa931";
                break;
            case 5:
                savetags = "551b731ce4b04d688d7faa4b";
                break;
            case 6:
                savetags = "551b7329e4b04d688d7faac3";
                break;
            case 7:
                savetags = "551b73b5e4b04d688d7faf39";
                break;
            case 8:
                savetags = "551b73c9e4b04d688d7fafda";
                break;
            case 8:
                savetags = "551b73d3e4b04d688d7fb038"
                break;
        }
        // ………………此处有疑问……………
        //var query = new AV.Query("tags");
        //query.equalTo("tagKey", ""+newtag+"");
        //query.find({
        //    success: function (results) {
        //        alert("haha");
        //        console.log(results);
        //        //var saveTag = results.get("tagKey");
        //        //var tagKey = results.get("tagKey");
        //       // console.log(tagKey);
        //    }
        //});
        // ………………此处有疑问……………
        var tag = new tags();
        tag.id = savetags;
        var postc = new post();
        postc.save({
            content: aUserval2,
            tagkey: tag,
            imgs: relation
        }, {
            success: function (object) {
                alert("发表成功");
               // console.log(relation);
            }
        });
    }


    //function wx_get_token() {
    //    $token = S('access_token');
    //    if (!$token) {
    //        $res = file_get_contents('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='wxf44ff09e67caaad3'&secret='3c****************************0c');
    //        $res = json_decode($res, true);
    //        $token = $res['access_token'];
    //
    //        // 注意：这里需要将获取到的token缓存起来（或写到数据库中）
    //        // 不能频繁的访问https://api.weixin.qq.com/cgi-bin/token，每日有次数限制
    //        // 通过此接口返回的token的有效期目前为2小时。令牌失效后，JS-SDK也就不能用了。
    //        // 因此，这里将token值缓存1小时，比2小时小。缓存失效后，再从接口获取新的token，这样
    //        // 就可以避免token失效。
    //        // S()是ThinkPhp的缓存函数，如果使用的是不ThinkPhp框架，可以使用你的缓存函数，或使用数据库来保存。
    //
    //        S('access_token', $token, 3600);
    //    }
    //    return $token;
    //}
//………………………………储备函数…………………………………………
});

function dataLoad(callbak) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    var post = AV.Object.extend("post");

    var tags = AV.Object.extend("tags");
    var query = new AV.Query(tags);
    query.find({
        success: function (results) {
            var tags = [];
            for (var i = 0; i < results.length; i++) {
                var object = results[i];
                var tagkey = object.get('tagKey');
                var tagvalue = object.get('tagValue');
                var tag = {
                    key: tagkey,
                    value: tagvalue
                };
                tags.push(tag);
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



