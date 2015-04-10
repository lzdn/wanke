
(function($) {
    var shopid=window.location.search.split('?')[1];
    //alert(shopid);
loading();



    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var shop = AV.Object.extend("shop");
        var query = new AV.Query(shop);
        query.equalTo("objectId",shopid);
        query.find({
            success: function (arry) {
                var shops = [];
                    var object = arry[0];
                console.log(object);
                    shopid =object.id;
                    shopname = object.get("shopname");
                    shoptel = object.get("shoptel");
                    shopaddress = object.get("shopaddress");
                    servicetime = object.get("servicetime");
                    shopservice = object.get("shopservice");
                    range = object.get("range");
                    var shop = {
                        id:shopid,
                        name: shopname,
                        tel: shoptel,
                        address:shopaddress,
                        time:servicetime,
                        service:shopservice,
                        range:range
                    };
                    shops.push(shop);
                var $tpl = $('#shopcontent');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {shops: shops};
                var html = template(data);
                $tpl.before(html);
                //callbak();
            }
        });
    }


})(jQuery);