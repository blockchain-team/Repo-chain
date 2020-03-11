//转出资产
var totalPageCount = 1;
var pageIndex = 1;



//提币
function transfer(){
    var signature = store.get("signature");
    var username = store.get("username");

    if(username != "" && signature != "" && username != undefined && signature != undefined){
        var address = $("#transfer_address").val();
        var amount = $("#transfer_amount").val();
        var payPwd = $("#pay_pwd").val();
        var code = $("#code").val();
        var category = $(".transfer_text").text();
        var message = $("#message").val();

        if(category == ""){
            showAlert("请选择币种类型!");
            return;
        }
        if($.trim(address) == ""){
            showAlert("请输入转出地址!");
            return;
        }
        if(!/^[A-Za-z\d]{33,34}$/.test($.trim(address))){
            showAlert("地址输入有误!");
            return;
        }
        if(!/^A/.test($.trim(address))){
            showAlert("地址输入有误!");
            return;
        }
        if(!/^[1-9][0-9]*$/.test(amount)){
            showAlert("转出数量需为大于零的整数!");
            return;
        }
        if(amount > parseInt($("#num").text())){
            showAlert("转出数量不可大于可用数量!");
            return;
        }
        if(payPwd == ""){
            showAlert("请输入交易密码!");
            return;
        }
        if(code == ""){
            showAlert("请输入图形验证码!");
            return;
        }

        $.ajax({
            type: "post",
            url: "/user/transferAcc",
            processDate: true,
            async : false,
            data: {
                username : username,
                signature : signature,
                address : $.trim(address),
                amount : amount,
                payPwd : $.md5(payPwd),
                code : code,
                category : category,
                message : message
            },
            dataType: 'json',
            success: function(data) {
                if(data.error_code == 0){
                    showAlert("转出成功!");
                    goHtml("transfer_out_assets.html");
                }
                else if(data.error_code == 15){
                    showAlert("用户不存在!");
                }
                else if(data.error_code == 5){
                    showAlert("验证码错误!");
                    $("#img_code").click();
                }
                else if(data.error_code == 210){
                    showAlert("密码未加密!");
                }
                else if(data.error_code == 16){
                    showAlert("资产账户异常!");
                }
                else if(data.error_code == 23){
                    showAlert("资产账户余额不足!");
                }
                else if(data.error_code == 19){
                    showAlert("交易密码错误!");
                }
                else if(data.error_code == 30){
                    showAlert("服务器异常 转出失败!");
                }
                else if(data.error_code == 51){
                    showAlert("参数异常 币种类型不存在!");
                }
                else if(data.error_code == 35){
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=transfer_out_assets.html");
                }
                else{
                    showAlert("未知错误 操作失败!");
                }
            }
        })
    }else{
        showAlert("请登录!");
        goHtml("login.html?lp=transfer_out_assets.html")
    }
}


//获取账户信息
function getAccountInfo(category){
    var signature = store.get("signature");
    var username = store.get("username");
    console.log(1);
    if(username != "" && signature != "" && username != undefined && signature != undefined){
        $.ajax({
            type: "post",
            url: "/user/getAccountInfo",
            processDate: true,
            data: {
                username : username,
                signature : signature,
                category : category
            },
            dataType: 'json',
            success: function(data) {
                if(data.error_code == 0){
                    $("#num").text(data.accounts_release);
                }
                else if(data.error_code == 15){
                    showAlert("账号不存在!");
                    return;
                }
                else if(data.error_code == 16){
                    showAlert("资产账号异常!");
                    return;
                }
                //sd
                else if(data.error_code == 63){
                    showAlert("转出资产前，请先设置安全问题及交易密码!");
                    goHtml("safety_problem.html");
                }
                else if(data.error_code == 20){
                    showAlert("转出资产前，请先设置交易密码!");
                    goHtml("set_trade_pwd.html");
                }
                else if(data.error_code == 35){
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=transfer_out_assets.html");
                    return;
                }
                else{
                    showAlert("未知错误 数据获取失败!");
                    return;
                }
            }
        })
    }else{
        showAlert("请登录!");
        goHtml("login.html?lp=transfer_out_assets.html")
    }
}


//通用跳转页面
function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}


//获取提币记录
function getAccTransactions(){
    var signature = store.get("signature");
    var username = store.get("username");

    if(username != "" && signature != "" && username != undefined && signature != undefined){
        $.ajax({
            type: "post",
            url: "/user/getACCtransferLog",
            processDate: true,
            async : false,
            data: {
                username : username,
                signature : signature,
                pageIndex : pageIndex
            },
            dataType: 'json',
            success: function(data) {
                if(data.error_code == 0){
                    totalPageCount = data.totalPageCount;
                    var transactions = data.transactionVos;

                    $(".trans").remove();
                    $.each(transactions,function(i,item){
                        var transaction = $('<tr class=trans id=trans'+item.transaction_id+'><td>'+item.create_time+'</td><td>'+item.category+'</td><td>'+item.transaction_id+'</td><td>'+item.amount+'</td><td><span class="status"></span></td></tr>');
                        $("#acc_transactions").append(transaction);

                        if(item.success == "true"){
                            $("#trans"+item.transaction_id+" .status").text("成功");
                            $("#trans"+item.transaction_id+" .status").addClass("green_warn");
                        }
                        else {
                            $("#trans"+item.transaction_id+" .status").text("失败");
                            $("#trans"+item.transaction_id+" .status").addClass("red_warn");
                        }

                    });
                }
                else if(data.error_code == 15){
                    showAlert("账号不存在!");
                    return;
                }
                else if(data.error_code == 35){
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=transfer_out_assets.html");
                    return;
                }
                else{
                    showAlert("未知错误 数据获取失败!");
                    return;
                }
            }
        })
    }else{
        showAlert("请登录!");
        goHtml("login.html?lp=transfer_out_assets.html")
    }
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
              getAccTransactions();
          }
      });
}


function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.mask").show();
}


$(function(){

    $("#img_code").click(function(){

        var myDate = new Date();
        $(this).attr("src","/user/getImgCode?times="+myDate.getMilliseconds());
    });

    //获取币种账户余额
    var category = $(".transfer_text").text();
    getAccountInfo(category);

    //获取账户转出记录
    getAccTransactions();

    //提交转出
    $("#submit").click(function(){
        transfer()
    });

    //加载分页按钮
    if(totalPageCount > 1){
        getPageButton();
    }


    //切换显示币种余额
    $(".transfer_category").click(function(){
        getAccountInfo($(this).text());
    });
})