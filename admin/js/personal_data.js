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
                    showAlert("登录超时 请重新登录");
                    goHtml("login.html?lp=personal_data.html");
                }else {
                    showAlert("加载失败!");
                    goHtml("login.html");
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
            $("#sex").text(data.data.sex=='1'?"男":(data.data.sex=='2'?"女":"保密"));

           var culture="";
           $("#culture").attr("data-value",data.data.culture);
           switch (data.data.culture){
               case "1":
                    culture="博士";
                    break;
               case "2":
                   culture="硕士";
                   break;
               case "3":
                   culture="本科";
                   break;
               case "4":
                   culture="高中及以下";
                   break;
           }
            $("#culture").text(culture);

            $("#marriage").attr("data-value",data.data.marriage);
            $("#marriage").text(data.data.marriage==undefined?"":(data.data.marriage=='1'?"已婚":"未婚"));
            $("#car_buying").attr("data-value",data.data.car_buying);
            $("#car_buying").text(data.data.car_buying==undefined?"":(data.data.car_buying=='1'?"已购车":"未购车"));
            $("#purchase").attr("data-value",data.data.purchase);
            $("#purchase").text(data.data.purchase==undefined?"":(data.data.purchase=='1'?"已购房":"未购房"));
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

    $("#nickName").on("change",function () {

        var nickName=$.trim($("#nickName").val());
        if(nickName){
            if(/\s+/g.test($("#nickName").val())){
                return closeAlert("昵称不能输入空格");
            }
            if($("#nickName").val().length>20){
                return closeAlert("昵称不能过长");
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
                            showAlert("昵称已存在!");
                            return;
                        }
                    }
                }
            })
        }
    })

    $("#personal_pic_file").on("change",function () {
        imgUpload("modify_banner_typeForm","imgUrl");
    });
    $("#nickName").on("change",function () {
        if($.trim($(this).val()).length>20){
          //  $(this).val($.trim($(this).val()).substr(0,7));
            return closeAlert("昵称不能过长");
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
            return showAlert("昵称不能输入空格");
        }
        if($("#nickName").val().length>20){
            return showAlert("昵称不能过长");
        }
        var year=$("#year").text();
        var mon=+$("#mon").text();
        var day=$("#day").text();
        var birthday=null;
      /*  year='';
        mon='';
        day='';*/
        if(year && mon && day)birthday=year+"-"+mon+"-"+day;

        $.ajax({
            url:"/relateme/user/save",
            data:{
                username:username,
                signature:signature,
                nickName:$("#nickName").val(),
                imgUrl:$("#imgUrl").val(),
                province:$("#province").text()=='请选择省'?"":$("#province").text(),
                city:$("#city").text()=='请选择市'?"":$("#city").text(),
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
                        showAlert("登录超时 请重新登录");
                        goHtml("login.html?lp=personal_data.html");
                    }else if(data.error_code==252){
                        showAlert("昵称已存在!");
                    }else if(data.error_code==55){
                        showAlert("用户名不存在!");
                        goHtml("login.html?lp=personal_data.html")
                    }else{
                        showAlert("保存失败!");
                        goHtml("personal_data.html");
                    }
                    return ;
                }
                showAlert("保存成功!");
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
                showAlert("登录超时，请重新登录！");
                window.location.href = "login.html?lp=personal_data.html";
            } else if (data.error_code == 16) {
                showAlert("当前用户无操作权限");
            } else if (data.error_code == 37) {
                showAlert("图片格式有误,请选择JPEG,JPG,PNG,BMP等格式文件！");
            } else if (data.error_code == 250) {
                showAlert("服务器异常 操作失败");
            } else {
                showAlert("未知异常 操作失败");
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