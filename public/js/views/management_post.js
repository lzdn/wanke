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
    flip_up(1,((max_number/number)+1));
},0);
}
//window.onload = function () {
//    load();
//};

$(".am-input-group-label").on("click", function () {
    var val = $(".am-form-field").val();
    if (val != "") {
        AV.Query.doCloudQuery("select * from post where (content like \"" + val + "\")", {
            success: function (result) {
               var select = result.results;
                console.log(result);
                console.log(select);
                var post = AV.Object.extend("post");
                var tags = AV.Object.extend("tags");
                var user = AV.Object.extend("User");
                if (select.length != 0) {
                    $(".load_list").remove();
                    length = select.length;
                    for (var i = 0; i < select.length; i++) {
                        console.log(select[i].id);
                        var posts = AV.Object.extend("post");
                        var query = new AV.Query(posts);
                        query.include("username");
                        query.equalTo("objectId", select[i].id);
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
                                $(".am-form-field").val("");
                                $(".am-icon-eyeicon").css("color", "#3bb4f2");
                                $(".am-icon-eye-slashicon").css("color", "#dd514c");
                                $(".showam-icon-eye").hide();
                                $(".hideam-icon-eye-slash").hide();
                                //clickevent();
                                //var publish = document.getElementsByClassName("Publish").length;
                                //$(".Delete").empty();
                                //$("<p class=\"Delete am-sans-serif\">包含“" + val + "”的结果共“" + publish + "”条</p>").appendTo($("#field"));
                            }
                        })
                    }
                } else {
                    alert("查询结果不存在");
                }
            }
        });
    }else{
        skx -= number;
        load(function () {
            $(".am-icon-eyeicon").css("color", "#3bb4f2");
            $(".am-icon-eye-slashicon").css("color", "#dd514c");
            $(".showam-icon-eye").hide();
            $(".hideam-icon-eye-slash").hide();
        },1);
    }
});

function load(calback,val) {
    skx += number;
    $('td').remove();
    var query = new AV.Query(post);
    if(val!=1){
        query.count({
            success: function (res) {
                if (res <= number) {
                   // $(".pagination").hide();
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
        flip_up(nu_key,((max_number/number)+1));
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
        flip_up(nu_key,((max_number/number)+1));
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
function del(id){
    var query = new AV.Query(post);
    query.get(id, {
        success: function (post) {
            post.destroy();
            $(".list_"+id+"").remove();
        }
    })
}

function new_load(key) {
    $(".load_list").remove();
    $(".number_list").hide().children().css("background", "none");
    flip_up(key,((max_number/number)+1));
    skx = (key - 1) * number - number;
    load(function () {
        $(".am-icon-eyeicon").css("color", "#3bb4f2");
        $(".am-icon-eye-slashicon").css("color", "#dd514c");
        $(".showam-icon-eye").hide();
        $(".hideam-icon-eye-slash").hide();
    },1);
}
function flip_up(key,max_key){
    $(".list_" + key + "").show().children().css("background", "#f37b1d");
    $(".list_" + (key + 1) + "").show();
    $(".list_" + (key + 2) + "").show();
    $(".list_" + (key - 1) + "").show();
    $(".list_" + (key - 2) + "").show();
    if(key==1){
        $(".list_" + (key + 3) + "").show();
        $(".list_" + (key + 4) + "").show();
    }
    if(key==2){
        $(".list_" + (key + 3) + "").show();
    }
    if((max_key-key)==0){
        $(".list_" + (key - 3) + "").show();
        $(".list_" + (key - 4) + "").show();
    }
    if((max_key-key)==1){
        $(".list_" + (key - 3) + "").show();
    }
}