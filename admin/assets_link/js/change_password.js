var username = store.get("username");
var signature = store.get("signature");

//ico修改密码
function changepassword() {
    var oidpassword = $(".oidPassword").val();
    var newpassword = $(".newPassword").val();
    var confirmpassword = $(".confirmPassword").val();

    if (oidpassword == "") {
        showAlert("请输入旧密码!");
        return;
    };
    if (newpassword == "") {
        showAlert("请输入新密码!");
        return;
    };
    if (confirmpassword == "") {
        showAlert("请输入确认密码!");
        return;
    };
    if (confirmpassword != newpassword) {
        showAlert("新密码与确认密码不一致，请重新输入!");
        return;
    };
    if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(newpassword)){
        showAlert("密码必须包含数字和字母,长度6-12位!");
        return;
    }
    $.ajax({
        url: "/changepassword",
        type: 'POST',
        processDate: true,
        data: {
            username : store.get("username"),
            signature : store.get("signature"),
            oidpassword : oidpassword,
            newpassword : $.md5($.trim(newpassword)),
            confirmpassword : $.md5($.trim(confirmpassword))
        },
        dataType: 'json',
        success: function (data) {
            if (data.error_code == 0) {
                showAlert("修改密码成功!");
                store.clear();
                goHtml("login.html");
            } else if (data.error_code == 10) {
                showAlert("旧密码错误,请输入正确的旧密码!");
                return;
            } else if (data.error_code == 35) {
                showAlert("登录超时,请重新登录!");
                location.href = "index.html";
            } else if (data.error_code == 200) {
                showAlert("新密码与确认密码不一致，请重新输入!");
                $(".dialog_init,.common_mask").show();
                return;
            } else if (data.error_code == 201) {
                showAlert("旧密码与新密码需不一致,请确认!");
                $(".dialog_init,.common_mask").show();
                return;
            } else {
                showAlert("修改密码失败!");
                return;
            }
        }
    });
}

function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}

// 刷新页面判断是否登录超时
function isLogin() {
    if (signature == "" || signature == undefined) {
        $(".dialog_log,.mask").show();
        return;
    } else {
        $.ajax({
            url: "/safeLogincontroller",
            type: 'POST',
            processDate: true,
            async: false,
            data: {
                username: username,
                signature: signature
            },
            dataType: 'json',
            success: function (data) {
                if(data.error_code == 35 || data.error_code == 15 || data.error_code == 55){
                    loginOvertime('login.html?lp=' + GetUrlRelativePath());
                }
            }
        });
    }
}

$(function () {
    isLogin();
    $(".btn").unbind("click").on("click", function () {
        changepassword();
    });
});
