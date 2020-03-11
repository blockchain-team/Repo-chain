//个人资料
var username = store.get("username");
var signature = store.get("signature");
var url;
var interval = 60;
function getMobileCheckCode() {
    //点击之后 不能再点击
    $(".get_code").attr("disabled", "disabled");
    $(".get_code").unbind("click");
    $(".get_code").css("color", "#999");
    $(".get_code").css("background-color", "#DDD");
    $(".get_code").val(interval + "seconds resend");
    timer = window.setInterval("msgInterval();", 1000);
}

function loadAccount() {
    var username = store.get("username");
    var signature = store.get("signature");
    if(username != "" && signature != "" && signature != undefined && username != undefined){
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
                $(".get_name").text(data.nickname);
                $("#nowDate").text(data.last_login_time);

                //填充资产数据
                var accountList = data.accountList;
                $("#dig_list").empty();
                $.each( $.parseJSON(accountList),function(i,item){
                    if(item.category == "ACC"){
                        $("#acc_amount").text(item.account_balance);
                    }else{
                        var account = $('<li><span>'+item.category+'</span><span class="dig_count">'+item.account_balance+'</span><a href=javascript:void(0);><span class="tra_btn">Transfer-out</span></a></li>');
                        $("#dig_list").append(account);
                    }
                });

                if(data.safetyQuestion == "true"){
                    $("#Unset").removeClass("fr red_warn").addClass("fr green_warn");
                    $("#Unset").text("Has been set");
                    $("#Unset").unbind("click");
                }
                if (data.email != undefined) {
                    $(".accountEmail").text(data.email);
                    $("#bound").removeClass("fr red_warn").addClass("fr green_warn");
                    $("#bound").text("Bound");
                } else {
                    $("#bound").removeClass("fr green_warn").addClass("fr red_warn");
                    $("#bound").text("Unbinding");
                    $("#bound").unbind("click").on("click", function () {
                        $("#updatePhone,#update_write_code").val("");
                        $("#PhoneOrEmail").text("Email");
                        $("#is_bind").text("Bind email");
                        $('.mask,#bindPhone').show();
                        url = "/sendemail";
                    });
                }
                if (data.login_name != undefined) {
                    $(".accountPhone").text(data.login_name);
                    $("#Unbound").removeClass("fr red_warn").addClass("fr green_warn");
                    $("#Unbound").text("Bound");
                }
            }
            else if(data.error_code == 35){
                store.clear();
                showAlert("Login timeout Please log in again!");
                goHtml("login.html?lp=trade_password.html");
            }
            else {
                store.clear();
                goHtml("login.html?lp=personal_info.html");
            }
            $(".phone,.write_code").val("");//刷新成功后清空输入框
        }
    });
    }else{
        showAlert("Please log in!");
        goHtml("login.html?lp=personal_info.html");
    }
}


//获取转出记录
function getICORecord(){
    var username = store.get("username");
    var signature = store.get("signature");
    if(username == "" || signature == "" || username == undefined || signature == undefined){
        //登录提示
        showAlert("Please log in!");
        goHtml("login.html?lp=ico_record.html");
        return;
    }

    $.ajax({
        type: "post",
        url: "/user/getICORecord",
        processDate: true,
        data: {
            username : username,
            signature : signature
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                var transactions = data.transactions;
                totalPageCount = data.totalPageCount;

                $(".transactions").remove();
                $.each(transactions,function(i,item){
                    if(i > 2){
                        return;//只显示三条记录
                    }

                    var transaction = $('<tr class=transactions id=record'+item.id+'><td>'+item.create_time+'</td><td>'+item.ico_name+'</td><td><a class="go_detail" href=acc_ico.html?id='+item.user_id+'>'+item.to_addr+'</a></td><td>'+item.transaction_value+item.currency+'</td><td>'+item.acc+'</td><td class=ico_status></td></tr></a>');
                    $("#ico_record").append(transaction);

                    if(item.status == 0){
                        $("#record"+item.id+" .ico_status").text("Publicity");
                        $("#record"+item.id+" .ico_status").addClass("blue_warn");
                    }
                    else if(item.status == 1){
                        $("#record"+item.id+" .ico_status").text("Processing");
                    }
                    else if(item.status == 2){
                        $("#record"+item.id+" .ico_status").text("Over");
                    }

                    if(item.category == "RET"){
                        $("#record"+item.id+" .go_detail").attr("href","ret_record_detail.html?id="+item.user_id);
                    }
                });
            }
            else if(data.error_code == 35){
                showAlert("Login timeout Please log in again!");
                goHtml("login.html?lp=ico_record.html");
            }
            else{
                showAlert("Parameter error data acquisition failed!");
            }
        }
    });
}


function updateNickname() {//昵称修改
    var nickname = $(".alter_name").val();
    if (nickname == "") {
        showAlert("Username cannot be empty!")
        return;
    }
    $.ajax({
        url: "/updatenickname",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            nickname: nickname,
            username: username,
            signature: signature
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 1) {
                showAlert("Failed to modify!");
                return;
            } else if(data.error_code == 39){
                showAlert("The nickname has been used, please replace!");
            } else {
                showAlert("Username has been updated!");
                $('.mask,.dialog_set').hide();
                loadAccount();
            }
        }
    });
}

