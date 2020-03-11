var interval = 60;

$(function () {
//    canClickSendMobileCode();
    canClickSendEmailCode();
//    resetPhone();
    resetEmail();
});

function getMobileOrEmailCheckCode(id) {
    //点击之后 不能再点击
    $("#" + id).attr("disabled", "disabled");
    $("#" + id).unbind("click");
    $("#" + id).css("color", "#999");
    $("#" + id).css("background-color", "#DDD");
//    $("#" + id).val(interval + "秒后重发");
    $("#" + id).val(interval + "s after the re-issued");
    timer = window.setInterval("msgInterval('" + id + "');", 1000);
}

function msgInterval(id) {
    // 倒计时结束
    if (interval == 0) {
        interval = 60;
        $("#" + id).removeAttr("disabled");
//        $("#" + id).text("获取验证码");
        $("#" + id).text("Get verification code");
        $("#" + id).css("color", "rgb(255, 255, 255)");
        $("#" + id).css("background-color", "rgb(7, 149, 212)");
        if(id == "sendMsgButton"){
            canClickSendMobileCode();
        }else if(id == "sendMsgButtonByE"){
            canClickSendEmailCode();
        }
        window.clearInterval(timer);
    } else {
        $("#" + id).attr("disabled", "disabled");
        $("#" + id).unbind("click");
        $("#" + id).css("color", "#999");
        $("#" + id).css("background-color", "#DDD");
        if (isNaN(interval) || isNaN(interval - 1)) {
//            $("#" + id).val("获取验证码");
            $("#" + id).val("Get verification code");
        } else {
            interval = interval - 1;
            //$("#sendMsgButton").val(interval + "秒后重发");
            $("#" + id).text(interval + "S after the re-issued");
        }
    }
}

function canClickSendMobileCode() {
    //请求验证码
    $('#sendMsgButton').click(function () {

        var urllink = "/sms/send";
        var userName = $('#username_byphone').val();
        if (userName == "") {
//            showAlert("请输入手机号!");
            showAlert("Please enter phone number!");
            return;
        }
        getMobileOrEmailCheckCode("sendMsgButton");
        $.ajax({
            url: urllink,
            type: 'POST',
            processDate: true,
            data: {
                mobile: userName,
                reason: 'changepassword'
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code != "0") {
                    window.clearInterval(timer);
                    $("#sendMsgButton").removeAttr("disabled");
                    //$("#sendMsgButton").val("获取验证码");
                    $("#sendMsgButton").text("Get verification code");
                    $("#sendMsgButton").css("color", "#999");
                    $("#sendMsgButton").css("background-color", "#DDD");
                    canClickSendMobileCode();
                    if (data.error_code == '14') {
//                        showAlert("用户已注册!");
                        showAlert("The user is registered!");
                        return;
                    }
                    else {
//                        showAlert("验证码发送失败!");
                        showAlert("Verification code failed to send!");
                        return;
                    }
                }
            }
        });
    });
}

function canClickSendEmailCode() {
    //请求验证码
    $('#sendMsgButtonByE').click(function () {

        var urllink = "/sendemail";
        var userName = $('#username_byemail').val();
        if (userName == "") {
            showAlert("Please input your email!");//请输入邮箱!
            return;
        }
        $.ajax({
            url: urllink,
            type: 'POST',
            processDate: true,
            data: {
                username: userName,
                r_reason: 'changepassword',
                category : "reset password",
                language : "en"
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code != "0") {
                    // window.clearInterval(timer);
                    // $("#sendMsgButtonByE").removeAttr("disabled");
                    // $("#sendMsgButtonByE").text("Get verification code");
                    // $("#sendMsgButtonByE").css("color", "#999");
                    // $("#sendMsgButtonByE").css("background-color", "#DDD");
                    // canClickSendMobileCode();
                    if (data.error_code == '14') {
                        showAlert("The user is registered!");//用户已注册
                        return;
                    } else if(data.error_code == 111){
                        showAlert("Email does not exist");
                        return;
                    } else {
                        showAlert("Verification code failed to send!");//验证码发送失败
                        return;
                    }
                } else {
                    getMobileOrEmailCheckCode("sendMsgButtonByE");
                }
            }
        });
    });
}

