var username = store.get("username");
var signature = store.get("signature");

//ico修改密码
function changepassword() {
    var oidpassword = $(".oidPassword").val();
    var newpassword = $(".newPassword").val();
    var confirmpassword = $(".confirmPassword").val();

    if (oidpassword == "") {
        showAlert("Please enter current password!");
        return;
    };
    if (newpassword == "") {
        showAlert("Please enter new password!");
        return;
    };
    if (confirmpassword == "") {
        showAlert("Please confirm new password!");
        return;
    };
    if (confirmpassword != newpassword) {
        showAlert("Passwords do not match, please re-enter!");
        return;
    };
    if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(newpassword)){
        showAlert("Password should be 6-12 characters including letters and numbers!");
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
                showAlert("Modify password successfully!");
                store.clear();
                goHtml("login.html");
            } else if (data.error_code == 10) {
                showAlert("Current password is incorrect, please check and try again!");
                return;
            } else if (data.error_code == 35) {
                showAlert("Login timeout, please re-log in!");
                location.href = "index.html";
            } else if (data.error_code == 200) {
                showAlert("Passwords do not match, please re-enter!");
                $(".dialog_init,.common_mask").show();
                return;
            } else if (data.error_code == 201) {
                showAlert("New password cannot be the same as current password, please try again!");
                $(".dialog_init,.common_mask").show();
                return;
            } else {
                showAlert("Failed to modify password!");
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
