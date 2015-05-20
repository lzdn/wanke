AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height=document.documentElement.clientHeight-254;
$(".least_height").css({"height":""+least_height+""});
var menus = AV.Object.extend("menu");
var cloud_id, bmenu, menuid, grade, menu, old_data, new_data;
var bRelease_data = 0;
var cookie=$.AMUI.utils.cookie;
var useremail_cookie =cookie.get("wankeloginuseremail");
var userpwd_cookie =cookie.get("wankeloginuserpwd");
if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_address.html';
}else{
    load_menu(function (data, id) {
        cloud_id = id;
        new_data = data;
        add_event()
    });
}
function load_menu(callbak) {
    var query = new AV.Query(menus);
    query.find({
        success: function (res) {
            old_data = res[0].get("content");
            var $tpl = $('#push_menu');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {menus: old_data.button};
            var html = template(data);
            $tpl.before(html);
            //menu_one_length = res.length;
            callbak(old_data, res[0].id);
        }
    })
}


function upmodal(event, menuids, bmenus, grades) {
    var arry = new_data.button;
    console.log(menuids + "dfsd" + bmenus + "dsfds" + grades);
    menuid = menuids;
    bmenu = bmenus;
    grade = grades;
    $(".remove_menu").hide();
    if (menuids == 0) {
        $(".input_menu_name").val("");
        $(".input_menu_content").val("");
        $("#input_menu_content,#am-radio-inline").hide();
    } else {
        $("#input_menu_content,#am-radio-inline").show();
        if (bmenus == 0) {
            if (grades == "1") {
                for (var i = 0; i < arry.length; i++) {
                    if (arry[i].id == menuid) {
                        $(".input_menu_name").val("" + arry[i].name + "");
                        if (arry[i].key != "null") {
                            $(".input_menu_content").val("" + arry[i].key + "");
                        } else {
                            $(".input_menu_content").val("");
                        }

                        if (arry[i].type == "view") {
                            $('input[name=docVlGender]').get(1).checked = true;
                            $("#input_menu_type").html("跳转链接：");
                        } else {
                            $('input[name=docVlGender]').get(0).checked = true;
                            $("#input_menu_type").html("发送文字：");
                        }
                    }
                }
            } else {
                var relation_id = $("." + menuid + "").parent().attr("value");
                for (var i = 0; i < arry.length; i++) {
                    if (arry[i].id == relation_id) {
                        var relation_arry = arry[i].list;
                        for (var j = 0; j < relation_arry.length; j++) {
                            if (relation_arry[j].id == menuid) {
                                $(".input_menu_name").val("" + relation_arry[j].name + "");
                                if (relation_arry[j].key != "null") {
                                    $(".input_menu_content").val("" + relation_arry[j].key + "");
                                } else {
                                    $(".input_menu_content").val("");
                                }

                                if (relation_arry[j].type == "view") {
                                    $('input[name=docVlGender]').get(1).checked = true;
                                    $("#input_menu_type").html("跳转链接：");
                                } else {
                                    $('input[name=docVlGender]').get(0).checked = true;
                                    $("#input_menu_type").html("发送文字：");
                                }
                            }
                        }
                    }
                }
            }
        } else {
            $(".input_menu_name").val("");
            $(".input_menu_content").val("");
            $('input[name=docVlGender]').get(0).checked = true;
            $("#input_menu_type").html("发送文字：");
        }
    }

    if (bmenus != 0) {
        $("#return_btn").addClass("am-modal-btn");
        $("#delete_btn").removeClass("am-modal-btn");
        $(".am-modal-bd-extend").html("添加菜单");
    } else {
        $(".am-modal-bd-extend").html("编辑菜单");
        $("#return_btn").removeClass("am-modal-btn");
        $("#delete_btn").addClass("am-modal-btn");
    }

    $('#my-prompt').modal();
    event.stopPropagation();
}

