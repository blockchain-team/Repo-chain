var username = store.get("username");
var signature = store.get("signature");

//获取所有安全问题
function getQuestions() {

    $.ajax({
        type: "post",
        url: "/user/getQuestions",
        processDate: true,
        data: {
            username: username,
            signature: signature
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                var questions = data.questions;
                $(".select_gather").empty();
                $.each(questions, function (i, item) {

                    if (item.affiliation == 1) {
                        var question1 = $('<li class="question1-item" data-value="' + item.id + '">' + item.question_en + '</li>');
                        $(".question1-choose").append(question1);
                    }

                    if (item.affiliation == 2) {
                        var question2 = $('<li class="question2-item" data-value="' + item.id + '">' + item.question_en + '</li>');
                        $(".question2-choose").append(question2);
                    }

                    if (item.affiliation == 3) {
                        var question3 = $('<li class="question3-item" data-value="' + item.id + '">' + item.question_en + '</li>');
                        $(".question3-choose").append(question3);
                    }
                });
            }
        }
    });
}

//获取用户安全问题
function getUserSafetyQuestion() {

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
            if (data.error_code == 0) {
                if (data.setFlag == true) {
                    //展示用户安全问题
                    $.each(data.questions, function (i, item) {
                        if (item.affiliation == 1) {
                            $('.question1-txt').text(item.question_ch);
                            $(".question1-txt").data("value", item.id);
                            $('#answer1').text();
                        }
                        if (item.affiliation == 2) {
                            $('.question2-txt').text(item.question_ch);
                            $(".question2-txt").data("value", item.id);
                        }
                        if (item.affiliation == 3) {
                            $('.question3-txt').text(item.question_ch);
                            $(".question3-txt").data("value", item.id);
                        }
                    });
                    console.log($(".question2-txt").data("value"));
                } else {
                    //跳转至安全问题设置
                    $('#doResetPwd').hide();
                    showAlert("Security questions unset, please set!");//未设置安全问题 请设置!
                    setTimeout(function () {
                        $("#resetPwd").hide();
                        $('.common_mask,.dialog_init').hide();
                        $('#askquestion,.mask').show();
                    }, 3000);
                }
            } else if (data.error_code == 35) {
                showAlert("Login timeout Please log in again!");
                goHtml("login.html?lp=set_trade_pwd.html");
                return;
            }
        }
    });
}

function setSafetyQuestion() {

    if (username != "" && username != undefined && signature != "" && signature != undefined) {
        var questionId1 = $("#select_question1").data("value");
        var questionId2 = $("#select_question2").data("value");
        var questionId3 = $("#select_question3").data("value");
        var answer1 = $("#answer1").val();
        var answer2 = $("#answer2").val();
        var answer3 = $("#answer3").val();

        if (questionId1 == "") {
            showAlert("Please choose security question 1");//请选择安全问题1
            return;
        }
        if (answer1 == "") {
            showAlert("Please type the answer to security question 1");//请输入安全问题1答案
            return;
        }
        if (questionId2 == "") {
            showAlert("Please choose security question 2");//请选择安全问题2
            return;
        }
        if (answer2 == "") {
            showAlert("Please type the answer to security question 2");//请输入安全问题2答案
            return;
        }
        if (questionId3 == "") {
            showAlert("Please choose security question 3");//请选择安全问题3
            return;
        }
        if (answer3 == "") {
            showAlert("Please type the answer to security question 3");//请输入安全问题3答案
            return;
        }
        // 安全问题提交成功,点击下一步
        $(".sp_txt").hide();
        // 安全问题
        $('.problem1').text($("#select_question1").text());
        $('.problem2').text($("#select_question2").text());
        $('.problem3').text($("#select_question3").text());
        // 安全问题回答
        $('.answer1').text(answer1);
        $('.answer2').text(answer2);
        $('.answer3').text(answer3);
        $(".sq_next_step").show();
        //store.set("questionList", {'problem1': questionId1, 'problem1': questionId2, 'problem1': questionId3, 'answer1': answer1, 'answer2': answer2, 'answer1':answer3});//保存的安全问题
        // 安全问题确定按钮
        $("#confirmSubmit").unbind('click').on('click', function () {
            $.ajax({
                type: "post",
                url: "/user/setQuestion",
                processDate: true,
                data: {
                    username: username,
                    signature: signature,
                    questionId1: questionId1,
                    questionId2: questionId2,
                    questionId3: questionId3,
                    answer1: $.md5(answer1),
                    answer2: $.md5(answer2),
                    answer3: $.md5(answer3)
                },
                dataType: 'json',
                success: function (data) {
                    if (data.error_code == 0) {
                        showAlert("Security settings success!");//安全问题设置成功
                        setTimeout(function () {
                            $(".dialog_init,.common_mask,.sq_next_step").hide();// 隐藏提示蒙版
                            $(".sq_set_success").show();                        // 跳转至交易密码
                        }, 2000);
                    }
                    else if (data.error_code == 1) {
                        showAlert("Parameter error!");//参数错误!
                    }
                    else if (data.error_code == 15) {
                        showAlert("Account not found!");//用户不存在!
                    }
                    else if (data.error_code == 210) {
                        showAlert("Data unencrypted!");//数据未加密!
                    }
                    else if (data.error_code == 250) {
                        showAlert("The server exception operation failed!");//服务器异常 操作失败!
                    }
                    else if (data.error_code == 35) {
                        showAlert("Login timeout Please log in again!");//登录超时 请重新登录!
                        goHtml("login.html?lp=set_trade_pwd.html");
                    }
                    else if (data.error_code == 58) {
                        showAlert("Security issues have been set up!");//操作异常 安全问题已设置
                    }
                }
            });
        });
    } else {
        showAlert("Please log in!");//请登录!
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}

//获取账号信息
function loadAccount() {

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
                    // 是否设置安全问题
                    if (data.safetyQuestion != "true") {
                        // showAlert("Security questions unset, please set!");//未设置安全问题 请设置!
                        // 未设置安全问题
                        $(".sp_txt").show();
                        //store.remove("questionList");// 清空临时保存的安全问题
                        getQuestions();
                    } else {
                        $(".already_setsq").show();
                        $(".main_blue").text(data.login_name);
                    }
                } else if (data.error_code == 35) {
                    showAlert("Timeout! Please login again!");
                    goHtml("login.html?lp=set_trade_pwd.html");
                    return;
                }
            }
        });
    } else {
        showAlert("Timeout! Please login again!");
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}

// 返回修改
$("#backUpdate").click(function () {
    $(".sp_txt").show();// 安全问题列表
    $(".sq_next_step").hide();
});

function showAlert(text) {
    $("#alert_info").text(text);
    $(".dialog_init,.common_mask").show();
}


function goHtml(html) {
    $(".common_close_icon").click(function () {
        window.location.href = html;
    });
}

// 安全问题保存
$(function () {
    $("#answerConfirm").click(function () {
        setSafetyQuestion();
    });
    loadAccount();
});