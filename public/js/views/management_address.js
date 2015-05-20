
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height=document.documentElement.clientHeight-254;
$(".least_height").css({"height":""+least_height+""});
var bmenu, menuid, grade;
var bRelease_data=0;
$(".am-panel-default").remove();
var cookie=$.AMUI.utils.cookie;
var useremail_cookie =cookie.get("wankeloginuseremail");
var userpwd_cookie =cookie.get("wankeloginuserpwd");
if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_address.html';
}else{
    loadmenu(function(){
        add_event ();
    });
}

function loadmenu(callbak) {
    var homes = AV.Object.extend("home");
    var querymenu = new AV.Query(homes);
    querymenu.find({
        success: function (res) {
            var houses = [];
            for (var i = 0; i < res.length; i++) {
                var object = res[i];
                var homeid = object.id;
                var homename = object.get("homename");
                var building = object.get("building");
                var house = {
                    id: homeid,
                    name: homename,
                    building: building
                }
                houses.push(house);
            }
            var $tpl = $('#push_house');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {houses: houses};
            var html = template(data);
            $tpl.before(html);
          //  menu_one_length= res.length;
            callbak();
        }
    })
}

// …………………………………储备函数……………………………………………
function destroy_home(meun_id, grade) {
    var homes = AV.Object.extend("home");
    var relation_id,old_name;
    if(grade==1){
        relation_id=menuid;
    }else{
        relation_id=menuid.split("&")[0];
        old_name=menuid.split("&")[1];
    }
    var query = new AV.Query(homes);
    query.get(relation_id,{
        success:function(res_house){
            if(grade==1){
                res_house.destroy({
                    success:function(res){
                        $(".am-panel-default").remove();
                        loadmenu(function(menusdata){
                            add_event (menusdata);
                        });
                    }
                });
            }else{
                res_house.remove("building",{
                    id:relation_id,
                    name:old_name
                });
                res_house.save({
                    success:function(){
                        $(".am-panel-default").remove();
                        loadmenu(function(menusdata){
                            add_event (menusdata);
                        });
                    }
                });
            }
        }
    })
}
function save_house(){
    var house_name = $(".input_menu_name").val();
    if (!house_name) {
        alert("请输入名字");
    } else {
            add_menudata(bmenu, menuid, grade, house_name);
    }
}

function remove_house(){
    if (bmenu == 0) {
        if (grade == 1) {
            destroy_home(menuid, 1);
        }
        if (grade == 2) {
            destroy_home(menuid, 2);
        }
    }
}
function add_menudata(bmenu, menuid, grade,house_name) {
    var homes = AV.Object.extend("home");
    var home = new homes();
    if (bmenu == "1") {
            home.set("homename", house_name);
            home.set("building", []);
            home.save({
                success: function (res) {
                    $(".am-panel-default").remove();
                    loadmenu(function(menusdata){
                        add_event (menusdata);
                    });
                }
            });
    };
    if (bmenu == "2") {
                    var query = new AV.Query(homes);
                    query.get(menuid, {
                        success: function (resmenu) {
                                resmenu.add("building", {
                                    id:menuid,
                                    name:house_name
                                });
                                resmenu.save({
                                    success: function (res) {
                                        $(".am-panel-default").remove();
                                        loadmenu(function(menusdata){
                                            add_event (menusdata);
                                        });
                                    }
                                });
                        }
                    });

    }
    if (bmenu == "0") {
        var relation_id,old_name;
           if(grade==1){
               relation_id=menuid;
           }else{
               relation_id=menuid.split("&")[0];
               old_name=menuid.split("&")[1];
           }
        var query = new AV.Query(homes);
        query.get(relation_id,{
            success: function (reshous) {
                if(!old_name){
                    reshous.set("homename", house_name);
                    reshous.save({
                        success: function (res) {
                            $(".am-panel-default").remove();
                            loadmenu(function(menusdata){
                                add_event (menusdata);
                            });
                        }
                    });
                }else{
                    reshous.add("building",{
                        id:relation_id,
                        name:house_name
                    });
                    reshous.save({
                        success:function(res){
                            res.remove("building",{
                                id:relation_id,
                                name:old_name
                            })
                            res.save({
                                success:function(res){
                                    $(".am-panel-default").remove();
                                    loadmenu(function(menusdata){
                                        add_event (menusdata);
                                    });
                                }
                            });
                        }
                    })
                }
            }
        })
    }
    $(".input_menu_name").val("");
}
function upmodal (event,menuids,bmenus,grades){
    menuid = menuids;
    bmenu = bmenus;
    grade = grades;
    $('#my-prompt').modal();
    event.stopPropagation();
}
function add_event (){
    $(".menu_btn").hide();
    $(".am-panel-title").mouseout(function () {
        $(this).children(".btn_content").children().hide();
    }).mousemove(function () {
        $(this).children(".btn_content").children().show();
    });
}
//var menu = {
//
//    "button": [
//        {
//            "type": "click",
//            "name": "今日歌曲",
//            "key": "V1001_TODAY_MUSIC"
//        },
//        {
//            "name": "菜单",
//            "sub_button": {
//                "list": [
//                    {
//                        "type": "view",
//                        "name": "搜索",
//                        "url": "http://www.soso.com/"
//                    },
//                    {
//                        "type": "view",
//                        "name": "视频",
//                        "url": "http://v.qq.com/"
//                    },
//                    {
//                        "type": "click",
//                        "name": "赞一下我们",
//                        "key": "V1001_GOOD"
//                    }
//                ]
//            }
//        }
//    ]
//}

