/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height=document.documentElement.clientHeight-217;
$(".least_height").css({"height":""+least_height+""});
var Shop = AV.Object.extend("shop");
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
    Shop_id = document.getElementById('hd_keyword_id');
    shop_name = document.getElementById('lbl_key');                 //名称
    shop_title = $("#lbl_logo");                                    //类型
    shop_service = document.getElementById('lbl_shopservice');      //描述
    shop_address = document.getElementById('lbl_shopaddress');      //地址
    service_time = document.getElementById('lbl_servicetime');      //时间
    shop_range = document.getElementById('lbl_range');              //范围
    shop_tel = document.getElementById('shop_tel');                 //联系电话
    shop_type = $("#lbl_type ");                                    //隶属

    $('td').remove();
    var query = new AV.Query(Shop);
    query.find({
        success: function (results) {
            var shops = new Array();
            for (var x = 0; x < results.length; x++) {
                var shop = {
                    id: '',
                    shopname: '',
                    logo: '',
                    shopservice: '',
                    shopaddress: '',
                    servicetime: '',
                    range: '',
                    type: '',
                    tel: ''
                };
                shop.id = results[x].id;
                shop.shopname = results[x].get('shopname');
                shop.logo = results[x].get('logo');
                shop.shopservice = results[x].get('shopservice');
                shop.shopaddress = results[x].get('shopaddress');
                shop.servicetime = results[x].get('servicetime');
                shop.range = results[x].get('range');
                shop.type = results[x].get('type');
                shop.tel = results[x].get('shoptel');
                shops.push(shop);
                console.log(shop);
            }

            var $tpl = $('#shops');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {shops: shops};
            var html = template(data);
            $tpl.before(html);
        },
        error: function (error) {

        }
    })
}

function save() {
    if (Judge_menu == null) {
        var new_shop = new Shop();
        new_shop.set('shopname', shop_name.value);
        new_shop.set('shopservice', shop_service.value);
        new_shop.set('shopaddress', shop_address.value);
        new_shop.set('servicetime', service_time.value);
        new_shop.set('range', shop_range.value);
        new_shop.set('shoptel', parseInt(shop_tel.value));
        new_shop.set('logo', $("#lbl_logo").val());
        new_shop.set('type', $("#lbl_type ").val());
        new_shop.save(null, {
            success: function (shop) {
                load();
            },
            error: function (keyword, error) {
                console.log(error);
            }
        })
    } else {
        var query = new AV.Query(Shop);
        query.get(Judge_menu, {
            success: function (up_shop) {
                up_shop.set('shopname', shop_name.value);
                up_shop.set('shopservice', shop_service.value);
                up_shop.set('shopaddress', shop_address.value);
                up_shop.set('servicetime', service_time.value);
                up_shop.set('range', shop_range.value);
                up_shop.set('shoptel', parseInt(shop_tel.value));
                up_shop.set('logo', $("#lbl_logo").val());
                up_shop.set('type', $("#lbl_type ").val());
                up_shop.save(null, {
                    success: function (resshop) {
                        load();
                    }
                })
            }
        })
    }
}

function del(id) {
    var query = new AV.Query(Shop);
    query.get(id, {
        success: function (del_shop) {
            del_shop.destroy({
                success: function (result) {
                    load();
                }
            });
        }
    })
}

function edit(id) {
    var query = new AV.Query(Shop);
    query.get(id, {
        success: function (resshop) {
            shop_name.value = resshop.get('shopname');
            shop_service.value = resshop.get('shopservice');
            shop_address.value = resshop.get('shopaddress');
            service_time.value = resshop.get('servicetime');
            shop_range.value = resshop.get('range');
            shop_tel.value = resshop.get('shoptel');
            $("#lbl_logo option[value=\"" + resshop.get('logo') + "\"]").attr("selected", "selected");
            $("#lbl_type option[value=\"" + resshop.get('type') + "\"]").attr("selected", "selected");
            var form_input = $(".form_input");
            for (var i = 0; i < form_input.length; i++) {
                if (form_input[i].value=="undefined") {
                    form_input[i].value = ""
                }
            }
        }
    })
}

function Judge(menuid) {
    Judge_menu = menuid;
}
function remove_list(){
    var form_input = $(".form_input");
    for (var i = 0; i < form_input.length; i++) {
            form_input[i].value = ""
    }
}