var interval = 60;
var url;
var r_reason;
function getMobileCheckCode() {
    //点击之后 不能再点击
    $("#randomImg").attr("disabled", "disabled");
    $("#randomImg").unbind("click");
    $("#randomImg").css("color", "#999");
    $("#randomImg").css("background-color", "#DDD");
    $("#randomImg").val(interval + "秒后重发");
    timer = window.setInterval("msgInterval();", 1000);
}
function canClickSendMobileCode() {
    //请求验证码
    $('#randomImg').unbind("click").bind("click", function () {
        var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
         if ((!$("#username").val().match(regEmail) && !$("#username").val().match(regPhone))) {
             maskShowAlert("邮箱或手机号格式有误，请填写正确的邮箱或手机号!")
             return;
         }
        if ($("#username").val().match(regEmail)) {
            url = "/sendemail";
            r_reason = "register_email";
        }
         if ($("#username").val().match(regPhone)) {
             url = "/sendinformation";
             r_reason = "register";
        }

         //校验账号是否存在
         $.ajax({
             url: "/user/checkUser",
             type: 'POST',
             processDate: true,
             data: {
                 loginName: $("#username").val()
             },
             dataType: 'json',
             success: function (data) {
                 if (data.error_code == 1) {
                     maskShowAlert("参数错误 验证码发送失败!");
                     return;
                 } else if (data.error_code == 0) {
                     maskShowAlert("账号已存在 请登录!");
                     return;
                 }else if(data.error_code == 15){
                    //发送验证码
                    getMobileCheckCode();
                    $.ajax({
                        url: url,
                        type: 'POST',
                        async: false,
                        processDate: true,
                        data: {
                            username: $("#username").val(),
                            random: $("#imgCode").val(),
                            password: $.md5($("#password").val()),
                            confirmpassword: $.md5($("#confirmPwd").val()),
                            r_reason: r_reason,
                            category : "注册"
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.error_code == 1) {
                                maskShowAlert("参数错误,请联系客服处理!");
                                return;
                            } else if (data.error_code == 0) {
                                $(".text").text("");
                                $(".btn").text("");
                                maskShowAlert("验证码发送成功!");
                                return;
                            }
                            else if(data.error_code == 3){
                                maskShowAlert("操作频繁请稍后再试!");
                                return;
                            }
                            else {
                                maskShowAlert("验证码发送失败!");
                                return;
                            }
                        }
                    });
                 }
             }
         });
    });
}
function msgInterval() {
    // 倒计时结束
    if (interval == 0) {
        interval = 60;
        $("#randomImg").removeAttr("disabled");
        $("#randomImg").text("获取验证码");
        $("#randomImg").css("color", "#ffffff");
        $("#randomImg").css("background-color", "#0795D4");
        canClickSendMobileCode();
        window.clearInterval(timer);
    } else {
        $("#randomImg").attr("disabled", "disabled");
        $("#randomImg").unbind("click");
        $("#randomImg").css("color", "#999");
        $("#randomImg").css("background-color", "#DDD");
        if (isNaN(interval) || isNaN(interval - 1)) {
            $("#randomImg").val("获取手机验证码");
        } else {
            interval = interval - 1;
            $("#randomImg").text(interval + "秒后重发");
        }
    }
}

//ico注册
function register() {
    var username = $("#username").val();
    var imgCode = $("#imgCode").val();
    var password = $("#password").val();
    var confirmPwd = $("#confirmPwd").val();
    if(username == ""){
        maskShowAlert("邮箱不能为空!");
        return;
    }
    if(imgCode == ""){
        maskShowAlert("验证码不能为空!");
        return;
    }
    if(password == ""){
        maskShowAlert("设置密码不能为空!");
        return;
    }
    if(confirmPwd == ""){
        maskShowAlert("确认密码不能为空!");
        return;
    }
    if(password != confirmPwd){
        maskShowAlert("设置密码与确认密码一样，请确认!");
        return;
    }
    if ((!password.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/))) {
        maskShowAlert("密码必须包含数字和字母,长度6-12位!");
        return;
    }
    $.ajax({
        url: "/register",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            username: $("#username").val(),
            random: $("#imgCode").val(),
            password: $.md5($("#password").val()),
            confirmpassword: $.md5($("#confirmPwd").val())
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == "validate") {
                maskShowAlert(data.message);
                return;
            } else if (data.error_code == 1) {
                maskShowAlert("参数有误,请联系客服处理!");
                return;
            } else if (data.error_code == 5) {
                maskShowAlert("错误的随机验证码，请填写正确的验证码!");
                return;
            } else if (data.error_code == 39) {
                maskShowAlert("此账号已存在,请登录!");
                return;
            } else if (data.error_code == 200) {
                maskShowAlert("登录密码与确认密码不一致，请确认后再填写!");
                return;
            } else if (data.error_code == 0) {
                location.href = "register_success.html";
            } else {
                store.set("signature", data.signature);
                store.set("username", username);
                var url = getUrlParam("lp");
                if (url == null || url == "undefined" || url == "") {
                    window.location.href = "register.html";
                } else {
                    window.location.href = url;
                }
            }
            interval = 60;
            $("#randomImg").removeAttr("disabled");
            $("#randomImg").text("获取验证码");
            $("#randomImg").css("color", "#ffffff");
            $("#randomImg").css("background-color", "#0795D4");
            canClickSendMobileCode();
            window.clearInterval(timer);
        }
    });
}

$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        $('#submit').click();
    }
});

$(function () {
    canClickSendMobileCode();
    $("#submit").unbind("click").on("click", function () {
        register();
    });
});
