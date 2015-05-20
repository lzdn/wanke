/**
 * Created by Administrator on 2015/4/3.
 */
var server = "http://123.57.255.123";

function destroy_cookie(){
    var cookie=$.AMUI.utils.cookie;
    cookie.unset("wankeloginuseremail");
    cookie.unset("wankeloginuserpwd");
    window.location.href= server + '/management_login.html';
}