function save_menu() {
    var menuname = $(".input_menu_name").val();
    var menucontent = $(".input_menu_content").val();
    var menutype = $("input[name='docVlGender']:checked").val();
    if (!menuname) {
        alert("请输入菜单名称");
    } else {
        if (!menucontent && menuid != 0) {
            alert("请输入关联");
        } else {
            var arry = new_data.button;
            if (bmenu == 1) {
                if (arry.length >= 3) {
                    alert("最多可以创建三个一级菜单");
                } else {
                    var arry_oneids = ["1", "2", "3"];
                    for (var j = 0; j < arry.length; j++) {
                        arry_oneids.splice($.inArray(arry[j].id.split("0")[1], arry_oneids), 1);
                    }
                    new_data.button.push({
                        "id": "one0" + arry_oneids[0],
                        "type": "null",
                        "name": menuname,
                        "key": "null",
                        "list": []
                    });
                    new_load_menu(new_data);
                }
            }
            if (bmenu == 2) {
                for (var i = 0; i < arry.length; i++) {
                    if (arry[i].id == menuid) {
                        arry[i].type = "null";
                        arry[i].key = "null";
                        if (arry[i].list.length >= 5) {
                            alert("不能超过五个二级菜单");
                        } else {
                            var arry_twoids = ["1", "2", "3", "4", "5"];
                            for (var j = 0; j < arry[i].list.length; j++) {
                                arry_twoids.splice($.inArray(arry[i].list[j].id.split("0")[1], arry_twoids), 1);
                            }
                            arry[i].list.push({
                                "id": "two0" + arry_twoids[0],
                                "type": menutype,
                                "name": menuname,
                                "key": menucontent
                            })
                            new_load_menu(new_data);
                        }
                    }
                }

            }
            if (bmenu == 0) {
                if (grade == 1) {
                    for (var i = 0; i < arry.length; i++) {
                        if (arry[i].id == menuid) {
                            arry[i].type = menutype;
                            arry[i].name = menuname;
                            arry[i].key = menucontent;
                            arry[i].list = [];
                        }
                    }
                    new_load_menu(new_data);
                } else {
                    var relation_id = $("." + menuid + "").parent().attr("value");
                    for (var i = 0; i < arry.length; i++) {
                        if (arry[i].id == relation_id) {
                            var arry_tow = arry[i].list;
                            for (var i = 0; i < arry_tow.length; i++) {
                                if (arry_tow[i].id == menuid) {
                                    arry_tow[i].type = menutype;
                                    arry_tow[i].name = menuname;
                                    arry_tow[i].key = menucontent;
                                }
                            }
                            new_load_menu(new_data);
                        }
                    }
                }
            }
        }
    }

}

function remove_menu() {
    var arry = new_data.button;
    if (grade == 1) {
        for (var i = 0; i < arry.length; i++) {
            if (arry[i].id == menuid) {
                arry.splice($.inArray(arry[i], arry), 1);
                new_load_menu(new_data);
            }
        }
    } else {
        var relation_id = $("." + menuid + "").parent().attr("value");
        for (var i = 0; i < arry.length; i++) {
            if (arry[i].id == relation_id) {
                var remove_arry = arry[i].list
                for (var j = 0; j < remove_arry.length; j++) {
                    if (remove_arry[j].id == menuid) {
                        remove_arry.splice($.inArray(remove_arry[j], remove_arry), 1);
                        new_load_menu(new_data);

                    }
                }
            }
        }
    }
}

function new_load_menu(data) {
    bRelease_data += 1;
    $(".am-panel-default").remove();
    var $tpl = $('#push_menu');
    var source = $tpl.text();
    var template = Handlebars.compile(source);
    var data = {menus: data.button};
    var html = template(data);
    $tpl.before(html);
    add_event();
}

function add_event() {
    if (bRelease_data != 0) {
        $("#save_data").removeClass("am-disabled");
    }
    $(".view").addClass("am-icon-chain");
    $(".click").addClass("am-icon-wechat");
    $(".menu_btn").hide();
    // $("input[name=docVlGender]:eq(0)").attr("checked", 'checked');
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

function save_data() {
    $('#my-save_data').modal({
        relatedTarget: this,
        onConfirm: function (options) {
            $("#Release").removeClass("am-disabled");
            var query = new AV.Query(menus);
            query.get(cloud_id, {
                success: function (res) {
                    res.set("content", new_data);
                    res.save({
                        success: function () {
                            $(".am-panel-default").remove();
                            load_menu(function (data, id) {
                                cloud_id = id;
                                new_data = data;
                                add_event()
                            });
                        }
                    });
                }
            })
        }
    });
}


function Release_data() {
    $('#my-Release_data').modal({
        relatedTarget: this,
        onConfirm: function (options) {
            var query = new AV.Query(menus);
            query.find({
                success: function (menu) {
                    var menusdata = menu[0].get("content").button;
                    if (menusdata.length != 0) {
                        Release_save_data(menusdata);
                    } else {
                        $('#destroy_data').modal({
                            relatedTarget: this,
                            onConfirm: function (options) {
                                Release_save_data(menusdata);
                            }
                        });
                    }

                }
            })
        }
    });

}
function Release_save_data(menusdata) {
    var button = []
    for (var i = 0; i < menusdata.length; i++) {
        if (menusdata[i].type != "null") {
            var title;
            if (menusdata[i].type == "view") {
                var button_data = {
                    "type": menusdata[i].type,
                    "name": menusdata[i].name,
                    "url": menusdata[i].key
                }
            } else {
                var button_data = {
                    "type": menusdata[i].type,
                    "name": menusdata[i].name,
                    "key": menusdata[i].key
                }
            }

            button.push(button_data);
        } else {
            var relation_data = menusdata[i].list;
            var list_data = [];
            if (relation_data) {
                for (var j = 0; j < relation_data.length; j++) {
                    if (relation_data[j].type == "view") {
                        var list = {
                            "type": relation_data[j].type,
                            "name": relation_data[j].name,
                            "url": relation_data[j].key
                        }
                    } else {
                        var list = {
                            "type": relation_data[j].type,
                            "name": relation_data[j].name,
                            "key": relation_data[j].key
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
    console.log(menu);
    $.ajax({
        method: "POST",
        url: server + "/weixin/publishMenu",
        data: JSON.stringify({
            menu: menu
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            alert("chengg"+data);
        },
        error: function (msg) {
            // alert(msg);
            alert("shibai"+msg);
        }
    });
}
