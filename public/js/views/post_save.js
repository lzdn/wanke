/**
 * Created by amberglasses on 15/3/24.
 */
    $(function(){
        var aNav=document.getElementsByClassName("am-btn-extend");
           //console.log(aNav.length);
          for(var i=0;i<aNav.length;i++){
                 aNav[i].onclick=function(){
                     console.log(aNav.length);
                    for(var j=0;j<aNav.length;j++){
                        aNav[j].className="am-btn-extend am-btn am-btn-link";
                    }
                     this.className="am-btn-extend am-btn am-btn-primary am-round"
                 }
             }
        var userValues = $("#doc-ta-1").val();
        $("#doc-ta-1").keydown(function(){
              var aUserval =$("#doc-ta-1").val();
              var oMaxleg=0;
            if(aUserval.length>140){
                oMaxleg=140-aUserval.length;
                $("#usr-say-leg").html("<p>"+oMaxleg+"</p>");
                console.log(aUserval.length);
            }else{
                $("#usr-say-leg").html("<p>"+aUserval.length+"/140</p>");
                console.log(aUserval.length);
            }
            if($("#doc-ta-1").val()!=""){
                $("#usr-sbm").removeClass("am-disabled");
            }else{
                $("#usr-sbm").addClass("am-disabled");
            }
        });

        $("#usr-sbm").on("click",function(){
            $("#modal-confirm").modal({
                //relatedTarget: this,
                onConfirm: function() {
                    alert('aa');
                },
                onCancel: function() {
                    alert('bb');
                }
            });
        });

        $("").get(url,{},function(data){

    },json)

 });



