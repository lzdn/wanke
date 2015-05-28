/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height = document.documentElement.clientHeight - 269;
$(".least_height").css({"height": "" + least_height + ""});
var user = AV.Object.extend("User");
var number = 7;
var max_number;
var skx = -number;
var cookie = $.AMUI.utils.cookie;
var useremail_cookie = cookie.get("wankeloginuseremail");
var userpwd_cookie = cookie.get("wankeloginuserpwd");

if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_shop.html';
}else{
load(function(){
    $(".am-icon-checkicon").css("color","#3bb4f2");
    $(".am-icon-closeicon").css("color","#dd514c");
    $(".showam-icon-check").hide();
    $(".hideam-icon-close").hide();
    $(".number_list").hide().children().css("background", "none");
    $(".list_1").show().children().css("background", "#f37b1d");
    $(".list_" + (1 + 1) + "").show();
    $(".list_" + (1 + 2) + "").show();
    $(".list_" + (1 - 1) + "").show();
    $(".list_" + (1 - 2) + "").show();
},0);
}
//window.onload = function () {
//    load();
//};

$(".am-input-group-label").on("click", function () {
    var val = $(".am-form-field").val();
    if (val != "") {
        AV.Query.doCloudQuery("select * from _User where (nickname like \"" + val + "\")", {
            success: function (res) {
                var results = res.results;
                var BlackList = AV.Object.extend('blacklist');
                var query = new AV.Query(BlackList);
                query.find({
                        success: function (blacklist) {
                            var users = new Array();
                            for (var x = 0; x < results.length; x++) {
                                var user = {
                                    id: '',
                                    username: '',
                                    usershow: '',
                                    buser_show: ''
                                };
                                user.id = results[x].id;
                                user.username = results[x].get('nickname');
                                user.usershow = results[x].get('authData').weixin.headimgurl;
                                user.buser_show = "am-icon-check";

                                if (blacklist.length > 0) {
                                    for (var y = 0; y < blacklist.length; y++) {
                                        if (results[x].id == blacklist[y].get('user_id')) {
                                            user.buser_show = "am-icon-close";
                                        }
                                    }
                                    users.push(user);
                                } else {
                                    users.push(user);
                                }
                            }
                            $(".load_list").remove();
                            var $tpl = $('#users');
                            var source = $tpl.text();
                            var template = Handlebars.compile(source);
                            var data = {users: users};
                            var html = template(data);
                            $tpl.before(html);
                            $(".am-form-field").val("");
                            $(".am-icon-checkicon").css("color","#3bb4f2");
                            $(".am-icon-closeicon").css("color","#dd514c");
                            $(".showam-icon-check").hide();
                            $(".hideam-icon-close").hide();
                        }
                    }
                );
            }
        });
    }
});

