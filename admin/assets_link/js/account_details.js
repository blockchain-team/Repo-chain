//获取url后面的参数
var offset=0;
var limit=10;
var address="";
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    return r != null?decodeURI(r[2]):"";
}
$(function () {

    address=getUrlParam("adress");
    $("#listView").html("");
    loadaccount({address:address});

    //滑轮事件
    $(document).on('mousewheel', function(event) {
        var scrollTop = $(window).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(window).height();
        if (scrollTop + windowHeight >= scrollHeight){
            if (event.deltaY < 0){
                offset+=10;
                loadaccount({
                    address:address,
                    offset:offset,
                    limit:limit
                })
            }
        }
    });
    $("#show_msg").on("click",function () {
        offset+=10;
        loadaccount({
            address:address,
            offset:offset,
            limit:limit
        })
    });

    $("#accountType").on("click",function () {
        $.ajax({
            url:"/blockTrad/accounType",
            data:{address:address},
            type:"POST",
            success:function (data) {
                if (data.error_code!=0){
                    if (data.error_code==1){
                        showAlert("查询异常");
                        return;
                    }
                }
                if(data.data.balances.length==0){
                    return showAlert("无其他资产!");
                }else {
                    var str=""
                    $.each(data.data.balances,function (index,item) {
                        str+='<li><span>'+item.currency+'</span><span>'+item.balance+'</span></li>'
                    });
                    $("#listType").html(str);
                    $(".multi_currency").show();
                    $(".mask").show();
                }

            }

        })

    })


})



function showAlert(content,href){
    $("#alert_info").text(content);
    $(".dialog_init").show();
    $(".mask").show();
    $(".close_icon").click(function(){
        $(".mask").hide();
        $(".dialog_init").hide();
        if(href)
        location="blocks_data.html";
    });
}
function loadaccount(json) {
    $.ajax({
        url:"/blockTrad/accountInfo",
        type:"POST",
        data:json,
        success:function (data) {
            if(data.error_code!=0){
                if(data.error_code==1)
                    showAlert("地址不存在!",3);

                return;
            }
            $("#sid").text(data.data.address);
            //$("#sid").data("href","account_details.html?adress="+data.data.address)
            $("#addresss").attr("href","account_details.html?adress="+data.data.address);
            $("#address").text(data.data.address);
            $("#address").data("href","account_details.html?adress="+data.data.address);
            $("#publicKey").text(data.data.publicKey);
            $("#unconfirmedBalance").text(0+" ACC");
            $("#balance").text(data.data.balance+" ACC ");
            $("#countTrading").text(data.data.countTrading);
            $("#totalBalance").text(data.data.height);
            $("#totalBalance").data("href","blocks_detail.html?height="+data.data.height);


            var str="";
            $("#no_data").hide();
            if (data.data.tradingList.length<=0){
                $("#no_data").show();
                $("#show_msg").off("click")
                $(document).off("mousewheel");
                $("#show_msg").text("没有更多了!")
                if($("#listView ul li").children().length>0)$("#no_data").hide();
                else $("#no_data").show();

            }
            for (var i=data.data.tradingList.length-1;i>=0;i--){
                var item=data.data.tradingList[i];
                var type=item.currency?item.currency:"ACC";
                var img="img/data_arrow_green.png";
                var acc=item.amount;
                if (item.recipientId!=data.data.address){//转出
                     img="img/data_arrow_red.png";
                   //  acc=item.amount==0?item.amount:'-'+item.amount;

                }
                var style="";
                if(item.recipientId!=data.data.address)style="background-color:#e83a3a;";
                var classb="";
                if(item.recipientId!="System")classb="topage main_blue";

                str+='<ul class="trans_data" >' +
                    '<li><a><span class="data_id topage" data-href="transaction_record.html?id='+item.id+'">'+item.id+'</span></a><span class="data_time fr">'+AschJS.utils.format.fullTimestamp(item.timestamp)+'</span><span class="data_num fr">{交易费：<em>'+item.fee+'ACC</em>}</span></li>' +
                    '<li class="td_info clearfix"><span class="fl"><p><em class="main_blue topage" data-href="account_details.html?adress='+item.senderId+'">'+item.senderId+'</em></p></span><span class="fl td_img relative"><img src="'+img+'" alt="" class="fl"/> <em>('+acc+type+')</em></span><span class="fl tdi_txt"><p><em class="'+classb+'" data-href="account_details.html?adress='+item.recipientId+'">'+item.recipientId+'</em></p></span></li>' +
                    '<p class="clearfix"><span class="fr"  style="'+style+'">'+acc+ type+'</span><span class="fr"><em>'+item.confirmations+'</em>确认</span></p></ul>'

          /*      str+= ' <ul class="trans_data">' +
                    '<li><a><span class="data_id topage" data-href="transaction_record.html?id='+item.id+'">'+item.id+'</span></a><span class="data_time fr">'+AschJS.utils.format.fullTimestamp(item.timestamp)+'</span><span class="data_num fr">{交易费：<em>'+item.fee+' ACC</em>}</span> </li> ' +
                    '<li class="td_info clearfix"><span class="fl"> <p><em class="main_blue topage" data-href="account_details.html?adress='+item.senderId+'">'+item.senderId+'</em><em>('+acc+type+')</em></p> </span> <img src="'+img+'" alt="" class="fl"/> <span class="fl tdi_txt"> <p><em class="'+classb+'" data-href="account_details.html?adress='+item.recipientId+'">'+item.recipientId+'</em><em class="fr">'+item.amount+' '+type+' </em></p> </span> </li>' +
                    '<p class="clearfix"> <span class="fr" style="'+style+'">'+acc+' '+type+'</span> <span class="fr"><em>'+item.confirmations+'</em>确认</span> </p> ' +
                    '</ul>';*/
               // if(item.recipientId!=data.data.address)$(".red").attr("style","background-color:#e83a3a");

            }
            $("#listView").append(str);
            if(item.recipientId!=data.data.address)$("#"+item.id).attr("style","background-color:#e83a3a");
            //console.log($("#listView ul li").children().length);

            if($("#listView ul li").children().length>0)$("#no_data").hide();
            $(".topage").css({
                cursor: "pointer"
            })

            $(".topage").on("click",function () {
                location=$(this).data("href");
            })


        }
    })
}