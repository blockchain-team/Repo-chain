//ICO列表数据动态获取
function getIcoList(){
    $.ajax({
        type: "post",
        url: "/user/getIcoList",
        processDate: true,
        data: {

        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                var icoList = data.icoList;
                $("#public").empty();
                $("#process").empty();
                $("#over").empty();

                $.each(icoList,function(i,item){
                    var ico = $('<div class="icobox" id=ico'+item.id+'><a href="'+item.ico_detail_link_en+'" target="_blank"><img src="'+item.img_src+'" alt="'+item.ico_name_en+'"></a><dl><dt>'+item.ico_name_en+'<span class="fr blue_warn status">In Publicity Process</span></dd></dl></div>');

                    if(item.status == 0){
                        $("#public").append(ico);
                        $("#public .status").text("In Publicity Process");
                        $("#ico"+item.id+" .downCount1").downCount({
                            startTime:getNowFormatDate(),
                            endTime:item.start_time
                        });
                    }
                    else if(item.status == 1){
                        $("#process").append(ico);
                        $("#process .status").text("In Process");
                        $("#process .timer_desc").text("ICO Remaining Time");
                        $("#ico"+item.id+" .downCount1").downCount({
                            startTime:getNowFormatDate(),
                            endTime:item.end_time
                        });
                    }else{
                        var ico = $('<div class="icobox"><a href="'+item.ico_detail_link_en+'" target="_blank"><img src="'+item.img_src+'" alt="ico_start"></a><dl><dt>'+item.ico_name_en+'<span class="fr blue_warn">End</span></dt></dl></div>');
                        $("#over").append(ico);
                    }
                })
            }else{
                console.log("Server exception data acquisition failed");
            }
        }
    })
}

//获取当前时间并格式化
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}


$(function(){
    getIcoList();
})