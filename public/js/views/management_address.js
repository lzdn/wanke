
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var bmenu, menuid, grade;
var bRelease_data=0;
$(".am-panel-default").remove();
loadmenu(function(){
    add_event ();
});
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
function destroy_menu(meun_id, grade) {
    var menus = AV.Object.extend("menu");
    if (grade == 1) {
        var query = new AV.Query(menus);
        query.get(meun_id, {
            success: function (destroy_menu) {
                var destroy_menus = destroy_menu.get("relationmenu_id");
                if (destroy_menus && destroy_menus.length > 0) {
                    for (var i = 0; i < destroy_menus.length; i++) {
                        var query2 = new AV.Query(menus);
                        query2.get(destroy_menus[i], {
                            success: function (res) {
                                res.destroy({
                                    success: function () {
                                        if (i == destroy_menus.length - 1) {
                                            //window.location.reload();
                                        }
                                    }
                                });
                            }
                        })
                    }
                    destroy_menu.destroy({
                        success: function () {
                            $(".am-panel-default").remove();
                            bRelease_data+=1;
                            loadmenu(function(menusdata){
                                add_event (menusdata);
                            });
                        }
                    });
                } else {
                    destroy_menu.destroy({
                        success: function () {
                            $(".am-panel-default").remove();
                            bRelease_data+=1;
                            loadmenu(function(menusdata){
                                add_event (menusdata);
                            });
                        }
                    });
                }
            }
        })
    } else {
        var query = new AV.Query(menus);
        query.get(meun_id, {
            success: function (destroy_menu) {
                var relation_menuid = destroy_menu.get("menu_relation").id;
                var oldresmenu = {
                    id: destroy_menu.id,
                    type: destroy_menu.get("menu_type"),
                    name: destroy_menu.get("menu_name"),
                    content: destroy_menu.get("menu_content")
                }
                var query2 = new AV.Query(menus);
                query2.get(relation_menuid, {
                    success: function (res_menu) {
                        res_menu.remove("relationmenu_id", meun_id);
                        res_menu.remove("relationmenu", oldresmenu);
                        res_menu.save({
                            success: function () {
                                destroy_menu.destroy({
                                    success: function () {
                                        $(".am-panel-default").remove();
                                        bRelease_data+=1;
                                        loadmenu(function(menusdata){
                                            add_event (menusdata);
                                        });
                                    }
                                });
                            }
                        });
                    }
                })
            }
        });
    }
}
function save_house(){
    var house_name = $(".input_menu_name").val();
    if (!house_name) {
        alert("名字");
    } else {
            add_menudata(bmenu, menuid, grade, house_name);
    }
}

function remove_house(){
    if (bmenu == 0) {
        if (grade == 1) {
            destroy_menu(menuid, 1);
        }
        if (grade == 2) {
            destroy_menu(menuid, 2);
        }
    }
}
function add_menudata(bmenu, menuid, grade,house_name) {
    alert(menuid+"sdfsdf"+bmenu+"sdssad"+grade+"ddsf"+house_name);
    var homes = AV.Object.extend("home");
    var home = new homes();
    if (bmenu == "1") {
            home.set("homename", house_name);
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
                                resmenu.add("building", house_name);
                                resmenu.save({
                                    success: function (res) {
                                        $(".am-panel-default").remove();
                                        bRelease_data+=1;
                                        loadmenu(function(menusdata){
                                            add_event (menusdata);
                                        });
                                    }
                                });
                        }
                    });

    }
    if (bmenu == "0") {
           if(grade==1){
               alert(menuid+"xcxzczxczxc111111")
           }else{
               alert(menuid+"sadsdsasds22222");
               var aa=$(".menuid").parent().attr("value");
               alert(aa);
           }
    }
    $(".input_menu_name").val("");
    $(".input_menu_content").val("");
}
function upmodal (event,menuids,bmenus,grades){
    menuid = menuids;
    bmenu = bmenus;
    grade = grades;
    $('#my-prompt').modal();
    event.stopPropagation();
}
function Release_data(){

    console.log(menu);
    //$.ajax({
    //    method: "POST",
    //    url: server + "/weixin/publishMenu",
    //    data: menu,
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (result) {}
    //});

}
function add_event (){
    $(".menu_btn").hide();
    $(".btn_content").mouseout(function () {
        $(this).children().hide();
    }).mousemove(function () {
        $(this).children().show();
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

