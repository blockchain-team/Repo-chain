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
    $(".get_code").val(interval + "秒后重发");
    timer = window.setInterval("msgInterval();", 1000);
}

function loadAccount() {
    var username = store.get("username");
    var signature = store.get("signature");
    if(username != "" && signature != "" && username != undefined && signature != undefined){
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
                        var account = $('<li><span>'+item.category+'</span><span class="dig_count">'+item.account_balance+'</span><a href=javascript:void(0);><span class="tra_btn">转出</span></a></li>');
                        $("#dig_list").append(account);
                    }
                });
                if(data.safetyQuestion == "true"){
                    $("#Unset").removeClass("fr red_warn").addClass("fr green_warn");
                    $("#Unset").text("已设置");
                    $("#Unset").unbind("click");
                }
                if (data.email != undefined) {
                    $(".accountEmail").text(data.email);
                    $("#bound").removeClass("fr red_warn").addClass("fr green_warn");
                    $("#bound").text("已绑定");
                } else {
                    $("#bound").removeClass("fr green_warn").addClass("fr red_warn");
                    $("#bound").text("未绑定");
                    $("#bound").unbind("click").on("click", function () {
                        $("#updatePhone,#update_write_code").val("");
                        $("#PhoneOrEmail").text("邮箱");
                        $("#is_bind").text("绑定邮箱");
                        $('.mask,#bindPhone').show();
                        url = "/sendemail";
                    });
                }
                if (data.login_name != undefined) {
                    $(".accountPhone").text(data.login_name);
                    $("#Unbound").removeClass("fr red_warn").addClass("fr green_warn");
                    $("#Unbound").text("已绑定");
                }
            }
            else if(data.error_code == 35){
                store.clear();
                showAlert("登录超时 请重新登录!");
                goHtml("login.html?lp=personal_info.html");
            }
            else {
                store.clear();
                goHtml("login.html?lp=personal_info.html");
            }
            $(".phone,.write_code").val("");//刷新成功后清空输入框
        }
    });
    }else{
        showAlert("请登录!");
        goHtml("login.html?lp=personal_info.html");
    }
}

//获取ICO参与记录
function getICORecord(){
    var username = store.get("username");
    var signature = store.get("signature");
    if(username == "" || signature == "" || username == undefined || signature == undefined){
        //登录提示
        showAlert("请登录!");
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
                        $("#record"+item.id+" .ico_status").text("公示期");
                        $("#record"+item.id+" .ico_status").addClass("blue_warn");
                    }
                    else if(item.status == 1){
                        $("#record"+item.id+" .ico_status").text("进行中");
                    }
                    else if(item.status == 2){
                        $("#record"+item.id+" .ico_status").text("已结束");
                    }

                    if(item.category == "RET"){
                        $("#record"+item.id+" .go_detail").attr("href","ret_record_detail.html?id="+item.user_id);
                    }
                });
            }
            else if(data.error_code == 35){
                showAlert("登录超时 请重新登录!");
                goHtml("login.html?lp=ico_record.html");
            }
            else{
                showAlert("参数错误 数据获取失败!");
            }
        }
    });
}


function updateNickname() {//昵称修改
    var get_name = $(".get_name").text();
    var nickname = $(".alter_name").val();
    if (nickname == "") {
        showAlert("昵称不能为空!");
        return;
    };
    console.log(get_name == nickname);
    if(get_name == nickname) {
        showAlert("修改昵称与被修改昵称不能相同!");
        return;
    };
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
                showAlert("修改失败!")
                return;
            } else if(data.error_code == 39){
                showAlert("该昵称已被使用,请更换!");
            } else {
                showAlert("修改昵称成功!");
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
                showAlert("邮箱格式有误，请填写正确的邮箱号!");
                return;
            }
        } else if (url == "/sendinformation") {
            r_reason = "register";
            if (!$(".phone").val().match(regPhone)) {
                showAlert("手机号格式有误，请填写正确的手机号!");
                return;
            }
        }
        $.ajax({
            url: url,
            type: 'POST',
            async: false,
            processDate: true,
            data: {
                username: $(".phone").val(),
                is_bind: "true",
                r_reason: r_reason,
                category : "绑定"
            },
            dataType: 'json',
            success: function (data) {
                if (data.error_code == 1) {
                    showAlert("参数错误,请联系客服处理!");
                    return;
                } else if (data.error_code == 0) {
                    var success = url == "/sendemail" ? "发送邮件成功" : "发送短信成功";
                    showAlert(success);
                } else if (data.error_code == 204) {
                    showAlert("此手机号已绑定!");
                    return;
                } else if (data.error_code == 207) {
                    showAlert("此邮箱已绑定!");
                    return;
                } else {
                    showAlert("验证码发送失败!");
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
        showAlert("请填写验证码!");
        return;
    }
    $.ajax({
        url: "/validatecode",
        type: 'POST',
        async: false,
        processDate: true,
        data: {
            username: store.get("username"),
            signature: store.get("signature"),
            validatausername: $(".phone").val(),
            update_Email_Phone : "",//修改邮箱跟手机号
            random : $(".write_code").val(),
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                var bindNmae = url == "/sendemail" ? "邮箱" : "手机";
                showAlert("您已成功绑定" + bindNmae+"请重新登录");
                //绑定成功后跳转至登录也
                goHtml("login.html");
                /*//绑定成功后情况所有的绑定事件
                $(".get_code,#bound,#unbound").unbind("click");
                $(".get_code").css("color", "#999");
                $(".get_code").css("background-color", "#DDD");
                $(".get_code").text("获取验证码");
                window.clearInterval(timer);
                loadAccount();*/
            } else if (data.error_code == 35) {
                goHtml("login.html?Ip=personal_info.html");
            } else if (data.error_code == 5) {
                showAlert("验证码有误!");
                return;
            } else {
                var bindNmae = url == "/sendemail" ? "邮箱" : "手机";
                $(".bphone").text(bindNmae + "输入有误!");
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
        $(".get_code").text("获取验证码");
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
            $(".get_code").val("获取" + url + "验证码");
        } else {
            interval = interval - 1;
            $(".get_code").text(interval + "秒后重发");
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