/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var Shop = AV.Object.extend("shop");
var keyword_id, key, word, keyword_model;

window.onload = function () {
    load();
};

function load() {
    keyword_id = document.getElementById('hd_keyword_id');
    key = document.getElementById('lbl_key');
    word = document.getElementById('lbl_word');
    keyword_model = $('#keyword-modal');

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
                    range: ''
                };

                shop.id = results[x].id;
                shop.shopname = results[x].get('shopname');
                shop.logo = results[x].get('logo');
                shop.shopservice = results[x].get('shopservice');
                shop.shopaddress = results[x].get('shopaddress');
                shop.servicetime = results[x].get('servicetime');
                shop.range = results[x].get('range');

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
        var keyword = new Keyword();
        keyword.set('key', key.value);
        keyword.set('word', word.value);
        keyword.save(null, {
            success: function (keyword) {
                console.log(keyword);
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
        var query = new AV.Query(Keyword);
        query.get(keyword_id.value, {
            success: function (keyword) {
                keyword.set('key', key.value);
                keyword.set('word', word.value);
                keyword.save(null, {
                    success: function (keyword) {
                        console.log(keyword);
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
    var query = new AV.Query(Keyword);
    query.get(id, {
        success: function (keyword) {
            keyword_id.value = keyword.id;
            key.value = keyword.get('key');
            word.value = keyword.get('word');
            keyword_model.modal('open');
        },
        error: function () {

        }
    })
}