function canClickSendMobileCode() {
    //绑定请求验证码
    $('.get_code').unbind("click").bind("click", function () {
        var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (url == "/sendemail") {
            r_reason = "register_email";
            if ((!$(".phone").val().match(regEmail))) {
                showAlert("Email format is incorrect, please check and try again!");
                return;
            }
        } else if (url == "/sendinformation") {
            r_reason = "register";
            if (!$(".phone").val().match(regPhone)) {
                showAlert("Phone number format is incorrect, please check and try again!");
                return;
            }
        }
        $.ajax({
            url: url,
            type: 'POST',
            processDate: true,
            async: false,
            data: {
                username: $(".phone").val(),
                is_bind: "true",
                r_reason: r_reason,
                category : "bound",
                language : "en"
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 1) {
                    showAlert("Parameter error, please contact customer service!");
                    return;
                } else if (data.error_code == 0) {
                    var success = url == "/sendemail" ? "Email sent" : "Massage sent";
                    showAlert(success);
                } else if (data.error_code == 204) {
                    showAlert("Phone number has been bound!");
                    return;
                } else if (data.error_code == 207) {
                    showAlert("Email address has been bound!");
                    return;
                } else {
                    showAlert("Failed to send verification code!");
                    return;
                }
                getMobileCheckCode();//倒计时
            }
        });
    });
    //绑定修改手机号
    $('#update_code').unbind("click").bind("click", function () {
        var regEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
        var regPhone = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (url == "/sendupdateemail") {
            r_reason = "update_email";
            if ((!$("#updatePhone").val().match(regEmail))) {
                showAlert("Email format is incorrect, please check and try again!");
                return;
            }
        } else if (url == "/sendinformation") {
            r_reason = "register";
            if (!$("#updatePhone").val().match(regPhone)) {
                showAlert("Phone number format is incorrect, please check and try again!");
                return;
            }
        }
        $.ajax({
            url: url,
            type: 'POST',
            processDate: true,
            async: false,
            data: {
                username: store.get("username"),
                update_EMail : $("#updatePhone").val(),
                is_bind: "true",
                r_reason: r_reason,
                category : "bound",
                language : "en"
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 1) {
                    showAlert("Parameter error, please contact customer service!");
                    return;
                } else if (data.error_code == 0) {
                    var success = url == "/sendupdateemail" ? "Email sent!" : "Massage sent!";
                    showAlert(success);
                } else if (data.error_code == 204) {
                    showAlert("Phone number has been bound!");
                    return;
                } else if (data.error_code == 207) {
                    showAlert("Email address has been bound!");
                    return;
                } else {
                    showAlert("Failed to send verification code!");
                    return;
                }
                getMobileCheckCode();//倒计时
            }
        });
    });
}

//绑定确定按钮
$("#bindConfirm").unbind("click").on("click", function () {
    if ($(".write_code").val() == "") {
        showAlert("Please enter verification code!");
        return;
    }
    $.ajax({
        url: "/validatecode",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            validatausername: $(".phone").val(),
            update_Email_Phone : "",//修改邮箱跟手机号
            username: store.get("username"),
            signature: store.get("signature"),
            random : $(".write_code").val(),
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                var bindNmae = url == "/sendemail" ? "Email" : "Phone";
                showAlert("success bound" + bindNmae+"please log in again");
                goHtml("login.html");
            } else if (data.error_code == 35) {
                goHtml("login.html?Ip=personal_info.html");
            } else if (data.error_code == 5) {
                showAlert("Verification code does not exist!");
                return;
            } else {
                var bindNmae = url == "/sendemail" ? "Email" : "Phone";
                $(".bphone").text(bindNmae + "Incorrect!");
                $("#bind_success").text($(".phone").val());
                $(".dialog_bound_success,.common_mask").show();
            }
        }
    });
});
//修改邮箱手机号
$("#update_bindConfirm").unbind("click").on("click", function () {
    if ($("#update_write_code").val() == "") {
        showAlert("Please enter verification code!");
        return;
    }
    $.ajax({
        url: "/validatecode",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            update_Email_Phone : $("#updatePhone").val(),
            validatausername : $("#updatePhone").val(),//绑定验证
            random : $("#update_write_code").val(),
            username : store.get("username"),
            boundEmail : $("#updatePhone").val(),
            signature: store.get("signature")
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                var bindNmae = url == "/sendupdateemail" ? "Email" : "Phone";
                showAlert("success bound" + bindNmae+"please log in again");
                //修改成功后跳转至登录也
                goHtml("login.html");
            } else if (data.error_code == 35) {
                goHtml("login.html?Ip=personal_info.html");
            } else if (data.error_code == 5) {
                showAlert("Incorrect verification code!");
                return;
            } else {
                var bindNmae = url == "/sendemail" ? "Email" : "Phone";
                $(".bphone").text(bindNmae + "Incorrect!");
                $("#bind_success").text($(".phone").val());
                $(".dialog_bound_success,.common_mask").show();
            }
        }
    });
});

function msgInterval() {
    // 倒计时结束
    if (interval == 0) {
        interval = 60;
        $(".get_code").removeAttr("disabled");
        $(".get_code").text("Get verification code");
        $(".get_code").css("color", "#ffffff");
        $(".get_code").css("background-color", "#0795D4");
        canClickSendMobileCode();
        window.clearInterval(timer);
    } else {
        $(".get_code").attr("disabled", "disabled");
        $(".get_code").unbind("click");
        $(".get_code").css("color", "#999");
        $(".get_code").css("background-color", "#DDD");
        if (isNaN(interval) || isNaN(interval - 1)) {
            $(".get_code").val("Obtain" + url + "Code");
        } else {
            interval = interval - 1;
            $(".get_code").text(interval + "seconds resend");
        }
    }
}


function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}


$(function () {
    loadAccount();
    getICORecord();
    canClickSendMobileCode();
    $("#nicknameConfirm").unbind("click").on("click", function () {
        updateNickname();
    });
});