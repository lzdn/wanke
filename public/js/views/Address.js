(function($) {
       var homeval
    loading(function(){
        $("#doc-select-1").on("click",function(){
            //alert("haha");
            console.log($(this).val());
            var home = AV.Object.extend("home");
            var query2= new AV.Query(home);
            query2.equalTo("objectId",$(this).val());
            query2.find({
                success:function(results){
                    console.log(results);
                    var oldbuilding = results[0].get("building");
                    var buildings=[];
                    for(var j=0; j<oldbuilding.length; j++){
                        var building ={
                            nemes:oldbuilding[i]
                        }
                        buildings.push(building);
                    }
                    console.log(buildings);

                    var $tpl2 = $('buildings');
                    var source2 = $tpl2.text();
                    var template2 = Handlebars.compile(source2);
                    var data2 = {buildings: buildings};
                    var html2 = template2(data2);
                    $tpl2.before(html2);
                }
            })
        })
    });








    function loading (callbak){
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var home = AV.Object.extend("home");
        var query= new AV.Query(home);
        query.find({
            success:function(res){
                homeval=res[0].id;
                var homes= [];
                for(var i=0 ; i<res.length; i++){
                    var object = res[i];
                    console.log(object);
                    var homename = object.get("homename");
                    var homeid=object.id;
                    building=object.get("building");
                    var home = {
                        name:homename,
                        id:homeid
                    }
                    homes.push(home);
                }
                var $tpl = $('#homes');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {homes: homes};
                var html = template(data);
                $tpl.before(html);
                callbak();
            }
        });

       //……………… 此处添加用户 暂时无用………………
        //var array = ['小圆1号','小圆2号','小圆3号','小圆4号','小圆5号'];
        //var homes= new home();
        //homes.set("building",array);
        //homes.save({
        //    success:function(aa){
        //        console.log(aa);
        //    }
        //});

    }








})(jQuery);