function resetPhone() {

    $("#submit_byphone").click(function () {

        var username = $("#username_byphone").val();
        var password = $("#password_byphone").val();
        var confirmpassword = $("#confirmPwd_byphone").val();
        var random = $("#imgCode_byphone").val();

        if (username == "") {
//            showAlert("请输入手机号!");
            showAlert("Please enter phone number!");
            return;
        }
        if (random == "") {
//            showAlert("请输入验证码!");
            showAlert("Please enter verification code!");
            return;
        }
        if(password == ""){
//            请输入重置密码
            showAlert("Please enter password!");
            return;
        }
        if(confirmpassword == ""){
//          请输入确认密码
            showAlert("Please confirm new password!");
            return;
        }
        if (password != confirmpassword) {
//            showAlert("两次输入的密码需保持一致!");
            showAlert("The password entered twice must be consistent!");
            return;
        }
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(password)) {
//            showAlert("密码必须包含数字和字母，长度为6-12位!");
            showAlert("The password must contain numbers and letters, the length is 6-12 bits!");
            return;
        }
        var md5Pwd = $.md5($.trim(password));
        $.ajax({
            url: "/user/resetPwd",
            type: 'POST',
            processDate: true,
            data: {
                username: username,
                password: md5Pwd,
                random: random
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == "0") {
                    store.clear();
//                    showAlert("密码重置成功,请重新登录!");
                    showAlert("Password reset is successful, please log back in!");
                    goHtml("login.html");
                } else if (data.error_code == "5") {
//                    showAlert("验证码错误!");
                    showAlert("Verification code error!");
                    return;
                } else if (data.error_code == "15") {
//                    showAlert("账号不存在!");
                    showAlert("Account does not exist!");
                    return;
                }
                else if (data.error_code == 201) {
                    showAlert("The login password can not be the same as the payment password!");
                    return;
                }
                else {
//                    showAlert("密码重置失败!");
                    showAlert("Password reset failed!");
                    return;
                }

            }
        });
    });

}

function resetEmail() {

    $("#submit_byemail").click(function () {

        var username = $("#username_byemail").val();
        var password = $("#password_byemail").val();
        var confirmpassword = $("#confirmPwd_byemail").val();
        var random = $("#imgCode_byemail").val();

        if (username == "") {
//            showAlert("请输入手机号!");
            showAlert("Please enter email number!");
            return;
        }
        if (random == "") {
//            showAlert("请输入验证码!");
            showAlert("Please enter verification code!");
            return;
        }
        if(password == ""){
//            请输入重置密码
            showAlert("Please enter password!");
            return;
        }
        if(confirmpassword == ""){
//          请输入确认密码
            showAlert("Please confirm new password!");
            return;
        }
        if (password != confirmpassword) {
//            showAlert("两次输入的密码需保持一致!");
            showAlert("The password entered twice must be consistent!");
            return;
        }
        if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(password)) {
//            showAlert("密码必须包含数字和字母，长度为6-12位!");
            showAlert("The password must contain numbers and letters, the length is 6-12 bits!");
            return;
        }
        var md5Pwd = $.md5($.trim(password));
        $.ajax({
            url: "/user/resetPwd",
            type: 'POST',
            processDate: true,
            data: {
                username: username,
                password: md5Pwd,
                random: random
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == "0") {
                    store.clear();
//                    showAlert("密码重置成功,请重新登录!");
                    showAlert("Password reset is successful, please log back in!");
                    goHtml("login.html");
                } else if (data.error_code == "5") {
//                    showAlert("验证码错误!");
                    showAlert("Verification code error!");
                    return;
                } else if (data.error_code == "15") {
//                    showAlert("账号不存在!");
                    showAlert("Account does not exist!");
                    return;
                }
                else if (data.error_code == 201) {
//                    showAlert("登录密码不能与支付密码相同!");
                    showAlert("The login password can not be the same as the payment password!");
                    return;
                }
                else {
//                    showAlert("密码重置失败!");
                    showAlert("Password reset failed!");
                    return;
                }

            }
        });
    });

}


function goHtml(html){
    $(".close_icon").click(function(){
        window.location.href = html;
    });
}

function showAlert(content) {
    $("#alert_info").text(content);
    $(".dialog_init").show();
    $(".mask").show();
    $(".close_icon").click(function () {
        $(".mask").hide();
        $(".dialog_init").hide();
    });
}