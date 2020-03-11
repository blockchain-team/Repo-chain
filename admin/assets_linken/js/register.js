var interval = 60;
var url;
var r_reason;
function getMobileCheckCode() {
    //点击之后 不能再点击
    $("#randomImg").attr("disabled", "disabled");
    $("#randomImg").unbind("click");
    $("#randomImg").css("color", "#999");
    $("#randomImg").css("background-color", "#DDD");
    $("#randomImg").val(interval + "seconds resend");
    timer = window.setInterval("msgInterval();", 1000);
}
function canClickSendMobileCode() {
    //请求验证码
    $('#randomImg').unbind("click").bind("click", function () {
        var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if ((!$("#username").val().match(regEmail) && !$("#username").val().match(regPhone))) {
            maskShowAlert("Incorrect email or phone number format, please check and try again!")
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
        getMobileCheckCode();
        $.ajax({
            url: url,
            type: 'POST',
            processDate: true,
            data: {
                username: $("#username").val(),
                random: $("#imgCode").val(),
                password: $.md5($("#password").val()),
                confirmpassword: $.md5($("#confirmPwd").val()),
                r_reason: r_reason,
                category : "register",
                language : "en"
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 1) {
                    maskShowAlert("Parameter error, please contact customer service!");
                    return;
                } else if (data.error_code == 0) {
                    $(".text").text("");
                    $(".btn").text("");
                    if (r_reason == "register_email") {
                        maskShowAlert("Email sent!");
                        return;
                        // $(".text").append("验证码已发送到您的<em>" + $("#username").val() + "</em>邮箱，请登录邮箱查收邮箱验证码完成注册!");
                        // $(".btn").append("<span class='btnEmail'>重发邮件</span>");
                        // $(".btnEmail").unbind("click").on("click", function () {//重发邮件
                        //     $.ajax({
                        //         url: "/sendemail",
                        //         type: 'POST',
                        //         processDate: true,
                        //         data: {
                        //             username: $("#username").val(),
                        //             r_reason: "register_email"
                        //         },
                        //         dataType: 'json',
                        //         success: function (data) {
                        //             if (data.error_code == 0) {
                        //                 $(".btnEmail").attr("disabled", "disabled");
                        //                 $(".btnEmail").unbind("click");
                        //                 $(".btnEmail").css("color", "#999");
                        //                 $(".btnEmail").css("background-color", "#DDD");
                        //                 $(".btn").css("background-color", "#DDD");
                        //             }
                        //         }
                        //     })
                        // })

                    } else if (r_reason == "register") {
                        maskShowAlert("Massage sent!")
                        // $(".text").append("短信验证码已发送到您的<em>" + $("#username").val() + "</em>手机，请查收手机短信验证码完成注册!");
                        // $(".btn").append("<span class='btnSms'>重发短信</span>");
                        // $(".btnSms").unbind("click").on("click", function () {//重发短信
                        //     $.ajax({
                        //         url: "/sendinformation",
                        //         type: 'POST',
                        //         processDate: true,
                        //         data: {
                        //             username: $("#username").val(),
                        //             r_reason: "register"
                        //         },
                        //         dataType: 'json',
                        //         success: function (data) {
                        //             if (data.error_code == 0) {
                        //                 $(".btnSms").attr("disabled", "disabled");
                        //                 $(".btnSms").unbind("click");
                        //                 $(".btnSms").css("color", "#999");
                        //                 $(".btnSms").css("background-color", "#DDD");
                        //                 $(".btn").css("background-color", "#DDD");
                        //             }
                        //         }
                        //     });
                        // });
                    }
                    return;
                } else {
                    maskShowAlert("Failed to send verification code!");
                    return;
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
        $("#randomImg").text("Get verification code");
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
            $("#randomImg").val("Get phone code");
        } else {
            interval = interval - 1;
            $("#randomImg").text(interval + "seconds resend");
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
        maskShowAlert("Mailbox cannot be empty!");
        return;
    }
    if(imgCode == ""){
        maskShowAlert("Verification code cannot be empty!");
        return;
    }
    if(password == ""){
        maskShowAlert("Password cannot be empty!");
        return;
    }
    if(confirmPwd == ""){
        maskShowAlert("Confirm password cannot be empty!");
        return;
    }
    if(password != confirmPwd){
        maskShowAlert("Passwords do not match, please re-enter!");
        return;
    }
    if ((!password.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/))) {
        maskShowAlert("Password should be 6-12 characters including letters and numbers!");
        return;
    }
    $.ajax({
        url: "/register",
        type: 'POST',
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
                maskShowAlert("Parameter error, please contact customer service!");
                return;
            } else if (data.error_code == 5) {
                maskShowAlert("Incorrect verification code!");
                return;
            } else if (data.error_code == 39) {
                maskShowAlert("Account already exist,Please login!");
                return;
            } else if (data.error_code == 200) {
                maskShowAlert("login password is not the same as the confirmation password. Please confirm and fill in");
                return;
            } else if (data.error_code == 199) {
                maskShowAlert("Password should be 6-12 characters including letters and numbers!");
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
            $("#randomImg").text("Get verification code");
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
