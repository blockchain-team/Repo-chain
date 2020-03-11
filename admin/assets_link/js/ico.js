//ico相关数据拉取

function getIcoInfo(){
    var username = store.get("username");
    var signature = store.get("signature");

    /*if(username == "" || signature == "" || username == undefined || signature == undefined){
        //登录提示
        $("#alert_info").text("请登录!");
        $(".dialog_init,.mask").show();
        goHtml("login.html?lp=ico.html");
        return;
    }*/

    $.ajax({
        type: "post",
        url: "/user/getHistoryIcoInfo",
        processDate: true,
        data: {
            username : username,
            signature : signature,
            category : "ACC",
            endTime : "2017-06-06",
            startTime : "2017-05-09 18:00:00"
        },
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                //进度条
                $('#sample_goal').goalProgress({
                    goalAmount: 100000000,
                    currentAmount: data.tokenAmount,
                });
                var gather_amount = (($(".progressBar").text()/100000000) * 100).toFixed(4) + "%";
                $(".gather_amount span").text(gather_amount);
                $(".progressBar").text(" ");

                $("#remaining").text(data.remaining);
                $("#btc_amount").text(data.btcIcoAmount);
                $("#etc_amount").text(data.etcIcoAmount);
                $("#btc_join_count").text(data.btcJoinCount);
                $("#etc_join_count").text(data.etcJoinCount);

                var brcRanking = data.btcRankingList;
                $(".btc_ranking").remove();
                $.each(brcRanking,function(i,item){
                    var ranking = $('<ul class=btc_ranking ><li>'+item.ranking+'</li><li>'+item.addrerss+'</li><li>'+item.amount+'</li></ul>');
                    $("#btc_ranking").append(ranking);
                });

                var ercRanking = data.ectRankingList;
                $(".etc_ranking").remove();
                $.each(ercRanking,function(i,item){
                    var ranking = $('<ul class=etc_ranking ><li>'+item.ranking+'</li><li>'+item.addrerss+'</li><li>'+item.amount+'</li></ul>');
                    $("#etc_ranking").append(ranking);
                });

                $("#join_btc").click(function(){
                    $("#address_code").empty();
                    new QRCode(document.getElementById("address_code"), data.btcAddress);
                    $("#address_input").val(data.btcAddress);
                    $("#currency").text("BTC");
                    $(".address_dialog").show();
                    $(".mask").show();
                });

                $("#join_etc").click(function(){
                    $("#address_code").empty();
                    new QRCode(document.getElementById("address_code"), data.etcAddress);
                    $("#address_input").val(data.etcAddress);
                    $("#currency").text("ETH");
                    $(".address_dialog").show();
                    $(".mask").show();
                });

            }
            else if(data.error_code == 15){
                $("#alert_info").text("账号不存在!");
                $(".dialog_init,.mask").show();
            }
            else if(data.error_code == 37){
                $("#alert_info").text("众筹地址异常!");
                $(".dialog_init,.mask").show();
            }
            else if(data.error_code == 35){
                $("#alert_info").text("登录超时 请重新登录!");
                $(".dialog_init,.mask").show();
                goHtml("login.html?lp=ico.html")
            }else{
                $("#alert_info").text("参数异常 数据获取失败!");
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
    getIcoInfo();


    //关闭地址二维码弹窗
    $(".close_icon,.btn").click(function(){
        $(".address_dialog").hide();
        $(".dialog_init").hide();
        $(".mask").hide();
    });
})