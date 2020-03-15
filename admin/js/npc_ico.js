
var username = store.get("username");
var signature = store.get("signature");

//获取用户参与RET地址
function getUserIcoAddress(){
    $.ajax({
        type: "post",
        url: "/user/createUserIcoInfo",
        processDate: true,
        data: {
            username : username,
            signature : signature,
            category : "NPC"
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                $("#btc_join").attr("data-login","true");
                $("#eth_join").attr("data-login","true");
                $("#acc_join").attr("data-login","true");
                $("#peb_join").attr("data-login","true");
                $("#btc_join").attr("data-value",data.BTCAddress);
                $("#eth_join").attr("data-value",data.ETHAddress);
                $("#acc_join").attr("data-value",data.ACCAddress);
                $("#peb_join").attr("data-value",data.PEBAddress);
                $("#go_ico_user").attr("href","acc_ico.html?id="+data.userId+"&category=NPC");
            }
        }
    });
}


//获取ICO数据状态
function getIcoInfo(){
    $.ajax({
        type: "post",
        url: "/user/getHistoryIcoInfo",
        processDate: true,
        data: {
            username : username,
            signature : signature,
            category : "NPC",
            endTime : "2017-07-23 18:00:00",
            startTime : "2017-07-18 17:00:00"
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                if(!data.status){
                    $("#btc_join").text("已结束");
                    $("#eth_join").text("已结束");
                    $("#acc_join").text("已结束");
                    $("#peb_join").text("已结束");
                    $(".involve_rightnow").css({
                        background: "#ccc",
                        cursor: "not-allowed",
                        color: "#fff",
                        borderColor: "#fff"
                    }).unbind("click");
                }
                $("#totleAmount").text(toThousands(data.tokenAmount));
                $("#totalTokenAmount").text(toThousands(data.tokenAmount));
                $("#totleCount").text(data.totalJoinCount);
                $("#btcJoinCount").text(data.btcJoinCount);
                $("#ethJoinCount").text(data.etcJoinCount);
                $("#accJoinCount").text(data.accJoinCount);
                $("#pebJoinCount").text(data.pebJoinCount);
            }
            else if(data.error_code == 35){
                showAlert("登录超时 请重新登录");
                goHtml("login.html?lp=ret_ico.html");
            }
            else{
                showAlert("服务器异常 数据获取失败");
            }
        }
    });
}


//登录
function login(){
    var username = $("#username").val();
    var password = $("#password").val();
    if(username == ""){
        showAlert("请输入用户名!");
        $(".dialog_init_mask").show();
        closeInit();
        return;
    }
    if(password == ""){
        showAlert("请输入密码!");
        $(".dialog_init_mask").show();
        closeInit();
        return;
    }

    $.ajax({
        type: "post",
        url: "/login",
        processDate: true,
        data: {
            username : username,
            password : $.md5(password)
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                store.clear();
                store.set("signature", data.signature);
                store.set("username", data.username);
                window.location.reload();
            }
            else{
                showAlert("账号或密码有误 请重新输入!");
                $(".dialog_init_mask").show();
                closeInit();
            }
        }
    });
}


//通用跳转页面
function goHtml(html){
    $(".close_icon").click(function(){
        window.location.href = html;
    });
}

//通用提示框
function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.mask").show();
}


//关闭中间层蒙版
function closeInit(){
    $(".close_icon").click(function(){
        $(".dialog_init_mask").hide();
        $(".mask").show();
    });
}


//格式化数字(千分符)
function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}


$(function(){
    getUserIcoAddress();
    getIcoInfo();

    $("#eth_join").click(function(){
        if($(this).attr("data-login") == "true" && $(this).attr("data-value") != ""){
            $(".address_dialog").show();
            $(".mask").show();
            $("#address_code").empty();
            $("#currency").text("ETH");
            $("#address_input").val($(this).attr("data-value"));
            new QRCode(document.getElementById("address_code"), $(this).attr("data-value"));
        }else{
            $(".dialog_log,.mask").show();//登录弹窗
        }
    });
    $("#btc_join").click(function(){
        if($(this).attr("data-login") == "true" && $(this).attr("data-value") != ""){
            $(".address_dialog").show();
            $(".mask").show();
            $("#address_code").empty();
            $("#currency").text("BTC");
            $("#address_input").val($(this).attr("data-value"));
            new QRCode(document.getElementById("address_code"), $(this).attr("data-value"));
        }else{
            $(".dialog_log,.mask").show();//登录弹窗
        }
    });
    $("#acc_join").click(function(){
        if($(this).attr("data-login") == "true" && $(this).attr("data-value") != ""){
            $(".address_dialog").show();
            $(".mask").show();
            $("#address_code").empty();
            $("#currency").text("ACC");
            $("#address_input").val($(this).attr("data-value"));
            new QRCode(document.getElementById("address_code"), $(this).attr("data-value"));
        }else{
            $(".dialog_log,.mask").show();//登录弹窗
        }
    });

    $("#peb_join").click(function(){
        if($(this).attr("data-login") == "true" && $(this).attr("data-value") != ""){
            $(".address_dialog").show();
            $(".mask").show();
            $("#address_code").empty();
            $("#currency").text("PEB");
            $("#address_input").val($(this).attr("data-value"));
            new QRCode(document.getElementById("address_code"), $(this).attr("data-value"));
        }else{
            $(".dialog_log,.mask").show();//登录弹窗
        }
    });

    //点击登录
    $("#login").click(function(){
        login();
    });


    $(document).keydown(function (event) {
        if (event.keyCode == 13 && $('.dialog_log').css("display") != 'none') {
            $("#login").click();
        }
    });
})



