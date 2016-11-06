
var css=function(t,s){
    s=document.createElement('style');
    s.innerText=t;
    document.body.appendChild(s);
};

$("#submit").click(function(){
    $.ajax({
        url:'login_admin.php',
        type:"POST",
        data:$('#form').serialize(),
        success: function(data) {
           css('form:before{content:\''+data+'\'}');
        }
    });
});


// var a = "用户名和密码不能为空！";

// document.onclick=function(){
//     if (!($("[type='text']").val() && $("[type='password']").val())) {
//     	css('form:before{content:\''+a+'\'}');
//     }
// };

