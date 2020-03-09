function getLanguage() {
    var url = document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);
    var paths = relUrl.split("/");
    return paths[1];
}

var url = document.location.toString();
var arrUrl = url.split("//");
start = arrUrl[1].indexOf("/");
var current = arrUrl[1].substring(start);
var href = arrUrl[1].substring(start);
if(getLanguage() == "en"){
    var enurl = document.location.toString();
    var enarrUrl = enurl.split("//");
    enstart = enarrUrl[1].lastIndexOf("/");
    var enhref = enarrUrl[1].substring(enstart);
    href = enhref;
}else {
    href = "/en" + href;
}
//头部条
var header = '';
header += '<div class="header_par1">';                                      
header += '<div class="margin clearfix relative">'; 
header += '<div class="fl"><i class="iconfont">&#58914;</i><span>1-518-474-5766</span>&nbsp;&nbsp;Call Us&nbsp;<em>24/7</em></div>';
                                                          
header += '<div class="fr relative">'; 
header += '<div class="language_box"><i class="iconfont">&#59646;</i><span class="language_text">English</span><i class="iconfont down_icon">&#58907;</i><ul id="language_gather" class="language_gather" style="display: none;"><li class="language_option"><a href="/en/index.html">chinese</a></li></ul></div>';                                      
header += '<span class="hide_part"><a href="">Our Mission</a><a href="">Charity</a></span><input type="text" name="" class="search_input" style="display:none;"><i class="iconfont amplify">&#59050;</i>'; 
header += '</div></div></div>';                                      
header += '<div class="header_par2">'; 
header += '<div class="margin clearfix">';                                      
header += '<a href="index.html" class="logo fl"><img src="img/logo.png" alt="logo"></a>'; 
header += '<div class="fr"><a href="index.html" class="active">首页</a><a href="about_us.html">关于</a><a href="application.html">应用</a><a href="news.html">新闻</a><a href="contact_us.html">联系</a><span href="">咨询我们</span></div>';                                      
header += '</div></div>';                                       
header += '<div class="header_par3"><div class="margin clearfix"><dl class="fl"><dt>联系我们</dt><dd>Contact us</dd></dl><div class="location fr"><a href="index.html">首页</a><em>></em><span>联系我们</span></div></div></div> '; 
// <a href="">产业</a>
$header = $(header);
$("header").append($header);

//获取当前页面名
var strUrl=window.location.href;
var arrUrl=strUrl.split("/");
var strPage=arrUrl[arrUrl.length-1];
var navArr = ["index.html","about_us.html","application.html","news.html","contact_us.html"];
for (var i=0;i<navArr.length;i++) {
    if(strPage == navArr[i]){       
        $(".header_par2 .fr a").removeClass("active").eq(i).addClass("active");
        currentInd = i;     
    }
    if(strPage == navArr[0]){
        $(".header_par3").hide();
    }
    if(strPage == navArr[1]){
        var pageName = $(".header_par2 .fr a").eq(1).html();
        $(".header_par3 dt,.location span").html(pageName);
        $(".header_par3 dd").html('ABOUT US');
    }
    if(strPage == navArr[2]){
        var pageName = $(".header_par2 .fr a").eq(2).html();
        $(".header_par3 dt,.location span").html(pageName);
        $(".header_par3 dd").html('CHANGJINGYINGYONG');
    }
    if(strPage == navArr[3]){
        var pageName = $(".header_par2 .fr a").eq(3).html();
        $(".header_par3 dt,.location span").html(pageName);
        $(".header_par3 dd").html('NEWS INFORMATION');
    }
    if(strPage == navArr[4]){
        var pageName = $(".header_par2 .fr a").eq(4).html();
        $(".header_par3 dt,.location span").html(pageName);
        $(".header_par3 dd").html('CONTACT US');
    }
};
//底部
var footer = '';

                
                    
                    
                    
                    
                
                
                    
                    
                        
                        
                        
                        
                    
footer += '<div class="margin relative">';
footer += '<ol><dt class="button linear_background_color">产业状况</dt>';
footer += '<dd class="clearfix"><a href="javascript:void(0);"><img src="img/Image01.png" class="fl"/></a><div class="fr"><p class="title"><a href="javascript:void(0);">文化区块产业链能够实现长线发展</a></p><p class="time">November 8, 201</p></div></dd>';
footer += '<dd class="clearfix"><a href="javascript:void(0);"><img src="img/Image02.png" class="fl" alt=""/></a><div class="fr"><p class="title"><a href="javascript:void(0);">文化链国际集团公司将进行市值重估</a></p><p class="time">November 8, 2017</p></div></dd>';
footer += '<dd class="clearfix mb40"><a href="javascript:void(0);"><img src="img/Image03.png" class="fl" alt=""/></a><div class="fr"><p class="title"><a href="javascript:void(0);">上市公司加码布局文化链国际集团</a></p><p class="time">November 8, 2017</p></div></dd>';
footer += '<dd class="clearfix relative"><input type="text" placeholder="Email address" class="fl"/><img src="img/email_icon.png" class="email_icon" alt=""/><span class="fr button linear_background_color">发送邮件</span></dd>';
footer += '</ol>';
footer += '<div class="ft_contact">';
footer += '<div class="text"><h3>CONTACT US</h3><p class="font-size24">联系我们</p><p class="font-size18">深度解析时代所需，剖析客户所需，首次提出符合自身发展的“融合理论”，即通过对接、合作甚至是融合的方式，将两项或以上的优质资源融汇贯通，从而发挥出1+1>2的力量</p></div>';
footer += '<ul class="link">';
footer += '<li class="clearfix"><p class="fl"><img src="img/ft_adress.png" alt="adress"/></p><div class="fl"><p>地址</p><p>London, England</p></div></li>';
footer += '<li class="clearfix"><p class="fl"><img src="img/ft_eamil.png" alt="eamil"/></p><div class="fl"><p>邮箱</p><p>info@CVC+.com</p></div></li>';
footer += '<li class="clearfix"><p class="fl"><img src="img/ft_phone.png" alt="phone"/></p><div class="fl"><p>电话</p><p>00442037691522</p></div></li>';
footer += '<li class="clearfix"><a href="javascript:void(0);"><i class="iconfont">&#58884;</i></a><a href="javascript:void(0);"><i class="iconfont">&#58912;</i></a><a href="javascript:void(0);"><i class="iconfont">&#59106;</i></a></li>';
footer += '</ul></div></div>';
$footer = $(footer);
$("footer").append($footer);
//语言选择  
function hideSel(selector){
    if($(selector).css("display")){
        $(window).click(function(){
            $(selector).hide();
            $(".hide_part").show(); 
        });
    }
};
// $(".language_text,.down_icon").click(function(ev){
//     var ev=ev||window.event;
//     ev.preventDefault();    
//     ev.stopPropagation();        
//     ev.returnValue=false;   
//     $("#language_gather").show();
//     $(".language_option").click(function(){
//         $(".language_text").html($(this).html());
//         $("#language_gather").hide();       
//     })
//     hideSel("#language_gather");
// }); 
$(".header_par1 .amplify").click(function(ev){
    var ev=ev||window.event;
    ev.preventDefault();    
    ev.stopPropagation();        
    ev.returnValue=false;
    $(".search_input").show();  
    hideSel(".search_input");
})