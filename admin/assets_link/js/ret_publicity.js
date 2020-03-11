//记录用户首次查看RET专题页面

//设置RET页面查看状态
function setCheckStatus(){
    $.ajax({
        type: "post",
        url: "/user/setRetCheckStatus",
        processDate: true,
        data: {

        },
        dataType: 'json',
        success: function(data) {

        }
    })
}

//获取RET页面查看状态
function getCheckStatus(){
    $.ajax({
        type: "post",
        url: "/user/getCommonUserInfo",
        processDate: true,
        data: {

        },
        dataType: 'json',
        success: function(data) {
            if(data.browseRet == "false"){
                $(".ret_dialog").show();
                $(".mask").show();
                $("#agree").click(function(){
                    $(".ret_dialog").hide();
                    $(".mask").hide();
                });
                $("#noagree").click(function(){
                    self.location.href = document.referrer;
                });
            }
        }
    })
}


$(function(){
    $(".ret_dialog").show();
    $(".mask").show();
    $("#agree").click(function(){
        $(".ret_dialog").hide();
        $(".mask").hide();
    });
    $("#noagree").click(function(){
        self.location.href = document.referrer;
    });
})