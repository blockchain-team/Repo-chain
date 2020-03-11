var menuStr = '';
//个人中心分类一
menuStr += '<a href="personal_info.html"><li>My profile</li></a>';
//个人中心分类二
//menuStr += '<a href="my_assets.html"><li>My assets</li></a>';
//个人中心分类三
menuStr += '<a href="transfer_assets.html"><li>Transfer-out asset</li></a>';
//个人中心分类四
menuStr += '<a href="ico_record.html"><li>ICO records</li></a>';
//个人中心分类五
menuStr += '<a href="change_password.html"><li>Reset password</li></a>';
//个人中心分类六
menuStr += '<a href="trade_password.html"><li>Transaction password</li></a>';

$verMenu_lev2 = $(menuStr);
$(".verMenu_lev2").append($verMenu_lev2);

//获取当前页面名 
var strUrl=window.location.href;
var arrUrl=strUrl.split("/");
var strPage=arrUrl[arrUrl.length-1];
var currentInd = 0;
//nav显示
//var navArr = ["personal_info.html","my_assets","transfer_assets","ico_record.html","change_password.html","trade_password.html"];
var navArr = ["personal_info.html","transfer_assets.html","ico_record.html","change_password.html","trade_password.html"];
for (var i=0;i<navArr.length;i++) {
	if(strPage == navArr[i]){
		$(".verMenu_lev2 a li").removeClass("active").eq(i).addClass("active");
		currentInd = i;
	}
}
if(strPage == 'acc_ico.html'){
	$(".verMenu_lev2 a li").removeClass("active").eq(1).addClass("active");
}