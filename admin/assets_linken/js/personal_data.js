var menuId = getUrlParam("id");
var username = store.get("username");
var signature = store.get("signature");
if(!username  || !signature){
    //登录提示
    location="login.html";
}
$(function () {
    $(".close_icon").on("click",function () {
        $("#alert_info").text('');
        $(".dialog_init,.mask").hide();
    })
    $("#nickName").on("change",function () {

        var nickName=$.trim($("#nickName").val());
        if(nickName){
            if(/\s+/g.test($("#nickName").val())){
                return closeAlert("Enter No SPACE in the nickname.");
            }
            if($("#nickName").val().length>20){
                return closeAlert("Nickname is too long");
            }
            $.ajax({
                url:"/relateme/user/checkNickName",
                data:{
                    username:username,
                    signature:signature,
                    nickName:nickName
                },
                type:"POST",
                success:function (data) {
                    if(data.error_code!=0){
                        if(data.error_code==252){
                            showAlert("The nickname already exists!");

                            $("#nickName").focus();
                        }
                    }
                }
            })
        }
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
                    goHtml("login.html?lp=personal_data.html");
                }else {
                    showAlert("Load failed!");
                }
                return ;
            }
            $("#nickName").val(data.data.nickName);
            //图片
           $("#personal_pic_shown").attr("src",data.data.imgUrl?data.data.imgUrl:"img/default_personal_pic.png");
            $("#imgUrl").val(data.data.imgUrl?data.data.imgUrl:"");

            $("#province").text(data.data.province?data.data.province:"");
            $("#city").text(data.data.city?data.data.city:"");
            $("#sex").attr("data-value",data.data.sex);
            $("#sex").text(data.data.sex=='1'?"Male":(data.data.sex=='2'?"Female":"Privileged"));
           var culture="";
           $("#culture").attr("data-value",data.data.culture);
           switch (data.data.culture){
               case "1":
                    culture="Doctor";
                    break;
               case "2":
                   culture="Master";
                   break;
               case "3":
                   culture="Undergraduate";
                   break;
               case "4":
                   culture="High school";
                   break;
           }
            $("#culture").text(culture);

            $("#marriage").attr("data-value",data.data.marriage);
            $("#marriage").text(data.data.marriage==undefined?"":(data.data.marriage=='1'?"Married":"Unmarried"));
            $("#car_buying").attr("data-value",data.data.car_buying);
            $("#car_buying").text(data.data.car_buying==undefined?"":(data.data.car_buying=='1'?"Yes":"No"));
            $("#purchase").attr("data-value",data.data.purchase);
            $("#purchase").text(data.data.purchase==undefined?"":(data.data.purchase=='1'?"Yes":"No"));
            var date=data.data.birthday?new Date(data.data.birthday):null;
            if(date){
                $("#year").text(date.getUTCFullYear());
                var mon=date.getMonth()+1;
                $("#mon").text(mon>=10?mon:"0"+mon);
                var day=date.getDate();
                $("#day").text(day>=10?day:"0"+day);
            }
        }

    });
    $("#personal_pic_file").on("change",function () {
        imgUpload("modify_banner_typeForm","imgUrl");
    });
    $("#nickName").on("change",function () {
        if($.trim($(this).val()).length>20){
            return closeAlert("Nickname is too long");
        }
    })
    $("#saveUser").on("click",function () {
       // if()
        /*if(!$.trim($("#province").text()) || $.trim($("#province").text())=='请选择市'){
            return closeAlert("请选择省");
        }
        if(!$.trim($("#city").text()) || $.trim($("#city").text())=='请选择市'){
           return closeAlert("请选择市");
        }*/

        if(/\s+/g.test($("#nickName").val())){
            return closeAlert("Enter No SPACE in the nickname.");
        }
        if($("#nickName").val().length>20){
            return closeAlert("Nickname is too long");
        }
        var year=$("#year").text();
        var mon=+$("#mon").text();
        var day=$("#day").text();
        var birthday=null;
        if(year && mon && day)birthday=year+"-"+mon+"-"+day;
    //    alert($("#purchase").attr("data-value"));
        $.ajax({
            url:"/relateme/user/save",
            data:{
                username:username,
                signature:signature,
                nickName:$("#nickName").val(),
                imgUrl:$("#imgUrl").val(),
                province:"",
                city:"",
                sex:$("#sex").data("value"),
                birthday:birthday,
                culture:$("#culture").attr("data-value"),
                marriage:$("#marriage").attr("data-value"),
                car_buying:$("#car_buying").attr("data-value"),
                purchase:$("#purchase").attr("data-value")
            },
            type:"POST",
            success:function (data) {
                if(data.error_code!=0){
                    if(data.error_code==35){
                        showAlert("Login timeout Please log in again!");
                        goHtml("login.html?lp=personal_data.html");
                    }else if(data.error_code==252){
                        showAlert("The nickname already exists!");
                        $("#nickName").focus();
                    }else if(data.error_code==55){
                        showAlert("Account not found!");
                        goHtml("login.html?lp=personal_data.html")
                    }else {
                        showAlert("Save failed!");
                        goHtml("personal_data.html");
                    }
                    return ;
                }
                showAlert("Saved successfully!");
                if(username == data.data)
                    store.set("username",$("#nickName").val());
                goHtml("personal_data.html");
            }

        })
    })

})
function imgUpload(form, input) {
    $("#" + form).ajaxSubmit({
        url: "/relateme/user/uploadImage",
        type: 'POST',
        processDate: true,
        data: {
            username: username,
            signature: signature,
            menuId: menuId,
            key: "__UPLOADS"
        },
        dataType: 'json',
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            if (data.error_code == 0) {

                $("#" + input).val(data.imgUrls[0]);
            } else if (data.error_code == 35) {
                showAlert("Login timeout Please log in again!");
                goHtml("login.html?lp=personal_data.html");
            } else if (data.error_code == 16) {
                showAlert("The current user has no access rights");
            } else if (data.error_code == 37) {
                showAlert("Select format files such as JPEG, JPG, PNG, BMP, and so on!");
            } else if (data.error_code == 250) {
                showAlert("Server exception  operation failed!");
            } else {
                showAlert("Unknown mistake operation failed!");
            }
        }
    });
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
function closeAlert(text) {
    showAlert(text);
    setTimeout(function () {
        $("#tip_dialog").hide();
    },1500);
}