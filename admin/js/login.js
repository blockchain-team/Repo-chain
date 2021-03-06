//ico登录
var isTure = false;//判断是否点击
function login() {
    var login_username = $(".login_username").val();
    var login_password = $(".input_paw").val();

    if ($.trim(login_username) == "") {
        $("#alert_info").text("请输入账户名称!");
        $(".dialog_init").show();
        $(".common_mask").show();
        return;
    }
    if ($.trim(login_password) == "") {
        $("#alert_info").text("请输入登录密码!");
        $(".dialog_init").show();
        $(".common_mask").show();
        return;
    }

    login_password = $.md5($.trim(login_password));
    $.ajax({
        url: "/login",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            username: login_username,
            password: login_password
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 10) {
                $("#alert_info").text("登录密码错误,请填写正确的登录密码!");
                $(".dialog_init").show();
                $(".common_mask").show();
                return;
            } else if (data.error_code == 35) {
                $("#alert_info").text("登录超时,请重新登录!");
                $(".dialog_init").show();
                $(".common_mask").show();
                window.location.href = "login.html";
            } else if (data.error_code == 55) {
                $("#alert_info").text("用户名不存在,请确认!");
                $(".dialog_init").show();
                $(".common_mask").show();
                return;
            } else {
                store.clear();
                store.set("username", data.username);
                store.set("signature", data.signature);
                var url = getUrlParam("lp");
                if (url == null || url == "undefined" || url == "") {
                    if(isTure){
                        window.location.href = "ico.html";
                    }else {
                        window.location.href = "account_view.html";
                    }
                } else {
                    window.location.href = url;
                }
            }
        }
    });
}

$(document).keydown(function (event) {
    if (event.keyCode == 13 && $('.dialog_log').css("display") != 'none') {
        $(".btn").click();
    }
});

$(".close_icon").click(function () {
    $(".dialog_init,.common_mask").hide();
});

$(".login_username,.input_paw,.login_username").val("");
//点击我的判断用户是否登录
$(".mine").unbind("click").on("click", function () {
    $.ajax({
        url: "/safeLogincontroller",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            username: store.get("username"),
            signature: store.get("signature")
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                location.href = "account_view.html";
            } else {
                location.href = "login.html";
            }
        }
    });
});
//点击参与ICO判断用户是否登录
 $(".attend").unbind("click").on("click", function () {
     isTure = true;
     if (store.get("username") == undefined || store.get("signature") == undefined) {
         $(".dialog_log,.mask").show();
     } else {
         $.ajax({
             url: "/safeLogincontroller",
             type: 'POST',
             processDate: true,
             data: {
                 username: store.get("username"),
                 signature: store.get("signature")
             },
             dataType: 'json',
             success: function (data) {
                 if (data.error_code == 0) {
                     location.href = "ico.html";
                 } else if (data.error_code == 35) {
                     $(".dialog_log,.mask").show();
                 }
             }
         });
     }
 });

$(function () {
    $(".btn").unbind("click").on("click", function () {
        login();
    });
});
