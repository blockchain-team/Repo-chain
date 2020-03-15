//ICO超额退币
var username = store.get("username");
var signature = store.get("signature");
var totalPageCount = 0;
var pageIndex = 1;

//获取用户退币记录
function getUserRefunds() {
    if(username == "" || username == undefined || signature == "" || signature == undefined){
        window.location.href = "login.html?lp=ico_return.html";
    }

    $.ajax({
        type: "post",
        url: "/user/getUserRefundList",
        async : false,
        processDate: true,
        data: {
            pageIndex : pageIndex,
            username : username,
            signature : signature
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                $("#total_Refund").text(data.refund);
                var refundLogList = data.refundLogList;
                totalPageCount = data.totalPageCount;

                $(".refund").remove();
                $.each($.parseJSON(refundLogList),function(i,item){
                    var transaction = $('<tr class="refund"><td>'+item.transaction_time+'</td><td>'+item.currency+'</td><td>'+item.transaction_value+'</td><td>'+item.to_addr+'</td><td>成功</td></tr>');
                    $("#ico_record").append(transaction);
                });
            }
            else if(data.error_code == 35){
                $("#alert_info").text("登录超时 请重新登录!");
                $("#dialog_init").show();
                $(".mask").show();
                goHtml("login.html?lp=ico_return.html");
            }
            else{
                $("#alert_info").text("参数错误 数据获取失败!");
                $("#dialog_init").show();
                $(".mask").show();
            }
        }
    });
}


function refundIco() {
    var amount = $("#amount").val();
    var address = $("#address").val();
    var payPwd = $("#pay_Pwd").val();

    if(amount == "" || amount == 0){
        $("#alert_info").text("请输入退币数量!");
        $("#dialog_init,.mask").show();
        return;
    }
    if(amount > parseFloat($("#total_Refund").text())){
        $("#alert_info").text("退币数量不可大于可退数量!");
        $("#dialog_init,.mask").show();
        return;
    }
    //if(!/^(([1-9]+)|([0-9]+\.[0-9]{1,3}))$/.test(amount)){
    if(!/^\d+(\.\d{1,3})?$/.test(amount)){
        $("#alert_info").text("退币数量输入有误!");
        $("#dialog_init,.mask").show();
        return;
    }
    if(address == ""){
        $("#alert_info").text("地址不可为空!");
        $("#dialog_init,.mask").show();
        return;
    }
    if (address.indexOf(" ")>0) {
        $("#alert_info").text("地址不能包含空格!");
        $("#dialog_init,.mask").show();
        return;
    }
    if(address.length != 34){
        $("#alert_info").text("地址输入有误请输入正确的PEB地址!");
        $("#dialog_init,.mask").show();
        return;
    }
    if(payPwd == ""){
        $("#alert_info").text("请输入交易密码!");
        $("#dialog_init,.mask").show();
        return;
    }

    $(".waiting_circle_dialog,.mask").show();
    $.ajax({
        type: "post",
        url: "/user/refundIco",
        processDate: true,
        data: {
            username : username,
            signature : signature,
            amount : amount,
            address : address,
            payPwd : $.md5(payPwd)
        },
        dataType: 'json',
        success: function(data) {
            $(".waiting_circle_dialog").hide();
            if(data.error_code == 0){
                $("#alert_info").text("操作成功!");
                $("#dialog_init,.mask").show();
                goHtml("ico_return.html");
            }
            else if(data.error_code == 20){
                $("#alert_info").text("未设置交易密码请设置!");
                $("#dialog_init,.mask").show();
                goHtml("set_trade_pwd.html");
            }
            else if(data.error_code == 19){
                $("#alert_info").text("交易密码错误!");
                $("#dialog_init,.mask").show();
            }
            else if(data.error_code == 23){
                $("#alert_info").text("交易密码错误!");
                $("#dialog_init,.mask").show();
            }
            else if(data.error_code == 35){
                $("#alert_info").text("登录超时 请重新登录!");
                $("#dialog_init,.mask").show();
                goHtml("login.html?lp=ico_return.html");
            }
            else{
                $("#alert_info").text("未知异常操作失败!");
                $("#dialog_init,.mask").show();
            }
        }
    });
}


//加载页码按钮
function getPageButton(){
    $(".order_pages").text("");
    $(".order_pages").append("<div class='tcdPageCode'></div>");
    //绑定页码按钮点击事件
    $(".tcdPageCode").createPage({
        pageCount:totalPageCount,
        current:pageIndex,
        backFn:function(p){
            pageIndex = p;
            getUserRefunds();
        }
    });
}


function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}

$(function () {
    getUserRefunds();
    if(totalPageCount > 1){
        getPageButton();
    }

    $(".return_submit").click(function () {
        refundIco();
    });
});