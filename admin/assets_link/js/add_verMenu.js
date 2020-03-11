var menuStr = '';
//我的账户分类
menuStr += '<p class="leftMenu_tit clearfix"><em class="iconfont fl">&#58999</em><span class="fl">我的账户</span></p>';
//我的账户分类一
menuStr += '<a href="account_view.html"><li class="leftMenu_tit_item">账户总览</li></a>';
//我的账户分类二
//menuStr += '<a href="purchase_coin.html"><li class="leftMenu_tit_item">购买普银</li></a>';
//我的账户分类三
//menuStr += '<a href="ico_acc_record.html "><li class="leftMenu_tit_item">ICO记录</li></a>';
//我的账户分类四
menuStr += '<a href="asset_owned.html"><li class="leftMenu_tit_item">持有资产</li></a>';
//我的账户分类六
menuStr += '<a href="personal_data.html"><li class="leftMenu_tit_item">个人资料</li></a>';
//我的账户分类七
/*menuStr += '<a href="system_msg.html"><li class="leftMenu_tit_item">系统消息</li></a>';*/

//我的账户分类终止

//资产管理分类
menuStr += '<p class="leftMenu_tit clearfix"><em class="iconfont fl">&#58924</em><span class="fl">资产管理</span></p >';
//资产管理分类一
menuStr += '<a href="transfer_out_assets.html "><li class="leftMenu_tit_item">转出资产</li></a>';
//资产管理分类二
menuStr += '<a href="trans_out_record.html"><li class="leftMenu_tit_item">转出记录</li></a>';
//资产管理分类三
menuStr += '<a href="ico_return.html"><li class="leftMenu_tit_item">PEB退回</li></a>';
//资产管理分类终止



//安全中心分类
menuStr += '<p class="leftMenu_tit clearfix"><em class="iconfont fl">&#59010</em><span class="fl">安全中心</span></p>';
//安全中心分类一
menuStr += '<a href="email_auth.html"><li class="leftMenu_tit_item">邮箱认证</li></a>';
//安全中心分类二
menuStr += '<a href="phone_auth.html"><li class="leftMenu_tit_item">手机认证</li></a>';
//安全中心分类三
menuStr += '<a href="safety_problem.html"><li class="leftMenu_tit_item">安全问题</li></a>';
//安全中心分类四
menuStr += '<a href="set_trade_pwd.html "><li class="leftMenu_tit_item">交易密码</li></a>';
//安全中心分类五
menuStr += '<a href="change_login_pwd.html "><li class="leftMenu_tit_item">修改登录密码</li></a>';
//安全中心分类终止



$verMenu = $(menuStr);
$(".verMenu").append($verMenu);
var link_title = $(".link_menu").text();
$(".leftMenu_tit_item").filter(":contains('"+link_title+"')").addClass("appendAfter appendBefore light_blue");
$(".verMenu li").mousemove(function(){
	$(this).addClass("appendAfter appendBefore light_blue");
});
$(".verMenu li").mouseleave(function(){
	$(this).removeClass("appendAfter appendBefore light_blue");
	$(".leftMenu_tit_item").filter(":contains('"+link_title+"')").addClass("appendAfter appendBefore light_blue");
});
$("a.mine").addClass("active")