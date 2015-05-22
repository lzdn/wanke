(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    var cookie=$.AMUI.utils.cookie;
    var adm = AV.Object.extend("admin");
    //……………………此处设置默认跳转……………………
    var Jump_url="management_shop.html";
    var useremail_cookie =cookie.get("wankeloginuseremail");
    var userpwd_cookie =cookie.get("wankeloginuserpwd");
    // window.location.search.split('=')[2]
    if(window.location.search.split('?Jumpurl=')[1]){
        Jump_url=window.location.search.split('?Jumpurl=')[1];
    }
    if(useremail_cookie&&userpwd_cookie){
        //…………………………待跳转……………………
            window.location.href= server + '/'+Jump_url;
    }
   $("#login").on("click",function(){
        var user = $("#email").val();
        var pwd = $("#password").val();
       Query_user(user,pwd);
   });

    function Query_user(user,pwd){
        var query = new AV.Query(adm);
        query.equalTo("email",user);
        query.find({
            success:function(adm_user){
                if(adm_user!=""){
                    if(adm_user[0].get("password")==pwd){
                        addCookie(user,pwd,7);
                    }else{
                        alert("密码错误");
                    }
                }else{
                    alert("账号不存在");
                }
            }
        })
    }

    function addCookie(user,pwd,expiresHours){
            var date=new Date();
          console.log(date);
        date.setTime(date.getTime()+expiresHours*24*3600*1000);
        cookie.set("wankeloginuseremail", user,date);
        cookie.set("wankeloginuserpwd", pwd,date);
        //…………………………待跳转……………………
        window.location.href= server + '/'+Jump_url;
    }



})(jQuery);
