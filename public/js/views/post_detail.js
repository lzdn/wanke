
(function($) {
    var postview=window.location.search.split('?')[1];
    alert(postview);
    $(".users").on("click",function(){
        window.location.href="users.html?sss";
    });
    thread_url= "http://localhost:63342/wanke/public/post_detail.html?55223dcfe4b0cd5b62664791";
    thread_key= postview;
    thread_title = 'post_detail';
    console.log( thread_url);
    console.log(thread_key);
    console.log(thread_title);
    $("<div id=\"ds-thread\" class=\"ds-thread\" data-thread-key=postview+\"\" data-title=\"post_detail\" data-url=\"http://localhost:63342/wanke/public/post_detail.html?55223dcfe4b0cd5b62664791\"></div>"
    ).prependTo("#thread");

    AV.initialize("f7r02mj6nyjeocgqv7psbb31mxy2hdt22zp2mcyckpkz7ll8", "blq4yetdf0ygukc7fgfogp3npz33s2t2cjm8l5mns5gf9w3z");
    //ject.createWithoutData('className',id);
    var post = AV.Object.extend("post");
    var tags = AV.Object.extend("tags");
    var user = AV.Object.extend("User");
    var query = new AV.Query(post);
    query.include("tagkey");
    query.include("username");
    query.equalTo("objectId",postview);
    query.find({
        success:function(results){
            var times=0;
            var newtime = new Date().getTime();
            var tags = [];
            var object = results[0];
            console.log(results[0]);
            var content = object.get('content');
            var  imgs =  object.get('imgs');
            console.log(imgs);
            var otagkey=object.get("tagkey");
            var ousername =object.get("username");
            var username = ousername.get("username");
            var tagvalue=otagkey.get("tagtitle");
            var oldtime= object.createdAt.getTime();
            var publishtime = newtime - oldtime;
            var day = parseInt(publishtime/86400000);
            if(day>0){
                times = day+"天"
            }else{
                var hours = parseInt(publishtime/3600000);
                if(hours>0){
                    times= hours+"小时";
                }
                else{
                    var minute = parseInt(publishtime/60000);
                    if(minute>0){
                        times=minute+"分钟"
                    }
                }
            }
            // var tagvalue = object.get('tagkey');
            var imge    = object.get('imgs')
            var opost = {
                name: username,
                usersay:content,
                tag: tagvalue,
                time:times
                //img: imge
            };
            tags.push(opost);
            console.log(opost.name);
            console.log(opost.usersay);
            console.log(opost.tag);
            console.log(opost.time);

            var $tpl = $('#amz-tags');
            var source = $tpl.text();
            var template = Handlebars.compile(source);
            var data = {tags: tags};
            var html = template(data);
            $tpl.before(html);
        }
    });

})(jQuery);