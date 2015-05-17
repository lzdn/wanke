/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var Shop = AV.Object.extend("shop");
var Shop_id, shop_name, shop_title, shop_service,shop_address,service_time,shop_range,shop_type,shop_tel;


window.onload = function () {
    load();
};

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
                    type:'',
                    tel:''
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
    console.log(keyword_id.value);
    if (keyword_id.value == null || keyword_id.value == '') {
        console.log('id为空');
        var keyword = new Shop();
        keyword.set('key', Shop.value);
        keyword.set('word', Shop.value);
        keyword.save(null, {
            success: function (shop) {
                console.log(shop);
                console.log('---------------------');
                keyword_model.modal('close');
                load();
            },
            error: function (keyword, error) {
                console.log(error);
            }
        })
    } else {
        console.log('id不为空');
        var query = new AV.Query(Shop);
        query.get(keyword_id.value, {
            success: function (shop) {
                shop.set('key', key.value);
                shop.set('word', word.value);
                shop.save(null, {
                    success: function (resshop) {
                        console.log(resshop);
                        keyword_model.modal('close');
                        load();
                    },
                    error: function () {

                    }
                })
            },
            error: function () {

            }
        })
    }
}

function del(id) {
    console.log('delete_id:' + id);
    var query = new AV.Query(Keyword);
    query.get(id, {
        success: function (keyword) {
            keyword.destroy({
                success: function (result) {
                    load();
                },
                error: function (result, error) {

                }
            });
        },
        error: function () {

        }
    })
}

function edit(id) {
    alert(id)
    var query = new AV.Query(Shop);
    query.get(id, {
        success: function (resshop) {
            //Shop_id, shop_name, shop_title, shop_service,shop_address,service_time,shop_range,shop_type
            Shop_id.value = resshop.id;
            shop_name.value = resshop.get('shopname');
            shop_service.value= resshop.get('shopservice');
           // $("#lbl_logo option[value=\""+resshop.get('word')+"\"]").attr("selected", "selected");
            shop_address.value= resshop.get('shopaddress');
            service_time.value= resshop.get('servicetime');
            shop_range.value= resshop.get('range');
            shop_tel.value= resshop.get('shoptel');
            $("#lbl_type option[value=\""+resshop.get('lbl_type')+"\"]").attr("selected", "selected");
        },
        error: function () {

        }
    })
}