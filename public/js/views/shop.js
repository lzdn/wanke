(function ($) {

    loading(function(){
        $(".shopcontent").on("click",function(){
            var shopid=$(this).attr("value");
            window.location.href="shopcontent.html?"+shopid+"";
        });
    });

    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var shop = AV.Object.extend("shop");
        var query = new AV.Query(shop);
        query.find({
            success: function (arry) {
                console.log(arry);
                var shops = [];
                for (var i = 0; i < arry.length; i++) {
                    var object = arry[i];
                    shopid =object.id;
                    shopname = object.get("shopname");
                    shoptel = object.get("shoptel");
                    var shop = {
                        id:shopid,
                        name: shopname,
                        tel: shoptel
                    };
                    shops.push(shop);
                    console.log(shops);
                }
                var $tpl = $('#shop');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {shops: shops};
                var html = template(data);
                $tpl.before(html);
                callbak();
            }
        });
    }


})(jQuery);


