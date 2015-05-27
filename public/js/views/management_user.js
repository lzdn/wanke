/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height=document.documentElement.clientHeight-217;
$(".least_height").css({"height":""+least_height+""});
var user = AV.Object.extend("User");
var Shop_id, shop_name, shop_title, shop_service, shop_address, service_time, shop_range, shop_type, shop_tel, Judge_menu;

var cookie=$.AMUI.utils.cookie;
var useremail_cookie =cookie.get("wankeloginuseremail");
var userpwd_cookie =cookie.get("wankeloginuserpwd");

if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_shop.html';
}else{
    load();
}
//window.onload = function () {
//    load();
//};
function load() {
    $('td').remove();
    var query = new AV.Query(user);
    query.find({
        success: function (results) {
            var users = new Array();
            for (var x = 0; x < results.length; x++) {
                var user = {
                    id: '',
                    username: '',
                    usershow: '',
                    buser_show:''
                };
                user.id = results[x].id;
                user.username = results[x].get('nickname');
                user.usershow = results[x].get('authData').weixin.headimgurl;
                if(results[x].get('b_user_show')==0){
                    user.buser_show="am-icon-minus-circle";
                }else{
                    user.buser_show="am-icon-external-link-square";
                }
                users.push(user);
            }
            console.log(users);
            var $tpl = $('#users');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {users: users};
            var html = template(data);
            $tpl.before(html);
        }
    })
}

  function busershow(id,bshow){
      var query = new AV.Query(AV.User);
      query.get(id, {
          success: function (user) {
              console.log(user)
              user.set('b_user_show',bshow);
              user.save()
          },
          error: function (object, error) {
              console.log(object);
              // The object was not retrieved successfully.
              // error is a AV.Error with an error code and description.
          }
      });
 }