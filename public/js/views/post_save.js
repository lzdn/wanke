/**
 * Created by amberglasses on 15/3/24.
 */
$(function () {
    $.get("http://123.57.14.126/weixin/getJsConfig", function (json) {
        alert(json);
        console.log(json);
        Id =json.appId;
        jslist =json.jsApiList;
        noncestr =json.nonceStr;
        signature =json.signature;
        timestamp =json.timestamp;
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
    //var postc = AV.post.current();
    var postc = new post();
    var relation = postc.relation("imgs");

    $("#photolibrary").on("click", function () {
        var localIds=""
        var ofileid = "";
        wximages(function () {
            var file = AV.File.withURL('img11.jpg', localIds);
            file.save({
                success: function (ofile) {
                    ofileid = ofile.id;
                    console.log(ofileid);
                }
            }).then(function () {
                var postc = new post();
                var relation = postc.relation("imgs");
                $("<div class=\"imgnav imgnav-" + ofileid + " \" ><a href=\"#\" value=\"" + ofileid + "\" class=\"am-close\">&times;</a><img src=localIds alt=\"#\"/></div>").prependTo("#imgwall");
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
                                });
                            }
                        });
                        $(".imgnav-" + remobeidx + "").remove();
                        var aimgshow = $(".imgnav");
                        if (aimgshow.length == 0) {
                            $("#addimg").hide();
                        }
                    };
                }
            });
        });


    });


    //…………………………保存心情 和 tagkey………………………………
    function savecontent() {
        var aUserval2 = $("#doc-ta-1").val();
        var savetags = "";
        var query = new AV.Query("tags");
        query.equalTo("tagKey", newtag);
        query.find({
            success: function (results) {
                savetags = results[0].id;
                console.log(savetags);
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
                    }
                });
            }
        });
    }

//………………………………储备函数…………………………………………
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

    function wximages(saveimgs) {
        wx.chooseImage({
            success: function (res) {
                localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                console.log(localIds);
            }
        });
        saveimgs();
    }




});





