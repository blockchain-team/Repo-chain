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
    $(".get_verCode").val(interval + "秒后重发");
    timer = window.setInterval("msgInterval();", 1000);
}

// 未绑定邮箱
function canClickSendNoBoundCode() {
    //请求验证码
    $('#verification_code').unbind("click").bind("click", function () {
        var phone = $('#phone_text').val().trim();
        if ($.trim(phone) == "") {
            maskShowAlert('请输入您要绑定的手机号!');
            return;
        }
        var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!phone.match(regPhone)) {
            maskShowAlert("手机号格式有误,请填写正确的手机格式!")
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/sendsecurityinformation',
            async: false,
            processDate: true,
            data: {
                username: phone,
                r_reason: 'bindmobile'
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code != 0) {
                    if (data.error_code == 204) {
                        maskShowAlert('此手机号已绑定,请确认!');
                        return;
                    } else if (data.code == 35) {
                        loginOvertime('login.html?lp=' + GetUrlRelativePath());
                    } else {
                        maskShowAlert('短信验证码发送失败!')
                        return;
                    }
                } else {
                    maskShowAlert('发送短信成功!');
                    setTimeout(function () {
                        $(".dialog,.mask").hide();
                        getMobileCheckCode();
                    }, 2000);
                }
            }
        });
    });
}

// 修改绑定手机
function canClickSendBoundEmailCode() {
    //请求验证码
    $('#update_verCode').unbind("click").bind("click", function () {
        if ($('#input_phone_password').val().trim() == "") {
            maskShowAlert('请输入您的交易密码!');
            return;
        }
        var bound_phone = $('#input_phone_bind').val().trim();
        if ($.trim(bound_phone) == "") {
            maskShowAlert('请输入您要绑定的手机号!');
            return;
        }
        var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!bound_phone.match(regPhone)) {
            maskShowAlert("手机号格式有误,请填写正确的手机格式!")
            return;
        }
        $.ajax({
            type: 'POST',
            url: '/sendsecurityinformation',
            async: false,
            processDate: true,
            data: {
                username: bound_phone,
                language: 'en',
                r_reason: 'bindmobile'
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code != 0) {
                    if (data.error_code == 204) {
                        maskShowAlert('此手机号已绑定,请确认!');
                        return;
                    } else if (data.error_code == 35) {
                        loginOvertime('login.html?lp=' + GetUrlRelativePath());
                    } else {
                        maskShowAlert('短信验证码发送失败!');
                    }
                } else {
                    maskShowAlert('发送短信成功!');
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
        //$("#sendMsgButton").val("获取手机验证码");
        $(".get_verCode").text("获取验证码");
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
            $(".get_verCode").val("获取手机验证码");
        } else {
            interval = interval - 1;
            $(".get_verCode").text(interval + "秒后重发");
        }
    }
}

// 绑定我的邮箱验证
function phoneValidate() {
    var phone = $('#phone_text').val();
    if ($.trim(phone) == "") {
        maskShowAlert('请输入您要绑定的手机号!');
        return;
    }
    var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phone.match(regPhone)) {
        maskShowAlert("手机号格式有误,请填写正确的手机格式!")
        return;
    }
    if ($('#phone_vercode').val() == "") {
        maskShowAlert('请输入短信验证码!');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/phone/phoneverification',
        async: false,
        processDate: true,
        data: {
            username: username,
            signature: signature,
            phoneNo: phone,
            random: $('#phone_vercode').val()
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                isPhoneBound();
            } else if (data.error_code == 5) {
                maskShowAlert('验证码错误!');
            } else if (data.error_code == 20) {
                maskShowAlert('此用户暂未设置交易密码,请设置!');
                return;
            } else if (data.error_code == 35) {
                loginOvertime('login.html?lp=' + GetUrlRelativePath());
            } else {
                console.log(data.error_code);
            }
        }
    });
}

// 修改我的手机验证
function phoneUpdate() {
    if ($('#input_phone_password').val() == "") {
        maskShowAlert('请输入您的交易密码!');
        return;
    }
    var bound_phone = $('#input_phone_bind').val().trim();
    if (bound_phone == "") {
        maskShowAlert('请输入您要绑定的手机号!');
        return;
    }
    var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!bound_phone.match(regPhone)) {
        maskShowAlert("手机号格式有误,请填写正确的手机格式!")
        return;
    }
    if ($('#phone_vercode_reset').val() == "") {
        maskShowAlert('请输入短信验证码!');
        return;
    }
    $.ajax({
        type: 'POST',
        url: '/phone/phoneverification',
        async: false,
        processDate: true,
        data: {
            username: username,
            signature: signature,
            phoneNo: $('#input_phone_bind').val().trim(),
            random: $('#phone_vercode_reset').val().trim(),
            transactionPassword: $.md5($('#input_phone_password').val())
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                maskShowAlert('修改手机号成功!');
                store.set("username", $('#input_phone_bind').val());
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else if (data.error_code == 5) {
                maskShowAlert('验证码错误!');
                return;
            } else if (data.error_code == 10) {
                maskShowAlert('请填写正确的交易密码!');
                return;
            } else if (data.error_code == 20) {
                maskShowAlert('此用户暂未设置交易密码,请设置!');
                return;
            } else if (data.error_code == 35) {
                loginOvertime('login.html?lp=' + GetUrlRelativePath());
            } else if (data.error_code == 113) {
                maskShowAlert('修改手机号成功!');
                store.set("username", $('#input_phone_bind').val());
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else {
                console.log(data.error_code);
            }
        }
    });
}

// 判断手机号是否绑定成功
function isPhoneBound() {
    $.ajax({
        type: 'POST',
        url: '/phone/isphonebound',
        async: false,
        processDate: true,
        data: {
            username: username,
            signature: signature
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                interval = 0;
                msgInterval();
                //绑定成功
                $('.no_bind_type').hide();
                $('.alreay_bind_type').show();
                $('#bind_phone').html(data.mobile);
            } else if (data.error_code == 1) {
                maskShowAlert('参数有误,请确认!');
                return;
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
    isPhoneBound();
    canClickSendNoBoundCode();
    canClickSendBoundEmailCode();

    // 绑定未绑定邮箱
    $("#btn_confirm_bound").unbind("click").on("click", function () {
        phoneValidate();
    });

    // 修改绑定邮箱
    $("#btn_confirm_change").unbind("click").on("click", function () {
        phoneUpdate();
    });
});