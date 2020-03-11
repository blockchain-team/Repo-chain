/*var menuId = getUrlParam("id");
var username = store.get("username");
var signature = store.get("signature");
$(function () {
    /!**
     * 加载ACC本币总数
     *!/
    $.ajax({
        url:"/relateme/accSumCount",
        type:"POST",
        data:{
            username: username,
            signature: signature,
        },
        success:function (data) {
            if(data.error_code!=0){

            }
            $("#acc_amount").text(data.data);
        }

    })

    /!**
     * 加载ACC本币总数
     *!/
    $.ajax({
        url:"/relateme/SumCategoryList",
        type:"POST",
        data:{
            username: username,
            signature: signature,

        },
        success:function (data) {
            if(data.error_code!=0){

            }
            var html='';
            $.each(data.data,function (index,item) {
                html+='<tr>' +
                    '<td><img src="img/standard_coin.png"/></td>' +
                    '<td>'+item.category+'</td><td>'+item.categorySum+'</td>' +
                    '<td><a href="transfer_out_assets.html" class="transfer_out_oper">转出</a></td>' +
                    ' </tr>'
            })
            $("#listView").html(html);
        }

    })

})*/



var pageIndex = 1;
var totalPageCount = 1;
var kw="";
var menuId = getUrlParam("id");
var username = store.get("username");
var signature = store.get("signature");
if(!username  || !signature){
    //登录提示
    location="login.html";
}
function getList() {
    $.ajax({
        url:"/relateme/accSumCount",
        type:"POST",
        data:{
            username: username,
            signature: signature,
        },
        success:function (data) {
            if(data.error_code!=0){
                if(data.error_code==35){
                    showAlert("登录超时 请重新登录");
                    goHtml("login.html?lp=asset_owned.html");
                }else {
                    showAlert("加载失败!");
                }
                return ;
            }
            $("#acc_amount").text(data.data);
        }

    })
    $.ajax({
        url:"/relateme/SumCategoryList",
        type:"POST",
        data:{
            username: username,
            signature: signature,

        },
        success:function (data) {
            if(data.error_code!=0){
                if(data.error_code==35){
                    showAlert("登录超时 请重新登录");
                    goHtml("login.html?lp=asset_owned.html");
                }else {
                    showAlert("加载失败!");
                }
                return ;
            }
            var html='';
            $.each(data.data,function (index,item) {
                html+='<tr>' +
                    '<td><img src="'+getImg(item.category)+'"/></td>' +
                    '<td>'+item.category+'</td><td>'+item.categorySum+'</td>' +
                    '<td class="error_page"><a href="javascript:loadAccount();" class="transfer_out_oper">转出</a></td>' +
                    ' </tr>'
            });
            //$("#bCount").html("您当前共有<span style='color:red;'>"+data.totalPageCount+"</span>种代币");
            $("#listView").html(html);
        }

    })
}
//获取账号信息
function loadAccount() {
    /* var username = store.get("username");
     var signature = store.get("signature");*/

    if (username && signature) {
        $.ajax({
            url: "/loadaccount",
            type: 'POST',
            processDate: true,
            data: {
                username: username,
                signature: signature
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 0) {
                    //是否设置安全问题
                    if (data.safetyQuestion != "true") {
                        showPageAlert("转出资产前，请先设置安全问题及交易密码!");
                        $("#toEdit").attr("span-href","safety_problem.html");
                        return;
                    }
                    if(data.setPayPwd!="true"){
                        showPageAlert("转出资产前，请先设置交易密码!");
                        $("#toEdit").attr("span-href","set_trade_pwd.html");
                        return;
                    }
                    location="transfer_out_assets.html";
                }
                else if (data.error_code == 35) {
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=set_trade_pwd.html");
                    return;
                }
            }
        });
    } else {
        showAlert("登录超时 请重新登录!");
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}
function getPage() {
    $(".tcdPageCode").off();
    $(".tcdPageCode").createPage({
        pageCount:totalPageCount,
        current:pageIndex,
        backFn:function(p){
            pageIndex = p;
            getList();
        }
    });
}

function showPageAlert(text){
    $("#error_msg").text(text);
    $(".dialog_init1,.mask").show();
}
function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.mask").show();
}
//通用跳转页面
function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}
$(function () {
    $("#toEdit").on("click",function () {
        location=$(this).attr("span-href");
    })
    $(".error_page").on("click",function () {
        loadAccount();
    })
    getList();
    if(totalPageCount>1){getPage();}
})