/**
 * Created by amberglasses on 15/3/24.
 */
    $(function(){
       // AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");


        var aNav=document.getElementsByClassName("am-btn-extend");
        for(var i=0;i<aNav.length;i++){
            aNav[i].onclick=function(){
                for(var j=0;j<aNav.length;j++){
                    aNav[j].className="am-btn-extend am-btn am-btn-link am-round";
                }
                this.className="am-btn-extend am-btn am-btn-primary am-round";
            }
        }
        $("#usr-sbm").css({color:"rgba(68,68,68,3)"});
        $("#doc-ta-1").keydown(function(){
            setTimeout(function(){
                var aUserval =$("#doc-ta-1").val();
                if(aUserval.length>140){
                    $(".usr-say-leg-2").html("<p>"+aUserval.length+"</p>").addClass("maxlegcss");
                }else{
                    $(".usr-say-leg-2").html("<p>"+aUserval.length+"</p>").removeClass("maxlegcss");
                }
                if($("#doc-ta-1").val()!=""){
                    $("#usr-sbm").removeClass("am-disabled").css({color:"#ff8200"});
                }else{
                    $("#usr-sbm").addClass("am-disabled").css({color:"rgba(68,68,68,3)"});
                }
            },100);
        });
        $("#usr-sbm").on("click",function(){
            var aUserval2=$("#doc-ta-1").val();
            if(aUserval2.length>140){
                //alert("haha");
                $("#my-alert").modal();
            }else{
                $("#modal-confirm").modal({
                    //relatedTarget: this,
                    onConfirm: function() {
                        alert('准备上传');
                    },
                    onCancel: function() {
                    }
                });
            }
        });
        $("#addimg").hide();
        var bShow= true;
        $("#smimg").on("click",function(){
            if(bShow){
                $("#addimg").show();
            }else{
                $("#addimg").hide();
            }
            bShow=!bShow;
        });
        $("#addimg").on("click",function(){
<<<<<<< HEAD
            //$("<div class=\"imgnav\" ><img src=\"#\" alt=\"#\"/></div>").prependTo("#imgwall");
             alert("haha");
            wx.chooseImage({
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                }
            })

=======
            $("<div class=\"imgnav\" ><img src=\"#\" alt=\"#\"/></div>").prependTo("#imgwall");
>>>>>>> origin/master
        });


    //    $("").get(url,{},function(data){
    //
    //},json)

         //……………………………………数据库操作……………………………………………
        //function wx_get_token() {
        //    $token = S('access_token');
        //    if (!$token) {
        //        $res = file_get_contents('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='wxf44ff09e67caaad3'&secret='3c****************************0c');
        //        $res = json_decode($res, true);
        //        $token = $res['access_token'];
        //
        //        // 注意：这里需要将获取到的token缓存起来（或写到数据库中）
        //        // 不能频繁的访问https://api.weixin.qq.com/cgi-bin/token，每日有次数限制
        //        // 通过此接口返回的token的有效期目前为2小时。令牌失效后，JS-SDK也就不能用了。
        //        // 因此，这里将token值缓存1小时，比2小时小。缓存失效后，再从接口获取新的token，这样
        //        // 就可以避免token失效。
        //        // S()是ThinkPhp的缓存函数，如果使用的是不ThinkPhp框架，可以使用你的缓存函数，或使用数据库来保存。
        //
        //        S('access_token', $token, 3600);
        //    }
        //    return $token;
        //}




        //var TestObject = AV.Object.extend("TestObject");
        //var testObject = new TestObject();
        //testObject.save({foo: "bar"}, {
        //    success: function(object) {
        //       // alert("LeanCloud works!");
        //    }
        //});







    });



