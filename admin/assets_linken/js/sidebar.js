var sidebar = '';
//我的账户分类
sidebar += '<div class="icon_item qq_group_control"><img src="img/qq1.png"></a><div class="icon_txt"></div><div class="qq_group_show"><span>QQ Group：</span><br /><span class="qq_num">583857260</span><div class="qq_group_triangle"></div></div></div>';
sidebar += '<div class="icon_item wechat_control"><img src="img/weix1.png"><div class="wechat_show"><img src="img/qrcode_wechat.png" alt="" class="qrcode_wechat"/><div class="show_txt">ACChain</div><div class="show_txt"> WeChat public number</div><div class="wechat_triangle"></div></div></div>';
sidebar += '<div class="icon_item weibo_control"><img src="img/weibo1.png"><div class="weibo_show"><img src="img/silde_weibo_code.png" alt="" class="down_code"/><div class="show_txt">ACChain Weibo</div><div class="show_txt">Weibo public</div><div class="weibo_triangle"></div></div></div>';
sidebar += '<div class="icon_item APP_control"><div class="icon_txt">APP</div><div class="APP_show"><img src="img/silde_app_code.png" alt="" class="down_code"/><div class="show_txt">ACC Wallet</div><div class="APP_triangle"></div></div></div>';
sidebar += '<div class="icon_item twitter_control"><div class="icon_txt"><a href="https://twitter.com/ACCHAIN_" target="_blank"><img src="img/twitter1.png"></a></div></div>';
sidebar += '<div class="icon_item f_control"><div class="icon_txt"><a href="https://www.facebook.com/acchain.org/" target="_blank"><img src="img/f.png"></a></div></div>';
sidebar += '<div class="icon_item back_to_top"><img src="img/back_top.png"></div>';
$verMenu = $(sidebar);
$(".sidebar").append($verMenu);

//悬浮弹框
function showHidden(str){
	$("."+str+"_control").mouseover(function(){
	$("."+str+"_show").show();
	});
	$("."+str+"_control").mouseout(function(){
		$("."+str+"_show").hide();
	});
}

showHidden("qq_group");
showHidden("wechat");
showHidden("weibo");
showHidden("APP");

//返回顶部
$(".back_to_top").click(function(){
	$("html,body").animate({
 		scrollTop:0
 	},1000);
});