//ICO详情排名
var username = store.get("username");
var signature = store.get("signature");
var category = getUrlParam("category");

//获取众筹详情
function getCrowdInfo(){

    if(username == "" || signature == "" || username == undefined || signature == undefined){
        //登录提示
        $("#alert_info").text("请登录!");
        $(".dialog_init,.mask").show();
        goHtml("login.html?lp=ico_record.html");
        return;
    }

    $.ajax({
        type: "post",
        url: "/user/getICORanking",
        async : false,
        processDate: true,
        data: {
            username : username,
            signature : signature,
            category : category
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                $.each($.parseJSON(data.rankings),function (i,item) {
                    if(item.icoAddress != "" && item.icoAddress != undefined){
                        var ranking = $('<ul id="'+item.currency+'"><li>'+(i+1)+'、您参与本次ICO的专属'+item.currency+'地址，所有发往该地址的'+item.currency+'都将计入到您的名下</li><li class="mgleft address" >'+item.icoAddress+'</li>'+
                        '<li class="mgleft wx_code" id="'+item.currency+'_qrcode"></li><li class="mgleft">该地址已经投了 <span class="underline" >'+item.icoValue+item.currency+'</span> &nbsp;&nbsp;&nbsp;&nbsp;<span class="blue_warn" id="'+item.currency+'_transactions">查看详情</span></li><li class="mgleft text">ICO期间所有转入该地址的'+item.currency+'都将记入到您的名下。请从'+item.currency+'交易所、钱包等处向上述'+item.currency+'地址转账。</li></ul>');
                        $("#icoAddresses").append(ranking);

                        $("#ico_category").text(category);
                        new QRCode(document.getElementById(""+item.currency+"_qrcode"),item.icoAddress);
                        $("#"+item.currency+" #"+item.currency+"_transactions").click(function () {
                            getTransactionForAddress(item.icoAddress,item.currency)
                        });
                    }
                });

            }
            else if(data.error_code == 37){
                $("#alert_info").text("众筹地址异常!");
                $(".dialog_init,.mask").show();
            }
            else if(data.error_code == 35){
                $("#alert_info").text("登录超时 请重新登录!");
                $(".dialog_init,.mask").show();
                goHtml("login.html?lp=ico_acc_record.html");
            }else{
                $("#alert_info").text("参数异常 数据获取失败!");
                $(".dialog_init,.mask").show();
            }
        }
    });
}


function getTransactionForAddress(address,currency){
    var username = store.get("username");
    var signature = store.get("signature");
    $.ajax({
        type: "post",
        url: "/user/getTransactionForAddress",
        async : false,
        processDate: true,
        data: {
            username : username,
            signature : signature,
            address : address,
            currency : currency,
            category : category
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                var transactionList = data.transactions;
                if(transactionList.length < 1){
                    $("#alert_info").text("当前地址无确认的交易!");
                    $(".dialog_init,.mask").show();
                    return;
                }

                $("#tran_num").text(transactionList.length);
                $(".deal_list").empty();
                $.each(transactionList,function(i,item){
                    if(item.currency == currency){
                        var tran = $('<ul><li>'+item.transaction_hash+'</li><li>'+item.from_addr+'</li><li>'+item.transaction_value+'</li><li>'+item.create_time+'</li></ul>');
                        $(".deal_list").append(tran);
                    }

                    $(".dialog_blocks,.mask").show();
                });
            }else{
                $("#alert_info").text("参数异常 获取数据失败!");
                $(".dialog_init,.mask").show();
            }
        }
    });
}


function goHtml(html){
    $(".close_icon").click(function(){
        window.location.href = html;
    });
}


$(function(){
    getCrowdInfo();
})