/**
 * Created by amberglasses on 15/3/24.
 */
    $(function(){
        //var aNav=document.getElementsByClassName("am-btn-idx");
        //  for(var i=0;i<aNav.length;i++){
        //         aNav[i].onclick=function(){
        //            for(var j=0;j<aNav.length;j++){
        //                aNav[j].className="am-btn-idx am-btn";
        //            }
        //             this.className="am-btn-idx am-btn selectbtn";
        //         }
        //     }

        var aNav=document.getElementsByClassName("am-btn-extend");
        for(var i=0;i<aNav.length;i++){
            aNav[i].onclick=function(){
                 fontLength(i);
        }
            function fontLength(idx){
                for(var j=0;j<aNav.length;j++){
                    aNav[j].className="am-btn-extend am-btn am-btn-link am-round";
                }
                aNav[idx].className="am-btn-extend am-btn am-btn-primary am-round";
            }
            }
        }

        $("#doc-ta-1").keydown(function(){
              var aUserval =$("#doc-ta-1").val();
            //alert(aUserval.length);
           if(aUserval.length>140){
                $(".usr-say-leg-2").html("<p>"+aUserval.length+"</p>").addClass("maxlegcss");
            }else{
                $(".usr-say-leg-2").html("<p>"+aUserval.length+"</p>").removeClass("maxlegcss");
            }
            if($("#doc-ta-1").val()!=""){
                $("#usr-sbm").removeClass("am-disabled");
            }else{
                $("#usr-sbm").addClass("am-disabled");
            }
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

    //    $("").get(url,{},function(data){
    //
    //},json)

 });



