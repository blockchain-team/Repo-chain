//设置交易密码
function setPayPwd() {
    var username = store.get("username");
    var signature = store.get("signature");

    if (username != "" && signature != "" && username != undefined && signature != undefined) {
        var payPwd = $("#payPwd").val();
        var confirmPwd = $("#confirmPwd").val();

        if (payPwd == "") {
            $("#alert_info").text("请输入交易密码!");
            $(".dialog_init,.common_mask").show();
            return;
        }
        if (confirmPwd == "") {
            $("#alert_info").text("请重复输入交易密码!");
            $(".dialog_init,.common_mask").show();
            return;
        }
        if (payPwd != confirmPwd) {
            $("#alert_info").text("两次输入密码需一致!");
            $(".dialog_init,.common_mask").show();
            return;
        }
        if (!/^\d{6}$/.test(payPwd)) {
            $("#alert_info").text("交易密码只能为6位数字!");
            $(".dialog_init,.common_mask").show();
            return;
        }
        $.ajax({
            type: "post",
            url: "/user/setPayPwd",
            processDate: true,
            data: {
                username: username,
                signature: signature,
                payPwd: $.md5(payPwd)
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 0) {
                    $("#alert_info").text("交易密码设置成功!");
                    $(".dialog_init,.common_mask").show();
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
                else if (data.error_code == 63) {
                    $('.dialog_dbtn,.mask').show();//请先设置安全问题!
                }
                else if (data.error_code == 15) {
                    $("#alert_info").text("用户不存在!");
                    $(".dialog_init,.common_mask").show();
                    return;
                }
                else if (data.error_code == 57) {
                    $("#alert_info").text("交易密码已设置 如需更改请进行重置!");
                    $(".dialog_init,.common_mask").show();
                    return;
                }
                else if (data.error_code == 210) {
                    $("#alert_info").text("密码未加密!");
                    $(".dialog_init,.common_mask").show();
                    return;
                }
                else if (data.error_code == 35) {
                    $("#alert_info").text("登录超时 请重新登录!");
                    goHtml("set_trade_pwd.html");
                }
                else {
                    $("#alert_info").text("未知错误 操作失败!");
                    $(".dialog_init,.common_mask").show();
                    return;
                }
            }
        })
    } else {
        $("#alert_info").text("请登录!");
        $(".dialog_init,.common_mask").show();
        goHtml("login.html?lp=set_trade_pwd.html")
    }
}


//获取账号信息
function loadAccount() {
    var username = store.get("username");
    var signature = store.get("signature");

    if (username != "" && signature != "" && username != undefined && signature != undefined) {
        $.ajax({
            url: "/loadaccount",
            type: 'POST',
            processDate: true,
            data: {
                username: username,
                signature: signature
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 0) {
                    //是否设置交易密码
                    if (data.setPayPwd == "true") {
                        //展示重置交易密码
                        $("#setPwd").hide();
                        $("#resetPwd").show();
                    } else {
                        $("#resetPwd").hide();
                        $("#setPwd").show();
                    }

                    //是否设置安全问题
                    if (data.safetyQuestion != "true") {
                        $('.dialog_dbtn,.mask').show();
                    }
                }
                else if (data.error_code == 35) {
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=set_trade_pwd.html");
                    return;
                }
            }
        });
    } else {
        showAlert("登录超时 请重新登录!");
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}


//获取用户安全问题
function getUserSafetyQuestion() {
    var username = store.get("username");
    var signature = store.get("signature");
    $.ajax({
        url: "/user/getUserSafetyQuestion",
        type: 'POST',
        processDate: true,
        data: {
            username: username,
            signature: signature
        },
        dataType: 'json',
        success: function (data) {
            $('#doResetPwd,.mask').show();
            if (data.error_code == 0) {
                if (data.setFlag == true) {
                    //展示用户安全问题
                    var questions = data.questions;
                    $(".checkquestions-choose").text('');
                    $(".checkquestions-wrap").click(function () {
                        var temp1 = $("#security1").data("value");
                        var temp = $("#security").data("value");
                        $('.checkquestions-item[data-value="'+temp1+'"]').hide();
                        $('.checkquestionstwo-item[data-value="'+temp+'"]').show();
                    });
                    $(".checkquestionstwo-wrap").click(function () {
                        var temp1 = $("#security1").data("value");
                        var temp = $("#security").data("value");
                        $('.checkquestionstwo-item[data-value="'+temp+'"]').hide();
                        $('.checkquestions-item[data-value="'+temp1+'"]').show();
                    });

                    $.each(questions, function (i, item) {
                        var question1 = $('<li class="checkquestions-item" data-value="' + item.id + '">' + item.question_ch + '</li>');
                        $(".checkquestions-choose").append(question1);
                    });
                    $.each(questions, function (i, item) {
                        var question2 = $('<li class="checkquestionstwo-item" data-value="' + item.id + '">' + item.question_ch + '</li>');
                        $(".checkquestionstwo-choose").append(question2);
                    });
                } else {
                    $('#doResetPwd').hide();// 安全验证隐藏
                    //跳转至安全问题设置
                    $('.dialog_dbtn,.mask').show();
                }
            } else if (data.error_code == 35) {
                showAlert("登录超时 请重新登录!");
                goHtml("login.html?lp=set_trade_pwd.html");
                return;
            }
        }
    });
}


