/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height=document.documentElement.clientHeight-217;
$(".least_height").css({"height":""+least_height+""});
var post = AV.Object.extend("post");
var skx=-10;

var cookie=$.AMUI.utils.cookie;
var useremail_cookie =cookie.get("wankeloginuseremail");
var userpwd_cookie =cookie.get("wankeloginuserpwd");

if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_shop.html';
}else{
    load(function(){
        $(".am-icon-eyeicon").css("color","#3bb4f2");
        $(".am-icon-eye-slashicon").css("color","#dd514c");
        $(".showam-icon-eye").hide();
        $(".hideam-icon-eye-slash").hide();
    });
}
//window.onload = function () {
//    load();
//};
function load(calback) {
    skx+=10;
    $('td').remove();
    var query = new AV.Query(post);
    query.count({
        success:function(res){
            if(res<=10){
                $(".pagination").hide();
            }else{

            }
        }
    });
    query.limit(10).skip(skx);
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
                    post_show:''
                };
                post.id = results[x].id;
                post.content = results[x].get('content');
                post.usershow = results[x].get('username').get("authData").weixin.headimgurl;
                post.username = results[x].get('username').get("nickname");
                if(results[x].get('b_show')==1){
                    post.post_show = "am-icon-eye";
                }else{
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

function post_show (id,key){
    var query = new AV.Query(post);
    query.get(id,{
        success:function(post){
            post.set("b_show",key);
            post.save();
        }
    })
    if(key==0){
        $("."+id+"show").show();
        $("."+id+"hide").hide();
        $("."+id+"icon").removeClass("am-icon-eye").addClass("am-icon-eye-slash").css("color","#dd514c");
    }else{
        $("."+id+"show").hide();
        $("."+id+"hide").show();
        $("."+id+"icon").removeClass("am-icon-eye-slash").addClass("am-icon-eye").css("color","#3bb4f2");
    }
}
