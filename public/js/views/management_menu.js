(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    loadmenu(function () {
        var bmenu, menuid, grade;
        $(".views").addClass("am-icon-chain");
        $(".click").addClass("am-icon-wechat");
        $(".menu_btn").hide();
        $("input[name=docVlGender]:eq(0)").attr("checked", 'checked');
        $("input[name=docVlGender]").on("click", function () {
            if ($("input[name='docVlGender']:checked").val() == "null") {
                $(".input_menu_content").attr("disabled", true);
            } else {
                $(".input_menu_content").val("");
                $('.input_menu_content').attr("disabled", false);
            }
        });
        $(".btn_content").mouseout(function () {
            $(this).children().hide();
        }).mousemove(function () {
            $(this).children().show();
        });

        $(".add-menu-btn,.menu_btn,.menu_list,.add_menu_list").on("click", function (event) {
            menuid = $(this).attr("menuid");
            bmenu = $(this).attr("bmenu");
            grade = $(this).attr("grade");
            $('#my-prompt').modal();
            event.stopPropagation();
        });
        $(".save_menu").on("click", function () {

            var menuname = $(".input_menu_name").val();
            var menucontent = $(".input_menu_content").val();
            var menutype = $("input[name='docVlGender']:checked").val();

            if(!menuname){
                alert("请输入菜单名");
            }else{
                if(!menucontent&&menutype!="null"){
                    alert("请输入关系");
                }else{
                    add_menudata(bmenu, menuid,grade,menuname,menucontent,menutype);
                }
            }
        });
        $(".remove_menu").on("click", function () {
            if (bmenu == 0) {
                if (grade == 1) {
                    destroy_menu(menuid, 1);
                }
                if (grade == 2) {
                    destroy_menu(menuid, 2);
                }
            }
        })
    });
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
                    var relationmenu = object.get("relationmenu");
                    var menu = {
                        id: menuid,
                        name: menuname,
                        type: menutype,
                        relation: relationmenu
                    }
                    menus.push(menu);
                }
                var $tpl = $('#push_menu');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {menus: menus};
                var html = template(data);
                $tpl.before(html);
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
                    if (destroy_menus&&destroy_menus.length>0) {
                        alert("shi")
                        for (var i = 0; i < destroy_menus.length; i++) {
                            var query2 = new AV.Query(menus);
                            query2.get(destroy_menus[i],{
                                success:function(res){
                                    res.destroy({
                                        success:function(){
                                            if(i==destroy_menus.length-1){
                                                window.location.reload();
                                            }
                                        }
                                    });
                                }
                            })
                        }
                    }else{
                        alert("fou")
                        destroy_menu.destroy({
                            success:function(){
                                window.location.reload();
                            }
                        });
                    }
                }
            })
        } else {
            var query = new AV.Query(menus);
            query.get(meun_id,{
                success:function(destroy_menu){
                    var relation_menuid = destroy_menu.get("menu_relation").id;
                    var oldresmenu = {
                        id: destroy_menu.id,
                        type: destroy_menu.get("menu_type"),
                        name: destroy_menu.get("menu_name"),
                        content: destroy_menu.get("menu_content")
                    }
                    var query2 = new AV.Query(menus);
                    query2.get(relation_menuid,{
                        success:function(res_menu){
                            res_menu.remove("relationmenu_id", meun_id);
                            res_menu.remove("relationmenu", oldresmenu);
                            res_menu.save({
                                success:function(){
                                    destroy_menu.destroy({
                                        success:function(){
                                            window.location.reload();
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

function add_menudata(bmenu, menuid,grade,menuname,menucontent,menutype){
    var menus = AV.Object.extend("menu");
    var menu = new menus();
    if (bmenu == "1") {
        alert("tianjia1111");
        menu.set("menu_name", menuname);
        menu.set("menu_type", menutype);
        menu.set("menu_content", menucontent);
        menu.set("grade", "1");
        menu.save({
            success: function (res) {
                window.location.reload();
            }
        });
    };
    if (bmenu == "2") {
        alert("tianjia关联" + menuid + "2222");
        var menurelation = new menus();
        menurelation.id = menuid;
        if (menutype == "null") {
            alert("添加二级菜单不允许选择“一级菜单”类型");
        } else {
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
                            resmenu.set("menu_type", "null")
                            resmenu.set("menu_content", "")
                            resmenu.add("relationmenu", newmenu);
                            resmenu.add("relationmenu_id", res.id);
                            resmenu.save({
                                success:function(res){
                                    window.location.reload();
                                }
                            });
                        }
                    });
                }
            })
        }
    }
    if (bmenu == "0") {
        if (grade == "2" && menutype == "null") {
            alert("更改二级菜单时不允许选择“一级菜单”类型")
        } else {
            alert("更改" + menuid + "fdfsfdsf");
            var query = new AV.Query(menus);
            query.get(menuid, {
                success: function (resmenu) {
                    alert(resmenu.get("grade"));

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
                            if(destroy_menu){
                                alert(destroy_menu.length);
                                for(var i = 0; i<destroy_menu.length;i++){
                                    var query = new AV.Query(menus);
                                    query.get(destroy_menu[i],{
                                        success:function(destroy_menu){
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
                                alert("更改二级菜单");
                                var query = new AV.Query(menus);
                                query.get(updata_id, {
                                    success: function (up_resmenu) {
                                        up_resmenu.add("relationmenu", newresmenu);
                                        up_resmenu.save({
                                            success: function (up_resmenu2) {
                                                up_resmenu2.remove("relationmenu", oldresmenu);
                                                up_resmenu2.save({
                                                    success:function(res){
                                                        window.location.reload();
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }else{
                                window.location.reload();
                            }
                        }
                    });
                }
            });
        }
    }
    $(".input_menu_name").val("");
    $(".input_menu_content").val("");
}

})(jQuery);


