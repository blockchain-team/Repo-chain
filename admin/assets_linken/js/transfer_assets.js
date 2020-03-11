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
            showAlert("Please choose the currency type!");
            return;
        }
        if($.trim(address) == ""){
            showAlert("Please enter receiving address!");
            return;
        }
        if(!/^[A-Za-z\d]{33,34}$/.test($.trim(address))){
            showAlert("Incorrect address enter!");
            return;
        }
        if(!/^A/.test($.trim(address))){
            showAlert("Incorrect address enter!");
            return;
        }
        if(!/^[1-9][0-9]*$/.test(amount)){
            showAlert("Amount of transfer out should be integer (more than 0)!");
            return;
        }
        if(amount > parseInt($("#num").text())){
            showAlert("Amount of transfer out cannot be more than available balance!");
            return;
        }
        if(payPwd == ""){
            showAlert("Please enter transaction password!");
            return;
        }
        if(code == ""){
            showAlert("Please enter graph verification code!");
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
                    showAlert("Transfer out succeeded!");
                    goHtml("transfer_out_assets.html");
                }
                else if(data.error_code == 15){
                    showAlert("Account not found!");
                    return;
                }
                else if(data.error_code == 5){
                    showAlert("Verification code error!");
                    $("#img_code").click();
                    return;
                }
                else if(data.error_code == 210){
                    showAlert("Password is not encrypted!");
                    return;
                }
                else if(data.error_code == 16){
                    showAlert("Asset account abnormal!");
                    return;
                }
                else if(data.error_code == 23){
                    showAlert("Insufficient balance!");
                    return;
                }
                else if(data.error_code == 19){
                    showAlert("Transaction password error!");
                    return;
                }
                else if(data.error_code == 30){
                    showAlert("Server exception failure transaction!");
                    return;
                }
                else if(data.error_code == 35){
                    showAlert("Login timeout Please log in again!");
                    goHtml("login.html?lp=transfer_out_assets.html");
                }
                else{
                    showAlert("Unknown mistake operation failed!");
                    return;
                }
            }
        })
    }else{
        showAlert("Please login!");
        goHtml("login.html?lp=transfer_out_assets.html")
    }
}


//获取账户信息
function getAccountInfo(category){
    var signature = store.get("signature");
    var username = store.get("username");

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
                    showAlert("Account not found!");
                    return;
                }
                else if(data.error_code == 16){
                    showAlert("Asset account abnormal!");
                    return;
                }
                else if(data.error_code == 63){
                    showAlert("You haven’t set your security questions !");
                    goHtml("safety_problem.html");
                }
                else if(data.error_code == 20){
                    showAlert("You haven’t set your  transaction password!");
                    goHtml("set_trade_pwd.html");
                }
                else if(data.error_code == 35){
                    showAlert("Login timeout Please log in again!");
                    goHtml("login.html?lp=transfer_out_assets.html");
                    return;
                }
                else{
                    showAlert("Unknown error, failed to acquire data!");
                    return;
                }
            }
        })
    }else{
        showAlert.text("Please login!");
        goHtml("login.html?lp=transfer_out_assets.html")
    }
}


//通用跳转页面
function goHtml(html){
    $(".close_icon").click(function(){
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
                            $("#trans"+item.transaction_id+" .status").text("success");
                            $("#trans"+item.transaction_id+" .status").addClass("green_warn");
                        }
                        else {
                            $("#trans"+item.transaction_id+" .status").text("failure");
                            $("#trans"+item.transaction_id+" .status").addClass("red_warn");
                        }

                    });
                }
                else if(data.error_code == 15){
                    showAlert("Account not found!");
                    return;
                }
                else if(data.error_code == 35){
                    showAlert("Login timeout Please log in again!");
                    goHtml("login.html?lp=transfer_out_assets.html");
                    return;
                }
                else{
                    showAlert("Unknown error, failed to acquire data!");
                    return;
                }
            }
        })
    }else{
        showAlert("Please login!");
        goHtml("login.html?lp=transfer_out_assets.html")
    }
}


function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.mask").show();
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


$(function(){
    //更新图形验证码
    $("#img_code").click(function(){
        var myDate = new Date();
        $(this).attr("src","/user/getImgCode?times="+myDate.getMilliseconds());
    });

    //获取币种余额信息
    var category = $(".transfer_text").text();
    getAccountInfo(category);

    //获取账户转出记录
    getAccTransactions();

    //提交资产转出
    $("#submit").click(function(){
        transfer()
    });

    //加载页码按钮
    if(totalPageCount > 1){
        getPageButton();
    }

    //切换显示币种余额
    $(".transfer_category").click(function(){
        getAccountInfo($(this).text());
    });
})