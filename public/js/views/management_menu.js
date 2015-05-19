AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var cookie = $.AMUI.utils.cookie;
var useremail_cookie = cookie.get("wankeloginuseremail");
var userpwd_cookie = cookie.get("wankeloginuserpwd");

var bmenu, menuid, grade, menu, menu_one_length;
var menus = AV.Object.extend("menu");
var bRelease_data = 0;
if (!useremail_cookie || !userpwd_cookie) {
    window.location.href = server + '/management_login.html?Jumpurl=management_menu.html';
} else {
    $(".am-panel-default").remove();
    loadmenu(function (menusdata) {
        add_event(menusdata);
    });
}
function loadmenu(callbak) {
    var menus = AV.Object.extend("menu");
    var querymenu = new AV.Query(menus);
    querymenu.equalTo("grade", "1");
    querymenu.find({
        success: function (res) {
            var menus = [];
            for (var i = 0; i < res.length; i++) {
                var object = res[i];
                var menuid = object.id;
                var menuname = object.get("menu_name");
                var menutype = object.get("menu_type");
                var menucontent = object.get("menu_content");
                var relationmenu = object.get("relationmenu");
                var menu = {
                    id: menuid,
                    name: menuname,
                    type: menutype,
                    relation: relationmenu,
                    content: menucontent
                }
                menus.push(menu);
            }
            var $tpl = $('#push_menu');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {menus: menus};
            var html = template(data);
            $tpl.before(html);
            menu_one_length = res.length;
            callbak(menus);
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
                            bRelease_data += 1;
                            loadmenu(function (menusdata) {
                                add_event(menusdata);
                            });
                        }
                    });
                } else {
                    destroy_menu.destroy({
                        success: function () {
                            $(".am-panel-default").remove();
                            bRelease_data += 1;
                            loadmenu(function (menusdata) {
                                add_event(menusdata);
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
                                        bRelease_data += 1;
                                        loadmenu(function (menusdata) {
                                            add_event(menusdata);
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
function save_menu() {
    var menuname = $(".input_menu_name").val();
    var menucontent = $(".input_menu_content").val();
    var menutype = $("input[name='docVlGender']:checked").val();
    if (menuid == 0) {
        menutype = "null"
    }
    if (!menuname) {
        alert("请输入菜单名");
    } else {
        if (!menucontent && menutype != "null") {
            alert("请输入关系");
        } else {
            $(".input").val("");
            add_menudata(bmenu, menuid, grade, menuname, menucontent, menutype, menu_one_length);
        }
    }
}

function remove_menu() {
    if (bmenu == 0) {
        if (grade == 1) {
            destroy_menu(menuid, 1);
        }
        if (grade == 2) {
            destroy_menu(menuid, 2);
        }
    }
}
function add_menudata(bmenu, menuid, grade, menuname, menucontent, menutype, menu_one_length) {

    var menu = new menus();
    if (bmenu == "1") {
        if (menu_one_length >= 3) {
            alert("只允许添加三个一级菜单")
        } else {
            menu.set("menu_name", menuname);
            menu.set("menu_type", menutype);
            menu.set("menu_content", menucontent);
            menu.set("grade", "1");
            menu.save({
                success: function (res) {
                    $(".am-panel-default").remove();
                    bRelease_data += 1;
                    loadmenu(function (menusdata) {
                        add_event(menusdata);
                    });
                }
            });
        }
    }
    ;
    if (bmenu == "2") {
        var menurelation = new menus();
        menurelation.id = menuid;
        menu.set("menu_name", menuname);
        menu.set("menu_type", menutype);
        menu.set("menu_content", menucontent);
        menu.set("grade", "2");
        menu.set("menu_relation", menurelation);
        menu.save({
            success: function (res) {
                var newmenu = {
                    id: res.id,
                    type: res.get("menu_type"),
                    name: res.get("menu_name"),
                    content: res.get("menu_content")
                }
                var query = new AV.Query(menus);
                query.get(menuid, {
                    success: function (resmenu) {
                        if (resmenu.get("relationmenu_id") && resmenu.get("relationmenu_id").length >= 5) {
                            alert("每个一级菜单只允许添加五个二级菜单");
                            res.destroy();
                        } else {
                            resmenu.set("menu_type", "null")
                            resmenu.set("menu_content", "")
                            resmenu.add("relationmenu", newmenu);
                            resmenu.add("relationmenu_id", res.id);
                            resmenu.save({
                                success: function (res) {
                                    $(".am-panel-default").remove();
                                    bRelease_data += 1;
                                    loadmenu(function (menusdata) {
                                        add_event(menusdata);
                                    });
                                }
                            });
                        }
                    }
                });
            }
        })
    }
    if (bmenu == "0") {
        var query = new AV.Query(menus);
        query.get(menuid, {
            success: function (resmenu) {
                var oldresmenu = {
                    id: resmenu.id,
                    type: resmenu.get("menu_type"),
                    name: resmenu.get("menu_name"),
                    content: resmenu.get("menu_content")
                }
                resmenu.set("menu_name", menuname);
                resmenu.set("menu_type", menutype);
                if (menutype != "null") {
                    resmenu.set("relationmenu", []);
                    if (resmenu.get("grade") == 1) {
                        var destroy_menu = resmenu.get("relationmenu_id");
                        if (destroy_menu) {
                            for (var i = 0; i < destroy_menu.length; i++) {
                                var query = new AV.Query(menus);
                                query.get(destroy_menu[i], {
                                    success: function (destroy_menu) {
                                        destroy_menu.destroy();
                                    }
                                });
                            }
                            resmenu.set("relationmenu_id", []);
                        }
                    }
                }
                resmenu.set("menu_content", menucontent);
                resmenu.save({
                    success: function (newresmenu) {
                        var newresmenu = {
                            id: newresmenu.id,
                            type: newresmenu.get("menu_type"),
                            name: newresmenu.get("menu_name"),
                            content: newresmenu.get("menu_content")
                        }
                        if (resmenu.get("grade") == 2) {
                            var updata_id = resmenu.get("menu_relation").id;
                            var query = new AV.Query(menus);
                            query.get(updata_id, {
                                success: function (up_resmenu) {
                                    up_resmenu.add("relationmenu", newresmenu);
                                    up_resmenu.save({
                                        success: function (up_resmenu2) {
                                            up_resmenu2.remove("relationmenu", oldresmenu);
                                            up_resmenu2.save({
                                                success: function (res) {
                                                    $(".am-panel-default").remove();
                                                    loadmenu(function (menusdata) {
                                                        bRelease_data += 1;
                                                        add_event(menusdata);
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            $(".am-panel-default").remove();
                            bRelease_data += 1;
                            loadmenu(function (menusdata) {
                                add_event(menusdata);
                            });
                        }
                    }
                });
            }
        });
    }
}
function upmodal(event, menuids, bmenus, grades) {
    menuid = menuids;
    bmenu = bmenus;
    grade = grades;
    $(".remove_menu").hide();
    if (menuids == 0) {
        $(".input_menu_name").val("");
        $("#input_menu_content,#am-radio-inline").hide();
    } else {
        $("#input_menu_content,#am-radio-inline").show();
        if (bmenus == 0) {
            var query = new AV.Query(menus);
            query.get(menuid, {
                success: function (menu_name) {
                    $(".input_menu_name").val("" + menu_name.get("menu_name") + "");
                    $(".input_menu_content").val("" + menu_name.get("menu_content") + "");
                }
            })
        } else {
            $(".input_menu_name").val("");
        }
    }
    if (bmenus != 0) {
        $("#return_btn").addClass("am-modal-btn");
        $("#delete_btn").removeClass("am-modal-btn");
        $(".am-modal-bd").html("添加菜单");
    } else {
        $(".am-modal-bd").html("编辑菜单");
        $("#return_btn").removeClass("am-modal-btn");
        $("#delete_btn").addClass("am-modal-btn");
    }
    $('#my-prompt').modal();
    event.stopPropagation();
}
function Release_data() {

    console.log({"menu": menu});
    $.ajax({
        method: "POST",
        url: server + "/weixin/publishMenu",
<<<<<<< HEAD
        data: JSON.stringify({
            data: menu
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("dsadsadsad++cuowu"+msg);
        },
        error: function (msg) {
              alert("dsadsadsad++cuowu"+msg);
=======
        data: {"menu": menu},
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            alert("chengg" + result);
>>>>>>> origin/master
        }
    });
}
function add_event(menusdata) {
    if (bRelease_data != 0) {
        $("#Release").removeClass("am-disabled");
    }
    var button = []
    for (var i = 0; i < menusdata.length; i++) {
        if (menusdata[i].type != "null") {
            var title;
            if (menusdata[i].type == "view") {
                var button_data = {
                    "type": menusdata[i].type,
                    "name": menusdata[i].name,
                    "url": menusdata[i].content
                }
            } else {
                var button_data = {
                    "type": menusdata[i].type,
                    "name": menusdata[i].name,
                    "key": menusdata[i].content
                }
            }

            button.push(button_data);
        } else {
            var relation_data = menusdata[i].relation;
            var list_data = [];
            if (relation_data) {
                for (var j = 0; j < relation_data.length; j++) {
                    if (relation_data[j].type == "view") {
                        var list = {
                            "type": relation_data[j].type,
                            "name": relation_data[j].name,
                            "url": relation_data[j].content
                        }
                    } else {
                        var list = {
                            "type": relation_data[j].type,
                            "name": relation_data[j].name,
                            "key": relation_data[j].content
                        }
                    }
                    list_data.push(list);
                }
                var button_data = {
                    "name": menusdata[i].name,
                    "sub_button": {
                        "list": list_data
                    }
                }
                button.push(button_data);
            } else {
                var button_data = {
                    "name": menusdata[i].name,
                    "sub_button": {
                        "list": list_data
                    }
                }
                button.push(button_data);
            }
        }
    }
    menu = {
        "button": button
    }
    $(".view").addClass("am-icon-chain");
    $(".click").addClass("am-icon-wechat");
    $(".menu_btn").hide();
    $("input[name=docVlGender]:eq(0)").attr("checked", 'checked');
    $("input[name=docVlGender]").on("click", function () {
        if ($("input[name='docVlGender']:checked").val() == "click") {
            $("#input_menu_type").html("发送文字：");
        } else {
            $("#input_menu_type").html("跳转链接：");
        }
    });
    $(".am-panel-title").mouseout(function () {
        $(this).children(".btn_content").children().hide();
    }).mousemove(function () {
        $(this).children(".btn_content").children().show();
    });
}

//var menu = {
//    "button": [{
//        "type": "view",
//        "name": "易生活",
//        "url": "http://fuwuhao.dianyingren.com/shop_index.html"
//    }, {
//        "type": "view",
//        "name": "邻里圈",
//        "url": "http://fuwuhao.dianyingren.com/post_index.html"
//    }, {
//        "type": "view",
//        "name": "个人中心",
//        "url": "http://fuwuhao.dianyingren.com/user_detail.html?code="
//    }]
//};

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
