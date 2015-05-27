/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height = document.documentElement.clientHeight - 269;
$(".least_height").css({"height": "" + least_height + ""});
var post = AV.Object.extend("post");
var number = 7;
var max_number;
var skx = -number;
var cookie = $.AMUI.utils.cookie;
var useremail_cookie = cookie.get("wankeloginuseremail");
var userpwd_cookie = cookie.get("wankeloginuserpwd");

if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_shop.html';
}else{
load(function () {
    $(".am-icon-eyeicon").css("color", "#3bb4f2");
    $(".am-icon-eye-slashicon").css("color", "#dd514c");
    $(".showam-icon-eye").hide();
    $(".hideam-icon-eye-slash").hide();
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
function load(calback,val) {
    skx += number;
    $('td').remove();
    var query = new AV.Query(post);
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
    query.include("username");
    query.find({
        success: function (results) {
            var posts = new Array();
            for (var x = 0; x < results.length; x++) {
                var post = {
                    id: '',
                    content: '',
                    usershow: '',
                    username: '',
                    post_show: ''
                };
                post.id = results[x].id;
                post.content = results[x].get('content');
                post.usershow = results[x].get('username').get("authData").weixin.headimgurl;
                post.username = results[x].get('username').get("nickname");
                if (results[x].get('b_show') == 1) {
                    post.post_show = "am-icon-eye";
                } else {
                    post.post_show = "am-icon-eye-slash";
                }
                posts.push(post);
            }
            var $tpl = $('#posts');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {posts: posts};
            var html = template(data);
            $tpl.before(html);
            calback();
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
            $(".am-icon-eyeicon").css("color", "#3bb4f2");
            $(".am-icon-eye-slashicon").css("color", "#dd514c");
            $(".showam-icon-eye").hide();
            $(".hideam-icon-eye-slash").hide();
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
            $(".am-icon-eyeicon").css("color", "#3bb4f2");
            $(".am-icon-eye-slashicon").css("color", "#dd514c");
            $(".showam-icon-eye").hide();
            $(".hideam-icon-eye-slash").hide();
        },1);
    }
})

function post_show(id, key) {
    var query = new AV.Query(post);
    query.get(id, {
        success: function (post) {
            post.set("b_show", key);
            post.save();
        }
    })
    if (key == 0) {
        $("." + id + "show").show();
        $("." + id + "hide").hide();
        $("." + id + "icon").removeClass("am-icon-eye").addClass("am-icon-eye-slash").css("color", "#dd514c");
    } else {
        $("." + id + "show").hide();
        $("." + id + "hide").show();
        $("." + id + "icon").removeClass("am-icon-eye-slash").addClass("am-icon-eye").css("color", "#3bb4f2");
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
        $(".am-icon-eyeicon").css("color", "#3bb4f2");
        $(".am-icon-eye-slashicon").css("color", "#dd514c");
        $(".showam-icon-eye").hide();
        $(".hideam-icon-eye-slash").hide();
    },1);
}