function load(calback,val) {
    skx += number;
    $('td').remove();
    var query = new AV.Query(user);
    if(val!=1){
        query.count({
            success: function (res) {
                if (res <= number) {
                    $(".pagination").hide();
                } else {
                    max_number = Math.ceil(res / number) * number - number;
                    var length = Math.ceil(res / number);
                    for (var i = 1; i < length; i++) {
                        $("<li class=\"number_list list_" + (i + 1) + "\" onclick=\"new_load(" + (i + 1) + ")\"><a href=\"#\">" + (i + 1) + "</a></li>").insertBefore($("#pagination_right"));
                    }
                }
            }
        });
    }
    query.limit(number).skip(skx);
    query.find({
        success: function (results) {
            var BlackList = AV.Object.extend('blacklist');
            var query = new AV.Query(BlackList);
            query.find({
                    success: function (blacklist) {
                        var users = new Array();
                        for (var x = 0; x < results.length; x++) {
                            var user = {
                                id: '',
                                username: '',
                                usershow: '',
                                buser_show: ''
                            };
                            user.id = results[x].id;
                            user.username = results[x].get('nickname');
                            user.usershow = results[x].get('authData').weixin.headimgurl;
                            user.buser_show = "am-icon-check";

                            if (blacklist.length > 0) {
                                for (var y = 0; y < blacklist.length; y++) {
                                    if (results[x].id == blacklist[y].get('user_id')) {
                                        user.buser_show = "am-icon-close";
                                    }
                                }
                                users.push(user);
                            } else {
                                users.push(user);
                            }
                        }
                        $(".load_list").remove();
                        var $tpl = $('#users');
                        var source = $tpl.text();
                        var template = Handlebars.compile(source);
                        var data = {users: users};
                        var html = template(data);
                        $tpl.before(html);
                        calback();
                    }
                }
            );
        }
    })
}
$("#pagination_left").on("click", function () {
    if (skx != 0) {
        skx -= number * 2;
        var nu_key = (skx + number * 2) / number
        $(".number_list").hide().children().css("background", "none");
        $(".list_" + nu_key + "").show().children().css("background", "#f37b1d");
        $(".list_" + (nu_key + 1) + "").show();
        $(".list_" + (nu_key + 2) + "").show();
        $(".list_" + (nu_key - 1) + "").show();
        $(".list_" + (nu_key - 2) + "").show();
        load(function () {
            $(".am-icon-checkicon").css("color","#3bb4f2");
            $(".am-icon-closeicon").css("color","#dd514c");
            $(".showam-icon-check").hide();
            $(".hideam-icon-close").hide();
        },1);
    }
})
$("#pagination_right").on("click", function () {
    if (skx >= max_number) {

    } else {
        var nu_key = (skx + number * 2) / number
        $(".number_list").hide().children().css("background", "none");
        $(".list_" + nu_key + "").show().children().css("background", "#f37b1d");
        $(".list_" + (nu_key + 1) + "").show();
        $(".list_" + (nu_key + 2) + "").show();
        $(".list_" + (nu_key - 1) + "").show();
        $(".list_" + (nu_key - 2) + "").show();
        load(function () {
            $(".am-icon-checkicon").css("color","#3bb4f2");
            $(".am-icon-closeicon").css("color","#dd514c");
            $(".showam-icon-check").hide();
            $(".hideam-icon-close").hide();
        },1);
    }
})
function busershow(id, bshow) {
    var BlackList = AV.Object.extend('blacklist');
    if (bshow == '0') {
        // 冻结账户
        var blacklist = new BlackList();
        blacklist.set('user_id', id);
        blacklist.save(null, {
            success: function (blacklist) {
                $("."+id+"show").show();
                $("."+id+"hide").hide();
                $("."+id+"icon").removeClass("am-icon-check").addClass("am-icon-close").css("color","#dd514c");
               // load();
            }, error: function (object, error) {

            }
        });
    } else {
        var query = new AV.Query(BlackList);
        query.equalTo('user_id', id);
        query.find({
            success: function (users) {
                users[0].destroy({
                    success: function (user) {
                        // The object was deleted from the LeanCloud.
                        $("."+id+"show").hide();
                        $("."+id+"hide").show();
                        $("."+id+"icon").removeClass("am-icon-close").addClass("am-icon-check").css("color","#3bb4f2");
                      //  load();
                    },
                    error: function (object, error) {
                        // The delete failed.
                        // error is a AV.Error with an error code and description.
                    }
                });
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
            }
        });
    }
}
function new_load(key) {
    $(".load_list").remove();
    $(".number_list").hide().children().css("background", "none");
    $(".list_" + key + "").show().children().css("background", "#f37b1d");
    $(".list_" + (key + 1) + "").show();
    $(".list_" + (key + 2) + "").show();
    $(".list_" + (key - 1) + "").show();
    $(".list_" + (key - 2) + "").show();
    skx = (key - 1) * number - number;
    load(function () {
        $(".am-icon-checkicon").css("color","#3bb4f2");
        $(".am-icon-closeicon").css("color","#dd514c");
        $(".showam-icon-check").hide();
        $(".hideam-icon-close").hide();
    },1);
}