//重置交易密码
function checkUserQuestion1() {
    var username = store.get("username");
    var signature = store.get("signature");

    var value = $(".checkquestions-txt").data("value");
    var valuetwo = $(".checkquestionstwo-txt").data("value");
    var answer = $("#answers").val();
    var answerTwo = $("#answers1").val();

    if (username != "" && username != undefined && signature != "" && signature != undefined) {

        if(value == ""){
            showAlert("请选择安全问题1");
            return;
        }
        if (answer == "") {
            showAlert("请输入答案1!");
            return;
        }
        if(valuetwo == ""){
            showAlert("请选择安全问题2");
            return;
        }
        if (answerTwo == "") {
            showAlert("请输入答案2!");
            return;
        }

        $.ajax({
            url: "/user/checkSafetyQuestion",
            type: 'POST',
            processDate: true,
            data: {
                username: username,
                signature: signature,
                value: value,
                valueTwo: valuetwo,
                answer: $.md5(answer),
                answerTwo: $.md5(answerTwo)
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 0) {
                    // 校验用户输入的安全问题是否正确
                    $('#doResetPwd,#resetPwd,.mask').hide();
                    $('#setPwd').show();
                } else if (data.error_code == 35) {
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=set_trade_pwd.html");
                } else if (data.error_code == 59) {
                    showAlert(data.message);
                } else if (data.error_code == 210) {
                    showAlert("数据未加密!");
                } else {
                    showAlert("参数异常!");
                }
            }
        });
    } else {
        showAlert("请登录!");
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}

//通用提示弹窗
function showAlert(text) {
    $("#alert_info").text(text);
    $(".dialog_init,.common_mask").show();
}

//关闭弹窗跳转页面
function goHtml(html) {
    $(".common_close_icon").click(function () {
        window.location.href = html;
    });
}

//重置交易密码
function resetPayPwd() {
    var username = store.get("username");
    var signature = store.get("signature");

    if (username != "" && username != undefined && signature != "" && signature != undefined) {
        var resetPayPwd = $("#resetPwdVal").val();
        var confPayPwd = $("#confPwdVal").val();

        if (resetPayPwd == "") {
            showAlert("请输入交易密码!");
            return;
        }
        if (confPayPwd == "") {
            showAlert("请重复交易密码!");
            return;
        }
        if (resetPayPwd != confPayPwd) {
            showAlert("两次输入需保持一致!");
            return;
        }
        if (!/^\d{6}$/.test(resetPayPwd)) {
            showAlert("交易密码只能为6位数字!");
            return;
        }

        $.ajax({
            url: "/user/resetPayPwd",
            type: 'POST',
            processDate: true,
            data: {
                username: username,
                signature: signature,
                payPwd: $.md5(resetPayPwd)
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 0) {
                    showAlert("交易密码重置成功!");
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
                else if (data.error_code == 35) {
                    showAlert("登录超时 请重新登录!");
                    goHtml("login.html?lp=set_trade_pwd.html");
                }
                else if (data.error_code == 210) {
                    showAlert("数据未加密");
                }
                else {
                    showAlert("参数异常");
                }
            }
        });
    } else {
        showAlert("请登录!");
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}

$(function () {

    //加载账户信息
    loadAccount();

    //提交设置交易密码
    $("#set_pay_pwd").click(function () {
        setPayPwd();
    });

    //点击跳转至重置校验
    $("#doReset").click(function () {
        $("#answers").val(null);
        $("#resetPwdVal").val(null);
        $("#confPwdVal").val(null);
        getUserSafetyQuestion();
    });

    //校验安全问题
    $("#doResetConfirm").click(function () {
        checkUserQuestion1();
    });

    //重置密码提交
    $("#commitReset").click(function () {
        resetPayPwd();
    });
});