//RET ICO详情排名

//获取众筹详情
function getCrowdInfo(){
    var username = store.get("username");
    var signature = store.get("signature");

    if(username == "" || signature == "" || username == undefined || signature == undefined){
        //登录提示
        $("#alert_info").text("Please log in!");
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
            category : "RET"
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                $("#BTC_addr").text(data.btcIcoAddress);
                $("#BTC_value").text(data.icoBtcValue+"BTC");
                $("#BTC_ranking").text(data.icoBtcRanking);
                $("#ETC_addr").text(data.etcIcoAddress);
                $("#ETC_value").text(data.icoEtcValue+"ETH");
                $("#ETC_ranking").text(data.icoEtcRanking);
                $("#ACC_addr").text(data.accIcoAddress);
                $("#ACC_value").text(data.icoAccValue+"ACC");
                $("#ACC_ranking").text(data.icoAccRanking);
                new QRCode(document.getElementById("BTC_qrcode"), data.btcIcoAddress);
                new QRCode(document.getElementById("ETC_qrcode"), data.etcIcoAddress);
                new QRCode(document.getElementById("ACC_qrcode"), data.accIcoAddress);
            }
            else if(data.error_code == 37){
                $("#alert_info").text("Abnormal address!");
                $(".dialog_init,.mask").show();
            }
            else if(data.error_code == 35){
                $("#alert_info").text("Login timeout Please log in again!");
                $(".dialog_init,.mask").show();
                goHtml("login.html?lp=ico_record.html")
            }else{
                $("#alert_info").text("Parameter error data acquisition failed!");
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
            category : "RET"
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                var transactionList = data.transactions;
                if(transactionList.length < 1){
                    $("#alert_info").text("No confirm transaction in this address!");
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
                $("#alert_info").text("Parameter error data acquisition failed!");
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

    $("#btc_transactions").click(function(){
        getTransactionForAddress($("#BTC_addr").text(),"BTC");
    });

    $("#etc_transactions").click(function(){
        getTransactionForAddress($("#ETC_addr").text(),"ETH");
    });

    $("#acc_transactions").click(function(){
        getTransactionForAddress($("#ACC_addr").text(),"ACC");
    });
})