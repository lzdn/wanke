/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height = document.documentElement.clientHeight - 217;
$(".least_height").css({"height": "" + least_height + ""});
var user = AV.Object.extend("User");
var Shop_id, shop_name, shop_title, shop_service, shop_address, service_time, shop_range, shop_type, shop_tel, Judge_menu;

var cookie = $.AMUI.utils.cookie;
var useremail_cookie = cookie.get("wankeloginuseremail");
var userpwd_cookie = cookie.get("wankeloginuserpwd");

if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_shop.html';
}else{
load(function(){
    $(".am-icon-minus-circleicon").css("color","#3bb4f2");
    $(".am-icon-external-link-squareicon").css("color","#dd514c");
    $(".showam-icon-external-link-square").hide();
    $(".hideam-icon-minus-circle").hide();
});
}
//window.onload = function () {
//    load();
//};
function load(calback) {
    $('td').remove();
    var query = new AV.Query(user);
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
                            user.buser_show = "am-icon-external-link-square";

                            if (blacklist.length > 0) {
                                for (var y = 0; y < blacklist.length; y++) {
                                    if (results[x].id == blacklist[y].get('user_id')) {
                                        user.buser_show = "am-icon-minus-circle";
                                        users.push(user);
                                    } else {
                                        users.push(user);
                                    }
                                }
                            } else {
                                users.push(user);
                            }
                        }
                        console.log(users);
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

function busershow(id, bshow) {
    console.log(id + '----------' + bshow);
    var BlackList = AV.Object.extend('blacklist');
    if (bshow == '0') {
        // 冻结账户
        var blacklist = new BlackList();
        blacklist.set('user_id', id);
        blacklist.save(null, {
            success: function (blacklist) {
                $("."+id+"show").show();
                $("."+id+"hide").hide();
                $("."+id+"icon").removeClass("am-icon-external-link-square").addClass("am-icon-minus-circle").css("color","#dd514c");
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
                        $("."+id+"icon").removeClass("am-icon-minus-circle").addClass("am-icon-external-link-square").css("color","#3bb4f2");
                      //  load();
                    },
                    error: function (object, error) {
                        // The delete failed.
                        // error is a AV.Error with an error code and description.
                    }
                });
            },
            error: function (object, error) {
                console.log(error);
                // The object was not retrieved successfully.
            }
        });
    }
}