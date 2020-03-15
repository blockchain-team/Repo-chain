//ICO参与记录
var pageIndex = 1;
var totalPageCount = 0;

function getICORecord(){
    var username = store.get("username");
    var signature = store.get("signature");

    if(username == "" || signature == "" || username == undefined || signature == undefined){
        //登录提示
        $("#alert_info").text("请登录!");
        $(".dialog_init").show();
        $(".mask").show();
        goHtml("login.html?lp=ico_acc_record.html");
        return;
    }

    var category = $(".transfer_text").attr("data-value");
    var currency = $(".attend_text").attr("data-value");

    $.ajax({
        type: "post",
        url: "/user/getICORecord",
        async : false,
        processDate: true,
        data: {
            pageIndex : pageIndex,
            username : username,
            signature : signature,
            category : category,
            currency : currency,
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0){
                var transactions = data.transactions;
                totalPageCount = data.totalPageCount;

                $(".transactions").remove();
                $.each(transactions,function(i,item){
                    var transaction = $('<tr class=transactions id=record'+item.id+'><td>'+item.create_time+'</td><td>'+item.ico_name+'</td><td><a class="go_detail" href=acc_ico.html?id='+item.user_id+'&category='+item.category+'>'+item.to_addr+'</a></td><td>'+item.transaction_value+item.currency+'</td><td>'+item.acc+'</td><td class=ico_status></td></tr></a>');
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

                    /*if(item.category == "RET"){
                        $("#record"+item.id+" .go_detail").attr("href","ret_record_detail.html?id="+item.user_id);
                    }*/
                });
            }
            else if(data.error_code == 35){
                $("#alert_info").text("登录超时 请重新登录!");
                $(".dialog_init").show();
                $(".mask").show();
                goHtml("login.html?lp=ico_acc_record.html");
            }
            else{
                $("#alert_info").text("参数错误 数据获取失败!");
                $(".dialog_init").show();
                $(".mask").show();
            }
        }
    });
}

//加载页码按钮
function getPageButton(){
      $(".order_pages").text("");
      $(".order_pages").append("<div class='tcdPageCode'></div>");
      //绑定页码按钮点击事件
      $(".tcdPageCode").createPage({
          pageCount:totalPageCount,
          current:pageIndex,
          backFn:function(p){
              pageIndex = p;
              getICORecord();
          }
      });
}


function goHtml(html){
    $(".close_icon").click(function(){
        window.location.href = html;
    });
}

$(function(){
    getICORecord();

    if(totalPageCount > 1){
        getPageButton();
    }

    $("#search").click(function(){
        pageIndex = 1;
        getICORecord();
        getPageButton();
    });

})