AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
   var menus = AV.Object.extend("newmenu");
var  cloud_id,bmenu, menuid, grade, menu,old_data,new_data;
var bRelease_data = 0;
load_menu(function(data,id){
    cloud_id=id;
    new_data=data;
    add_event()
});
//var menudata = {
//        "button": [
//        {
//            "id":"one01",
//            "type": "click",
//            "name": "今日歌曲",
//            "key": "V1001_TODAY_MUSIC",
//            "list":[]
//        },
//        {
//            "id":"one02",
//            "name": "孙爽",
//            "type":"null",
//            "key":"null",
//            "list": [
//                    {
//                        "id":"two01",
//                        "type": "view",
//                        "name": "搜索",
//                        "key": "http://www.soso.com/"
//                    },
//                    {
//                        "id":"two02",
//                        "type": "view",
//                        "name": "视频",
//                        "key": "http://v.qq.com/"
//                    },
//                    {
//                        "id":"two03",
//                        "type": "click",
//                        "name": "赞一下我们",
//                        "key": "V1001_GOOD"
//                    }
//                ]
//        },{
//                "id":"one03",
//        "type": "view",
//        "name": "易生活",
//        "key": "http://fuwuhao.dianyingren.com/shop_index.html",
//                "list":[]
//    }
//    ]
//};
//var menu= new menus();
//menu.set("content",menudata);
//menu.save();
function load_menu(callbak){
    var query = new AV.Query(menus);
    query.find({
        success:function(res){
            old_data=res[0].get("content");
            var $tpl = $('#push_menu');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {menus: old_data.button};
            var html = template(data);
            $tpl.before(html);
            //menu_one_length = res.length;
            callbak(old_data,res[0].id);
        }
    })
}


function upmodal(event, menuids, bmenus, grades){
    var arry = new_data.button;
    console.log(menuids+"dfsd"+bmenus+"dsfds"+grades);
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
             if(grades=="1"){
                 for(var i=0;i<arry.length;i++){
                     if(arry[i].id==menuid){
                         $(".input_menu_name").val("" +arry[i].name+ "");
                         if(arry[i].key!="null"){
                             $(".input_menu_content").val("" +arry[i].key+ "");
                         }else{
                             $(".input_menu_content").val("");
                         }

                         if(arry[i].type=="view"){
                             $('input[name=docVlGender]').get(1).checked = true;
                             $("#input_menu_type").html("跳转链接：");
                         }else{
                             $('input[name=docVlGender]').get(0).checked = true;
                             $("#input_menu_type").html("发送文字：");
                         }
                     }
                 }
             }else{
                 var relation_id=$("."+menuid+"").parent().attr("value");
                 for(var i=0;i<arry.length;i++){
                     if(arry[i].id==relation_id){
                         var relation_arry=arry[i].list;
                         for(var j=0;j<relation_arry.length;j++){
                             if(relation_arry[j].id==menuid){
                                 $(".input_menu_name").val("" +relation_arry[j].name+ "");
                                 if(relation_arry[j].key!="null"){
                                     $(".input_menu_content").val("" +relation_arry[j].key+ "");
                                 }else{
                                     $(".input_menu_content").val("");
                                 }

                                 if(relation_arry[j].type=="view"){
                                     $('input[name=docVlGender]').get(1).checked = true;
                                     $("#input_menu_type").html("跳转链接：");
                                 }else{
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
        $(".am-modal-bd").html("添加菜单");
    } else {
        $(".am-modal-bd").html("编辑菜单");
        $("#return_btn").removeClass("am-modal-btn");
        $("#delete_btn").addClass("am-modal-btn");
    }

    $('#my-prompt').modal();
    event.stopPropagation();
}

function save_menu(){
    var menuname = $(".input_menu_name").val();
    var menucontent = $(".input_menu_content").val();
    var menutype = $("input[name='docVlGender']:checked").val();
    if(!menuname){
        alert("请输入菜单名称");
    }else{
        if(!menucontent){
            alert("请输入关联");
        }else{
            var  arry = new_data.button;
            if(bmenu==1){
                if(arry.length>=3){
                    alert("最多可以创建三个一级菜单");
                }else{
                    var arry_oneids=["1","2","3"];
                    for(var j=0;j<arry.length;j++){
                        arry_oneids.splice($.inArray(arry[j].id.split("0")[1],arry_oneids),1);
                    }
                    new_data.button.push({
                        "id":"one0"+arry_oneids[0],
                        "type": menutype,
                        "name": menuname,
                        "key": menucontent,
                        "list":[]
                    });
                    new_load_menu(new_data);
                }
            }
            if(bmenu==2){
                for(var i=0;i<arry.length;i++){
                    if(arry[i].id==menuid){
                        arry[i].type="null";
                        arry[i].key="null";
                        if(arry[i].list.length>=5){
                            alert("不能超过五个二级菜单");
                        }else{
                            var arry_twoids=["1","2","3","4","5"];
                            for(var j=0;j<arry[i].list.length;j++){
                                arry_twoids.splice($.inArray(arry[i].list[j].id.split("0")[1],arry_twoids),1);
                            }
                            arry[i].list.push({
                                "id":"two0"+arry_twoids[0],
                                "type": menutype,
                                "name": menuname,
                                "key": menucontent
                            })
                            new_load_menu(new_data);
                        }
                    }
                }

            }
            if(bmenu==0){
                if(grade==1){
                    for(var i=0;i<arry.length;i++){
                        if(arry[i].id==menuid){
                            arry[i].type=menutype;
                            arry[i].name=menuname;
                            arry[i].key=menucontent;
                            arry[i].list=[];
                        }
                    }
                    new_load_menu(new_data);
                }else{
                    var relation_id=$("."+menuid+"").parent().attr("value");
                    for(var i=0;i<arry.length;i++){
                        if(arry[i].id==relation_id){
                            var arry_tow=arry[i].list;
                            for(var i=0;i<arry_tow.length;i++){
                                if(arry_tow[i].id==menuid){
                                    arry_tow[i].type=menutype;
                                    arry_tow[i].name=menuname;
                                    arry_tow[i].key=menucontent;
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

function remove_menu(){
    var  arry = new_data.button;
    if(grade==1){
        for(var i=0;i<arry.length;i++){
            if(arry[i].id==menuid){
                arry.splice($.inArray(arry[i],arry),1);
                new_load_menu(new_data);
            }
        }
    }else{
        var relation_id=$("."+menuid+"").parent().attr("value");
        for(var i=0;i<arry.length;i++){
            if(arry[i].id==relation_id){
                var remove_arry=arry[i].list
                for(var j=0;j<remove_arry.length;j++){
                    if(remove_arry[j].id==menuid){
                        remove_arry.splice($.inArray(remove_arry[j],remove_arry),1);
                        new_load_menu(new_data);

                    }
                }
            }
        }
    }
}

function new_load_menu(data){
    bRelease_data+=1;
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
    if(bRelease_data!=0){
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

function save_data(){
    $("#Release").removeClass("am-disabled");
}

function Release_data(){
    var query = new AV.Query(menus);
    query.find({
        success:function(menu){
            console.log(menu[0].get("content"));
            var menusdata=menu[0].get("content")

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

        }
    })
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

