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
header += '<div class="margin clearfix">';
header += '<a href="index.html" class="logo fl"><img src="img/white_logo.png" alt="logo"/></a>';
header += '<div class="fr menu">';
header += '<a href="index.html" class="index_page">Home</a><a href="digital_asset.html" class="ico_public">Digital Asset</a><a href="assets_link.html" class="asset_link">ACChain</a><a href="/forum/index.html" target="_blank" class="block_datas">Community</a><a href="newspaper.html" class="news">News</a><a href="https://market.acchain.org" class="market_page"  target="_blank">Market</a><a href="account_view.html" class="mine">Account</a>';
header += '</div>';
header += '</div>';

var language_choose = ' <div class="language_choose"><div class="language_box"><p class="language_text"><img src="img/flag_usa.png" alt=""/></p><em class="down_icon"></em><ul id="language_gather" style="display: none;"><li class="language_option"><a href="'+ href +'"><img src="img/flag_china.png" alt="" /></a></li></ul></div></div>';
$language_choose = $(language_choose);
$header = $(header);
$("header").append($header);
//获取当前页面名
var strUrl=window.location.href;
var arrUrl=strUrl.split("/");
var strPage=arrUrl[arrUrl.length-1];
var navArr = ["index.html","digital_asset.html","assets_link.html","newspaper.html","account_view.html","account_details.html"];
var navArr2 = ["account_view.html","acc_ico.html","asset_owned.html","change_login_pwd.html","email_auth.html","ico_acc_record.html","safety_problem.html","set_trade_pwd.html","transfer_out_assets.html","change_login_pwd.html"];
var navArr3 = ["asset_publish_1.html","asset_publish_2.html","asset_publish_3.html"];
for (var i=0;i<navArr.length;i++) {
    if(strPage == navArr[i]){       
        $("header a").removeClass("active").eq(i).addClass("active");
        currentInd = i;     
    }
};
for (var i=0;i<navArr2.length;i++) {
    if(strPage == navArr2[i]){       
        $("header a").removeClass("active").eq(7).addClass("active");
        currentInd = i;     
    }
};
for (var i=0;i<navArr3.length;i++) {
    if(strPage == navArr3[i]){       
        $("header a").removeClass("active").eq(2).addClass("active");  
    }
};
//底部
var footer = '';
footer += '<div class="margin">';
footer += '<p class="clearfix"><img src="img/bot_logo.png" alt="" class="fl"><span class="fl">Copyright 2017-2019 | ACChain .all rights reserved</span></p>';
footer += '</div>';

$footer = $(footer);
$("footer").append($footer);
//语言选择	
function hideSel(selector){
	if($(selector).css("display")){
		$(window).click(function(){
			$(selector).hide();
		});
	}
};
$(".language_text,.language_choose .down_icon").click(function(ev){
	var ev=ev||window.event;
    ev.preventDefault();    
    ev.stopPropagation();        
    ev.returnValue=false;	
	$("#language_gather").show();
	$(".language_choose .language_option").click(function(){
		$(".language_choose .language_text").html($(this).html());
		$("#language_gather").hide();		
	})
	hideSel("#language_gather");
});	