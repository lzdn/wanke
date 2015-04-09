/**
 * Created by amberglasses on 15/3/24.
 */
$(function () {
    var localIds=5;
    var user = AV.User;
    var posts = AV.Object.extend("post");
    var tags = AV.Object.extend("tag");
    var newtag = 1;
    dataLoad(function () {
        var aNav = document.getElementsByClassName("am-btn-extend");
            aNav[0].className = "am-btn-extend am-btn am-round am-btn-primary";
            for (var i = 0; i < aNav.length; i++) {
                aNav[i].onclick = function () {
                    for (var j = 0; j < aNav.length; j++) {
                        aNav[j].className = "am-btn-extend am-btn am-round";
                        this.className = "am-btn-extend am-btn am-round am-btn-primary";
                    }
                    console.log(this);
                    newtag = ($(this).attr("value"));
                };
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
    //var postc = AV.posts.current();
    var postc = new posts();
    var relation = postc.relation("imgs");

    $("#smimg").on("click", function () {
        var ofileid = "";
        var localIds="";
        wx.checkJsApi({
            jsApiList: [
                'chooseImage',
                'previewImage'
            ],
            success: function (res) {
                console.log(JSON.stringify(res));
                    var images = {
                        localId: [],
                        serverId: []
                    };
                    wx.chooseImage({
                        success: function (res) {
                            localIds = res.localIds;
                            alert('已选择 ' +localIds.length + ' 张图片');
                            for (var i=0; i<localIds.length; i++){
                                $("<div class=\"imgnav imgnav-"+localIds[i]+"\"><img src=\""+localIds[i]+"\" alt=\"\"/><a href=\"\" class=\"am-icon-close\" value=\""+localIds[i]+"\"></a></div>").prependTo("#imgwall");
                            }
                            // $("<div class=\"-"+localIds[0]+ "\" ><a href=\"#\" value=\""+localIds[0]+"\ class=\"am-close\">&times;</a><img src=\""+localIds[0]+"\ alt=\"#\"/></div>").prependTo("#imgwall");
                                 $("#addimg").show();
                                 var aimgnav = $(".am-icon-close");
                                 for (var i = 0; i < aimgnav.length; i++) {
                                     aimgnav[i].onclick = function () {
                                         var remobeidx = $(this).attr('value');
                                         alert("haha")
                                         alert(remobeidx);
                                         $(".imgnav imgnav-"+remobeidx+"").remove();
                                         var aimgshow = $(".imgnav");
                                         if (aimgshow.length == 0) {
                                             $("#addimg").hide();
                                         }
                                     }
                                 }
                        }
                    });
            }
        });
       // var file = AV.File.withURL('img11.jpg', localIds);
       //// 以下保存图片…………………………………………
       // file.save({
       //     success: function (ofile) {
       //         ofileid = ofile.id;
       //         console.log(ofileid);
       //     }
       // }).then(function () {
       //     var postc = new posts();
       //     var relation = postc.relation("imgs");
       //     $("<div class=\"imgnav imgnav-" + ofileid + " \" ><a href=\"#\" value=\"" + ofileid + "\" class=\"am-close\">&times;</a><img src=\""+ofileid+"\" alt=\"#\"/></div>").prependTo("#imgwall");
       //     $("#addimg").show();
       //     var aimgnav = $(".am-close");
       //     for (var i = 0; i < aimgnav.length; i++) {
       //         aimgnav[i].onclick = function () {
       //             var remobeidx = $(this).attr('value');
       //             console.log(remobeidx);
       //             var query = new AV.Query('_File');
       //             query.get(remobeidx, {
       //                 success: function (ofile) {
       //                     // The object was retrieved successfully.
       //                     console.log("ofile.id:" + ofile.id);
       //                     //ofile.remove(ofile);
       //                     ofile.destroy().then(function () {
       //                         //删除成功
       //                         console.log('删除成功');
       //                     });
       //                 }
       //             });
       //             $(".imgnav-" + remobeidx + "").remove();
       //             var aimgshow = $(".imgnav");
       //             if (aimgshow.length == 0) {
       //                 $("#addimg").hide();
       //             }
       //         };
       //     }
       // });
    });

    //…………………………保存心情 和 tagkey………………………………
    function savecontent() {
        var aUserval2 = $("#doc-ta-1").val();
        var tag = new tags();
        tag.id = newtag;
        var postc = new posts();
        postc.save({
            content: aUserval2,
            tagkey: tag,
            imgs: relation
        }, {
            success: function (object) {
                alert("发表成功");
            }
        });
    }

//………………………………储备函数…………………………………………
    function dataLoad(callbak) {
        var appId, jslist, noncestr, signature, timestamp, jsApiList;
        $.get("http://fuwuhao.dianyingren.com/weixin/getJsConfig", function (result) {
            appId = result.appId;
            jslist = result.jsApiList;
            noncestr = result.nonceStr;
            signature = result.signature;
            timestamp = result.timestamp;
            jsApiList = result.jsApiList;
            wx.config({
                debug:false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: noncestr, // 必填，生成签名的随机串
                signature: signature,// 必填，签名，见附录1
                jsApiList: jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });

        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        var tags = AV.Object.extend("tag");
        var query = new AV.Query(tags);
        query.find({
            success: function (results) {
                var tags = [];
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var tagid = object.id;
                    var tagvalue = object.get('tagtitle');
                    var tag = {
                        key: tagid,
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


});





