
var css=function(t,s){
    s=document.createElement('style');
    s.innerText=t;
    document.body.appendChild(s);
};

document.onclick=function(){
    css('form:before{content:\'修改一下\'}');
};
