//ICO详情排名
var username = store.get("username");
var signature = store.get("signature");
var category = getUrlParam("category");

//获取众筹详情
function getCrowdInfo(){

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
            category : category
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                $.each($.parseJSON(data.rankings),function (i,item) {
                    if(item.icoAddress != "" && item.icoAddress != undefined){
                        var ranking = $('<ul id="'+item.currency+'"><li><span class="num">'+(i+1)+'、</span>It is your individual '+item.currency+' transferred address for this ICO, all '+item.currency+' which transfer into this address will be recorded under your name</li>'+
                            '<li class="mgleft address">'+item.icoAddress+'</li><li class="mgleft wx_code" id="'+item.currency+'_qrcode"></li><li class="mgleft">This address has invested <span class="underline">'+item.icoValue+item.currency+' </span> &nbsp;&nbsp;&nbsp;&nbsp;<span class="blue_warn" id="'+item.currency+'_transactions">View details</span></li><li class="mgleft text">In the ICO, the number of '+item.currency+' which transferred into this address will be recorded under your name. Please transfer to the above '+
                            'address form '+item.currency+' exchanges, wallet and other places.</li></ul>');
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
                $("#alert_info").text("Abnormal address!");
                $(".dialog_init,.mask").show();
            }
            else if(data.error_code == 35){
                $("#alert_info").text("Login timeout Please log in again!");
                $(".dialog_init,.mask").show();
                goHtml("login.html?lp=ico_acc_record.html")
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
            category : category
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
})