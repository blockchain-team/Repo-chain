var username = store.get("username");
var signature = store.get("signature");

var interval = 60;
var timer;
function getMobileCheckCode() {
    //点击之后 不能再点击
    $(".get_verCode").attr("disabled", "disabled");
    $(".get_verCode").unbind("click");
    $(".get_verCode").css("color", "#999");
    $(".get_verCode").css("background-color", "#DDD");
    $(".get_verCode").text(interval+ " seconds resend");//interval + "秒后重发"
    timer = window.setInterval("msgInterval();", 1000);
}

// 未绑定邮箱
function canClickSendNoBoundCode() {
    //请求验证码
    $('#verification_code').unbind("click").bind("click", function () {
        var email = $('#email_text').val();
        if ($.trim(email) == "") {
            maskShowAlert('Please enter your email!');// 请输入您的安全邮箱！
            return;
        }
        var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        if (!email.match(regEmail)) {
            maskShowAlert("The email format is INVAILD!")//邮箱格式有误,请填写正确的邮箱格式!
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/email/sendbindupdateemail',
            async: false,
            processDate: true,
            data: {
                email: email,
                username: username,
                language: 'english',
                r_reason: 'bindemail'
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code != 0) {
                    if (data.error_code == 207) {
                        maskShowAlert('This email has been bound, please confirm!');//此邮箱已绑定,请确认!
                        return;
                    } else if (data.code == 35) {
                        loginOvertime('login.html?lp=' + GetUrlRelativePath());
                    } else {
                        maskShowAlert('The verification code is sent failed!')
                        return;
                    }
                } else {
                    maskShowAlert('Send mail successfully!');// 发送邮件成功
                    setTimeout(function () {
                        $(".dialog,.mask").hide();
                        getMobileCheckCode();
                    }, 2000);
                }
            }
        });
    });
}

// 修改绑定邮箱
function canClickSendBoundEmailCode() {
    //请求验证码
    $('#update_verCode').unbind("click").bind("click", function () {
        if ($('#input_email_password').val() == "") {
            maskShowAlert('Please enter the transaction password!');//请输入交易密码
            return;
        }
        var bound_email = $('#input_email_bind').val();
        if ($.trim(bound_email) == "") {
            maskShowAlert('Please enter the email you want to bind!');// 请输入您要绑定的邮箱!
            return;
        }
        var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        if (!bound_email.match(regEmail)) {
            maskShowAlert("The email format is INVAILD!")//邮箱格式有误,请填写正确的邮箱格式!
            $("input_email_bind").val(null);
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/email/sendbindupdateemail',
            async: false,
            processDate: true,
            data: {
                email: bound_email,
                username: username,
                language: 'english',
                r_reason: 'bindemail'
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code != 0) {
                    if (data.error_code == 207) {
                        maskShowAlert('This email has been bound, please confirm!');//此邮箱已绑定,请确认!
                        return;
                    } else if (data.error_code == 35) {
                        loginOvertime('login.html?lp=' + GetUrlRelativePath());
                    } else {
                        maskShowAlert('The verification code is sent failed!');//验证码发送失败!
                    }
                } else {
                    maskShowAlert('Send mail successfully!');// 发送邮件成功!
                    setTimeout(function () {
                        $(".dialog,.mask").hide();
                        getMobileCheckCode();
                    }, 2000);
                }
            }
        });
    });
}
function msgInterval() {
    // 倒计时结束
    if (interval == 0) {
        interval = 60;
        $(".get_verCode").removeAttr("disabled");
        $(".get_verCode").text("Send verification code");//获取验证码
        $(".get_verCode").css("color", "#0d97d5");
        $(".get_verCode").css("background-color", "#ffffff");
        canClickSendNoBoundCode();
        canClickSendBoundEmailCode();
        window.clearInterval(timer);
    } else {
        $(".get_verCode").attr("disabled", "disabled");
        $(".get_verCode").unbind("click");
        $(".get_verCode").css("color", "#999");
        $(".get_verCode").css("background-color", "#DDD");
        if (isNaN(interval) || isNaN(interval - 1)) {
            $(".get_verCode").val("Get mobile email verification code");//获取邮箱验证码
        } else {
            interval = interval - 1;
            $(".get_verCode").text(interval+ " seconds resend");//interval + "秒后重发"
        }
    }
}

