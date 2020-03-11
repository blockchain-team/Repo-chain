var menuId = getUrlParam("id");
var username = store.get("username");
var signature = store.get("signature");
if(!username  || !signature){
    //登录提示
    location="/en/login.html";
}
$(function () {

    $("#toEdit").on("click",function () {
        location=$(this).attr("span-href");
    })
    $(".error_pagr").on("click",function () {
        loadAccount();
    })
    /**
     * 加载个人资料
     */
   $.ajax({
        url:"/relateme/userInfo",
        type:"POST",
        data:{
            username: username,
            signature: signature,

        },
        success:function (data) {
            if(data.error_code!=0){
                if(data.error_code==35){
                    showAlert("Login timeout Please log in again!");
                    goHtml("/en/login.html?lp=account_view.html");
                }else {
                    showAlert("Fail in loading the digital asset");
                }
                return ;
            }
            $("#userName").text(data.data.loginName);
            $("#img_avatar").attr("src",data.data.imgUrl?data.data.imgUrl:"img/default_personal_pic.png");
            $("#icon_paypwd").addClass(data.data.is_play_pwd=="1"?"":"colord");
            $("#icon_mobile").addClass(data.data.is_mobile=="1"?"":"colord");
            $("#icon_email").addClass(data.data.is_email=="1"?"":"colord");
            $("#nowDate").text(data.data.lastUpdateTime);


        }

    });

    /**
     * 加载ACC本币总数
     */
    $.ajax({
        url:"/relateme/accSumCount",
        type:"POST",
        data:{
            username: username,
            signature: signature,

        },
        success:function (data) {
           if(data.error_code!=0){
               if(data.error_code==35){
                   showAlert("Login timeout Please log in again!");
                   goHtml("/en/login.html?lp=account_view.html");
               }else {
                   showAlert("Fail in loading the digital asset");
               }
               return;
           }
            $("#acc_amount").text(data.data);

        }

    })
    /**
     * 加载ACC本币总数
     */
    $.ajax({
        url:"/relateme/SumCategoryList",
        type:"POST",
        data:{
            username: username,
            signature: signature,

        },
        success:function (data) {
            if(data.error_code!=0){
                if(data.error_code==35){
                    showAlert("Login timeout Please log in again!");
                    goHtml("/en/login.html?lp=account_view.html");
                }else {
                    showAlert("Fail in loading the digital asset");
                }
                return;
            }
            var html="";
            $.each(data.data,function (index,item) {
                html+='<div class="fl acc acc_type"><img id="img_avatar" src="'+getImg(item.category)+'" alt="" class="user_img fl"/><div class="fl">' +
                    '<p class="zc_word"><span class="accname ml20">'+item.category+'</span></p> <p class="zc_word cyzl_word">' +
                    '<span class="accnumber ml20">'+item.categorySum+'</span>Coins</p></div><div class="clear"></div></div>'
            })
            $("#clearfix_item").html(html);
        }

    })

    /**
     * 加载ACC本币总数
     */
    $.ajax({
        url:"/relateme/dynamicList",
        type:"POST",
        data:{
            username: username,
            signature: signature,

        },
        success:function (data) {
            if(data.error_code!=0){
                if(data.error_code==35){
                    showAlert("Login timeout Please log in again!");
                    goHtml("/en/login.html?lp=account_view.html");
                }else {
                    showAlert("Fail in loading the digital asset");
                }
                return;
            }
            var html='<tr><th>Time</th><th>Events</th><th>Name</th><th>Note</th></tr>';
            $.each(data.data,function (index,item) {
                html+='<tr><td>'+item.createTime+'</td><td>'+item.enType+'</td><td>'+item.currencyName+'</td><td>'+item.enRemarks+'</td></tr>'
            })
            $("#ico_record").html(html);
        }

    })


})

//获取账号信息
function loadAccount() {
    /* var username = store.get("username");
     var signature = store.get("signature");*/

    if (username && signature) {
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
                    //是否设置安全问题
                    if (data.safetyQuestion != "true") {
                        showPageAlert("You haven’t set your security questions !");
                        $("#toEdit").attr("span-href","safety_problem.html");
                        return;
                    }

                    if(data.setPayPwd!="true"){
                        showPageAlert("You haven’t set your  transaction password!");
                        $("#toEdit").attr("span-href","set_trade_pwd.html");
                        return;
                    }
                    location="transfer_out_assets.html";
                }
                else if (data.error_code == 35) {
                    showAlert("Login timeout Please log in again!");
                    goHtml("login.html?lp=account_view.html");
                }
            }
        });
    } else {
        showAlert("Login timeout Please log in again!");
        goHtml("login.html?lp=account_view.html");
    }
}
function showPageAlert(text){
    $("#error_msg").text(text);
    $(".dialog_init1,.mask").show();
}

function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.mask").show();
}
//通用跳转页面
function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}