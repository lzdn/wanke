(function ($) {
    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    loadmenu(function(){
        var bmenu,menuid,grade;
        $(".views").addClass("am-icon-chain");
        $(".click").addClass("am-icon-wechat");
        $(".menu_btn").hide();
        $("input[name=docVlGender]:eq(0)").attr("checked",'checked');
        $("input[name=docVlGender]").on("click",function(){
            if($("input[name='docVlGender']:checked").val()=="null"){
                $(".input_menu_url").attr("disabled",true);
            }else{
                $(".input_menu_url").val("");
                $('.input_menu_url').attr("disabled",false);
            }
        });
        $(".btn_content").mouseout(function () {
            $(this).children().hide();
        }).mousemove(function () {
            $(this).children().show();
        });

        $(".add-menu-btn,.menu_btn,.menu_list,.add_menu_list").on("click",function(event){
            menuid =$(this).attr("menuid");
            bmenu  =$(this).attr("bmenu");
            grade = $(this).attr("grade");
            $('#my-prompt').modal();
            event.stopPropagation();
        });
        $(".save_menu").on("click",function(){
            var menus = AV.Object.extend("menu");
            var menu = new menus();
            var menuname = $(".input_menu_name").val();
            var menuurl = $(".input_menu_url").val();
            var menutitle=$("input[name='docVlGender']:checked").val();
            if(bmenu=="1"){
                alert("tianjia1111");
                menu.set("menu_name",menuname);
                menu.set("menu_title",menutitle);
                menu.set("menu_url",menuurl);
                menu.set("grade","1");
                menu.save({
                    success:function(res){
                        alert(res);
                    }
                })
            };
            if(bmenu=="2"){
                alert("tianjia关联"+menuid+"2222");
                var menurelation = new menus();
                menurelation.id=menuid;
                if(menutitle=="null"){
                    alert("添加二级菜单不允许选择“一级菜单”类型");
                }else{
                    menu.set("menu_name",menuname);
                    menu.set("menu_title",menutitle);
                    menu.set("menu_url",menuurl);
                    menu.set("grade","2");
                    menu.set("menu_relation",menurelation);
                    menu.save({
                        success:function(res){
                            console.log(res);
                            var newmenu = {
                                id:res.id,
                                title:res.get("menu_title"),
                                name:res.get("menu_name"),
                                url:res.get("menu_url")
                            }
                            var query = new AV.Query(menus);
                            query.get(menuid, {
                                success: function (resmenu) {
                                    resmenu.set("menu_title","null")
                                    resmenu.add("relationmenu",newmenu);
                                    resmenu.add("relationmenu_id",res.id);
                                    resmenu.save();
                                }
                            });
                        }
                    })
                }
            }
           // [{"id":"5555c02ae4b0a343c5c25f07","title":"views","name":"ss","url":"sss"}]
            if(bmenu=="0"){
                if(grade=="2"&&menutitle=="null"){
                    alert("更改二级菜单时不允许选择“一级菜单”类型")
                }else{
                    alert("更改"+menuid+"fdfsfdsf");
                    var query = new AV.Query(menus);
                    query.get(menuid, {
                        success: function (resmenu) {
                            var oldresmenu = {
                                id:resmenu.id,
                                title:resmenu.get("menu_title"),
                                name:resmenu.get("menu_name"),
                                url:resmenu.get("menu_url")
                            }
                            resmenu.set("menu_name",menuname);
                            resmenu.set("menu_title",menutitle);
                            if(menutitle!="null"){
                                resmenu.set("relationmenu",[]);
                            }
                            resmenu.set("menu_url",menuurl);
                            resmenu.save({
                                success:function(newresmenu){
                                    var newresmenu = {
                                        id:newresmenu.id,
                                        title:newresmenu.get("menu_title"),
                                        name:newresmenu.get("menu_name"),
                                        url:newresmenu.get("menu_url")
                                    }
                                }
                            });
                        }
                    });
                }
            }
            $(".input_menu_name").val("");
            $(".input_menu_url").val("");
        });

        $(".remove_menu").on("click",function(){

        })

    });

    function loadmenu(callbak){
        var menus = AV.Object.extend("menu");
        var querymenu = new AV.Query(menus);
        querymenu.equalTo("grade","1");
        querymenu.find({
            success:function(res){
                var menus=[];
                for(var i=0; i<res.length;i++){
                    var object = res[i];
                    var menuid= object.id;
                    var menuname = object.get("menu_name");
                    var menutitle = object.get("menu_title");
                    var relationmenu = object.get("relationmenu");
                    var menu = {
                        id :menuid,
                        name:menuname,
                        title:menutitle,
                        relation:relationmenu
                    }
                    menus.push(menu);
                }
                console.log(menus);
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


})(jQuery);