// 绑定我的邮箱验证
function emailValidate() {
    var email = $('#email_text').val();
    if ($.trim(email) == "") {
        maskShowAlert('Please enter your email!');//请输入您的安全邮箱!
        return;
    }
    var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if (!email.match(regEmail)) {
        maskShowAlert("The email format is INVAILD!")//邮箱格式有误,请填写正确的邮箱格式!
        return;
    }
    if ($('#email_vercode').val() == "") {
        maskShowAlert('Please enter the email verification code!');//请输入邮箱验证码!
        return;
    }
    $.ajax({
        type: 'post',
        url: '/email/emailverification',
        async: false,
        processDate: true,
        data: {
            username: username,
            signature: signature,
            emailNo: $('#email_text').val(),
            random: $('#email_vercode').val()
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                isEmialBound();
            } else if (data.error_code == 5) {
                maskShowAlert('Wrong verification code, please enter the right one!');//错误的随机值验证码!
            } else if (data.error_code == 35) {
                loginOvertime('login.html?lp=' + GetUrlRelativePath());
            } else {
                console.log(data.error_code);
            }
        }
    });
}

// 修改我的邮箱验证
function emailUpdate() {
    if ($('#input_email_password').val() == "") {
        maskShowAlert('Please enter the transaction password!');//请输入交易密码!
        return;
    }
    var bound_email = $('#input_email_bind').val();
    if ($.trim(bound_email) == "") {
        maskShowAlert('Please enter the email you want to bind!');// 请输入您要绑定的邮箱!
        return;
    }
    var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    if (!bound_email.match(regEmail)) {
        maskShowAlert("The email format is INVAILD!")//邮箱格式有误,请填写正确的邮箱格式!
        return;
    }
    if ($('#email_vercode_reset').val() == "") {
        maskShowAlert('Please enter the email verification code!');//请输入邮箱验证码!
        return;
    }
    $.ajax({
        type: 'post',
        url: '/email/emailverification',
        async: false,
        processDate: true,
        data: {
            username: username,
            signature: signature,
            emailNo: $('#input_email_bind').val(),
            random: $('#email_vercode_reset').val(),
            transactionPassword: $.md5($('#input_email_password').val())
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                maskShowAlert('The email is changed successfully!');//修改邮箱成功!
                store.set("username", $('#input_email_bind').val());
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            } else if (data.error_code == 5) {
                maskShowAlert('Wrong verification code, please enter the right one!');//错误的随机值验证码!
                return;
            } else if (data.error_code == 10) {
                maskShowAlert('Please fill in the correct password for the transaction!');//请填写正确的交易密码!
                return;
            } else if (data.error_code == 20) {
                maskShowAlert('This user has not set up the transaction password, please set!');//此用户暂未设置交易密码,请设置!
                return;
            } else if (data.error_code == 35) {
                loginOvertime('login.html?lp=' + GetUrlRelativePath());
            } else if (data.error_code == 113) {
                maskShowAlert('The email is changed successfully!');//修改邮箱成功!
                store.set("username", $('#input_email_bind').val());
                setTimeout(function () {
                    window.location.reload();
                }, 3000);
            } else {
                console.log(data.error_code);
            }
        }
    });
}

// 判断邮箱是否绑定成功
function isEmialBound() {
    $.ajax({
        type: 'post',
        url: '/email/isemailbound',
        async: false,
        processDate: true,
        data: {
            username: username,
            signature: signature
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                //邮箱绑定成功
                interval = 0;
                msgInterval();
                $('.no_bind_type').hide();
                $('.alreay_bind_type').show();
                $('#bind_email').html(data.email);
            } else if (data.error_code == 1) {
                console.log('Error, please confirm!');//请求参数有误,请确认!
                loginOvertime('login.html?lp=' + GetUrlRelativePath());
            } else if (data.error_code == 35) {
                loginOvertime('login.html?lp=' + GetUrlRelativePath());
            } else if (data.error_code == 55) {
                loginOvertime('login.html?lp=' + GetUrlRelativePath());// 用户不存在
            } else {
                //邮箱未绑定
                $(".no_bind_type").show();
                $(".alreay_bind_type").hide();
            }
        }
    });
}

// 邮箱初始化数据
$(function () {
    isEmialBound();
    canClickSendNoBoundCode();
    canClickSendBoundEmailCode();

    // 绑定未绑定邮箱
    $("#btn_confirm_bound").unbind("click").on("click", function () {
        emailValidate();
    });

    // 修改绑定邮箱
    $("#btn_confirm").unbind("click").on("click", function () {
        emailUpdate();
    });
});