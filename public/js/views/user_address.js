(function ($) {
    var postview = window.location.search.split('?')[1];
    loading(function () {
        var buliding;
        var homeval;
        $("#haederleft").on("click",function(){
            window.location.href= "user_detail.html?"+postview+"";
        });
        $("#doc-select-1").change(function () {
            if(homeval!=$(this).val()){
                homeval=$(this).val();
                $(".homeval").remove();
                var home = AV.Object.extend("home");
                var query2 = new AV.Query(home);
                query2.equalTo("objectId", $(this).val());
                query2.find({
                    success: function (results) {
                        var oldbuilding = results[0].get("building");
                        var buildings = [];
                        for (var j = 0; j < oldbuilding.length; j++) {
                            var building = {
                                names: oldbuilding[j]
                            }
                            buildings.push(building);
                        }
                        var $buildings = $('#buildings');
                        var source2 =$buildings.text();
                        var template2 = Handlebars.compile(source2);
                        var data2 = {buildings: buildings};
                        var html2 = template2(data2);
                        $buildings.before(html2);
                    }
                })
            }

        })

        $("#usr-sbm-sub").on("click",function(){
            var home = AV.Object.extend("home");
            var query = new AV.Query(home);
            query.equalTo("objectId", $("#doc-select-1").val());
            query.find({
                success: function (results) {
                    buliding= results[0].get("homename");
                    var floorname=$("#doc-select-2").val();
                    var housenumber=$("#wxnum").val();
                    var query = new AV.Query(AV.User);
                    query.get(postview, {
                        success: function(user) {
                            user.set('buliding', buliding);
                            user.set('floorname', floorname);
                            user.set('housenumber', housenumber);
                            user.save().then(function(){
                                window.location.href= "user_detail.html?"+postview+"";
                            });
                        },
                        error: function(object, error) {
                            console.log(object);
                            // The object was not retrieved successfully.
                            // error is a AV.Error with an error code and description.
                        }
                    });
                }
            })

        })
    });
    function loading(callbak) {
        AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
        //ject.createWithoutData('className',id);
        var home = AV.Object.extend("home");
        var query = new AV.Query(home);
        query.find({
            success: function (res) {
                homeval = res[0].id;
                var homes = [];
                for (var i = 0; i < res.length; i++) {
                    var object = res[i];
                    console.log(object);
                    var homename = object.get("homename");
                    var homeid = object.id;
                    building = object.get("building");
                    var home = {
                        name: homename,
                        id: homeid
                    }
                    homes.push(home);
                }
                var $tpl = $('#homes');
                var source = $tpl.text();
                var template = Handlebars.compile(source);
                var data = {homes: homes};
                var html = template(data);
                $tpl.before(html);

                var home = AV.Object.extend("home");
                var query2 = new AV.Query(home);
                query2.equalTo("objectId",homeval);
                query2.find({
                    success: function (results) {
                        console.log(results);
                        var oldbuilding = results[0].get("building");
                        console.log(oldbuilding);
                        var buildings = [];
                        for (var j = 0; j < oldbuilding.length; j++) {
                            var building = {
                                names: oldbuilding[j]
                            }
                            buildings.push(building);
                        }
                        var $buildings = $('#buildings');
                        var source2 =$buildings.text();
                        var template2 = Handlebars.compile(source2);
                        var data2 = {buildings: buildings};
                        var html2 = template2(data2);
                        $buildings.before(html2);
                    }
                })
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


