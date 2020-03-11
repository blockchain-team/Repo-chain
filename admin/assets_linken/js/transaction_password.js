//获取所有安全问题
function getQuestions(){
    var username = store.get("username");
    var signature = store.get("signature");

    $.ajax({
        type: "post",
        url: "/user/getQuestions",
        processDate: true,
        data: {
            username : username,
            signature : signature
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                var questions = data.questions;
                $(".select_gather").empty();
                $.each(questions,function(i,item){

                    if(item.affiliation == 1){
                        var question1 = $('<li class="question1-item" data-value="'+item.id+'">'+item.question_ch+'</li>');
                        $(".question1-choose").append(question1);
                    }

                    if(item.affiliation == 2){
                        var question2 = $('<li class="question2-item" data-value="'+item.id+'">'+item.question_ch+'</li>');
                        $(".question2-choose").append(question2);
                    }

                    if(item.affiliation == 3){
                        var question3 = $('<li class="question3-item" data-value="'+item.id+'">'+item.question_ch+'</li>');
                        $(".question3-choose").append(question3);
                    }
                });
            }
        }
    });
}

function setSafetyQuestion(){
    var username = store.get("username");
    var signature = store.get("signature");

    if(username != "" && username != undefined && signature != "" && signature != undefined){
        var questionId1 = $("#select_question1").data("value");
        var questionId2 = $("#select_question2").data("value");
        var questionId3 = $("#select_question3").data("value");
        var answer1 = $("#answer1").val();
        var answer2 = $("#answer2").val();
        var answer3 = $("#answer3").val();

        if(questionId1 == ""){
            showAlert("请选择安全问题1");
            return;
        }
        if(answer1 == ""){
            showAlert("请输入安全问题1答案");
            return;
        }
        if(questionId2 == ""){
            showAlert("请选择安全问题2");
            return;
        }
        if(answer2 == ""){
            showAlert("请输入安全问题2答案");
            return;
        }
        if(questionId3 == ""){
            showAlert("请选择安全问题3");
            return;
        }
        if(answer3 == ""){
            showAlert("请输入安全问题3答案");
            return;
        }

        $.ajax({
            type: "post",
            url: "/user/setQuestion",
            processDate: true,
            data: {
                username : username,
                signature : signature,
                questionId1 : questionId1,
                questionId2 : questionId2,
                questionId3 : questionId3,
                answer1 : $.md5(answer1),
                answer2 : $.md5(answer2),
                answer3 : $.md5(answer3)
            },
            dataType: 'json',
            success: function(data) {
                if(data.error_code == 0) {
                    showAlert("安全问题设置成功");
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000)
                }
                else if(data.error_code == 1){
                    showAlert("参数错误");
                }
                else if(data.error_code == 15){
                    showAlert("参数错误 用户不存在");
                }
                else if(data.error_code == 210){
                    showAlert("参数异常 数据未加密");
                }
                else if(data.error_code == 250){
                    showAlert("服务器异常 操作失败");
                }
                else if(data.error_code == 35){
                    showAlert("登录超时 请重新登录");
                    goHtml("login.html?lp=set_trade_pwd.html");
                }
                else if(data.error_code == 58){
                    showAlert("操作异常 安全问题已设置");
                }
            }
        });
    }else{
        showAlert("请登录");
        goHtml("login.html?lp=set_trade_pwd.html");
    }
}


function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.common_mask").show();
}


function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}

$(function(){
    $("#answerConfirm").click(function(){
        setSafetyQuestion();
    });
    getQuestions();

    var param = getUrlParam("opera");
    if(param == "setQuestion"){
        $("#Unset").click();
    }
});