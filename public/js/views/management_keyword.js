/**
 * Created by Administrator on 2015/5/14.
 */
AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
var least_height=document.documentElement.clientHeight-217;
$(".least_height").css({"height":""+least_height+""});
var Keyword = AV.Object.extend("keyword");
var keyword_id, key, word, keyword_model;

var cookie=$.AMUI.utils.cookie;
var useremail_cookie =cookie.get("wankeloginuseremail");
var userpwd_cookie =cookie.get("wankeloginuserpwd");
if(!useremail_cookie||!userpwd_cookie){
    window.location.href= server + '/management_login.html?Jumpurl=management_keyword.html';
}else{
    load();
}
//window.onload = function () {
//    load();
//};

function load() {
    keyword_id = document.getElementById('hd_keyword_id');
    key = document.getElementById('lbl_key');
    word = document.getElementById('lbl_word');
    keyword_model = $('#keyword-modal');

    $('td').remove();
    var query = new AV.Query(Keyword);
    query.equalTo("isMenuKey",false);
    query.find({
        success: function (results) {
            console.log(results)
            var keywords = new Array();
            for (var x = 0; x < results.length; x++) {
                var keyword = {
                    id: '',
                    key: '',
                    word: ''
                };

                keyword.id = results[x].id;
                keyword.key = results[x].get('key');
                keyword.word = results[x].get('word');

                keywords.push(keyword);
                console.log(keyword);
            }

            var $tpl = $('#keywords');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {keywords: keywords};
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
        keyword.set('isMenuKey', false);
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
    if(id==0){
        keyword_id.value = "";
        key.value = "";
        word.value ="";
        keyword_model.modal('open');
    }else{
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
}
function remove_list(){
    keyword_id.value = "";
    key.value ="";
    word.value ="";
}