//英文版
var height=getUrlParam('height');
var offset=0;
var limit=10;
var blockId="";
var load=0;
var totalAmount=0;

function findBlockByHigth() {
    $.ajax({
        type: 'get',
        url: '/blockChain/findBlockChainByHigth',
        processDate: true,
        async:false,
        data:{
            height:height
        },
        dataType: 'json',
        success: function (data) {
            if(data.success){
                blockId=data.block.id;
                $("#ad_titleId").append(data.block.height)
                $("#heightId").append('<a href="blocks_detail.html?height='+data.block.height+'">'+data.block.height+'</a>')
                $("#blockId").text(data.block.id);
                $("#version").text(data.block.version);
                $("#time").text(AschJS.utils.format.fullTimestamp(data.block.timestamp));
                $("#height").text(data.block.height);
                $("#lastBlock").html('<a href="blocks_detail.html?height='+(data.block.height-1)+'">'+data.block.previousBlock+'</a>');
                $("#transactionNumber").text(data.block.numberOfTransactions);

                $("#transactionTotalMoney").html(data.block.totalFee+'&nbsp;ACC');
                /*$("#allDataNum").text(data.block.totalFee);*/
                $("#award").text(data.block.reward);
                $("#abstract").text(data.block.blockSignature);
                $("#producer").html('<a href="account_details.html?adress='+data.block.generatorId+'">'+data.block.generatorId+'</a>');
                $("#producerPublicKey").text(data.block.generatorPublicKey);

                findTransactionsByBlockId(data.block.id,offset,limit);
            }else if(!data.success){
                $("#alert_info").text("The block height you entered does not exist!")
                $(".mask").show();
                $(".dialog_init").show();
                $("#close_iconId").click(function () {
                    window.location.href="blocks_data.html";
                })
            }
        }
    });
}


function findTransactionsByBlockId(blockId,offset,limit) {
    $.ajax({
        type: 'get',
        url: '/blockChain/findTransactionsByBlockId',
        processDate: true,
        async:false,
        data:{
            limit:limit,
            offset:offset,
            blockId:blockId

        },
        dataType: 'json',
        success: function (data) {
            if(data.count=="0"&&data.success){

                var transList=$("#transactionList").append('<div class="no_records_now"><img src="img/no_records_now.png"/></div>')
                $("#transactionList").append(transList);
                $(".show_more_records").hide();

            }else if(data.success){
                //计算交易总额
               /* totalTransactionAmount(blockId,offset,data.count);*/

                if(data.count<=10){
                    $(".show_more_records").text("No More!")
                }
                if(data.success){
                    if(data.count>10){
                        load=1;
                    }
                    if(data.count==0){
                        load=0
                    }
                    $("#transactionList ul").remove();
                    var trans=data.transactions;
                    $.each(trans,function (i,item) {

                        var currency=item.currency==""?"ACC":item.currency;
                        var revicer=""==item.recipientId?"System":item.recipientId;
                        if(item.recipientId==""){
                            /*var transList=$("#transactionList").append('<ul class="trans_data"><li><span class="data_id"><a href="transaction_record.html?id='+item.id+'">'+item.id+'</a></span>'
                                +'<span class="data_time fr">'+AschJS.utils.format.fullTimestamp(item.timestamp).replace('/','-').replace('/','-')+'</span>'
                                +'<span class="data_num fr">{Transaction fee:<em>'+item.fee+'&nbsp;ACC</em>}</span></li>'
                                +'<li class="td_info clearfix"><span class="fl"> <p><em class="main_blue"><a href="account_details.html?adress='+item.senderId+'">'+item.senderId+'</a></em> <em>(0 ACC)</em></p></span>'
                                +' <img src="img/data_arrow_grey.png" alt="" class="fl"/>'
                                +' <span class="fl tdi_txt"> <p><em>'+revicer+'</em><span class="fr"><em class="fr">0'+'&nbsp;'+currency+'</em></span></p>'
                                +' </span></li><p class="clearfix"><span class="fr" >0&nbsp;'+currency+'</span><span class="fr"><em>'+item.confirmations+'</em>&nbsp;Confirm</span>'
                                +'</p></ul>')*/

                            var transList=$("#transactionList").append('<ul class="trans_data" >'
                                +'<li><span class="data_id"><a href="transaction_record.html?id='+item.id+'">'+item.id+'</a></span><span class="data_time fr">'+AschJS.utils.format.fullTimestamp(item.timestamp).replace('/','-').replace('/','-')+'</span>'
                                +'<span class="data_num fr">{Transaction fee:<em>'+item.fee+'&nbsp;ACC</em>}</span></li>'
                                +'<li class="td_info clearfix"><span class="fl"><p><em class="main_blue"><a href="account_details.html?adress='+item.senderId+'">'+item.senderId+'</a></em></p></span>'
                                +'<span class="fl td_img relative"><img src="img/data_arrow_grey.png" alt="" class="fl"/><em>(0ACC)</em></span>'
                                +'<span class="fl tdi_txt"><p><em>'+revicer+'</em></p></span></li><p class="clearfix">'
                                +'<span class="fr">0'+currency+'</span><span class="fr"><em>'+item.confirmations+'</em>Confirm</span></p></ul>');

                        }else{
                            /*var transList=$("#transactionList").append('<ul class="trans_data"><li><span class="data_id"><a href="transaction_record.html?id='+item.id+'">'+item.id+'</a></span>'
                                +'<span class="data_time fr">'+AschJS.utils.format.fullTimestamp(item.timestamp).replace('/','-').replace('/','-')+'</span>'
                                +'<span class="data_num fr">{Transaction fee：<em>'+item.fee+'&nbsp;ACC</em>}</span></li>'
                                +'<li class="td_info clearfix"><span class="fl"> <p><em class="main_blue"><a href="account_details.html?adress='+item.senderId+'">'+item.senderId+'</a></em> <em>('+item.amount+"&nbsp;"+currency+')</em></p></span>'
                                +' <img src="img/data_arrow_grey.png" alt="" class="fl"/>'
                                +' <span class="fl tdi_txt"> <p><em class="main_blue"><a href="account_details.html?adress='+item.recipientId+'">'+revicer+'</a></em><span class="fr" ><em class="fr tdi_txt">'+(item.amount)+'&nbsp;'+currency+'</em></span></p>'
                                +' </span></li><p class="clearfix"><span class="fr">'+item.amount+'&nbsp;'+currency+'</span><span class="fr" ><em>'+item.confirmations+'</em>&nbsp;Confirm</span>'
                                +'</p></ul>')*/

                            var transList=$("#transactionList").append('<ul class="trans_data" >'
                                +'<li><span class="data_id"><a href="transaction_record.html?id='+item.id+'">'+item.id+'</a></span><span class="data_time fr">'+AschJS.utils.format.fullTimestamp(item.timestamp).replace('/','-').replace('/','-')+'</span>'
                                +'<span class="data_num fr">{Transaction fee:<em>'+item.fee+'&nbsp;ACC</em>}</span></li>'
                                +'<li class="td_info clearfix"><span class="fl"><p><em class="main_blue"><a href="account_details.html?adress='+item.senderId+'">'+item.senderId+'</a></em></p></span>'
                                +'<span class="fl td_img relative"><img src="img/data_arrow_grey.png" alt="" class="fl"/><em>('+item.amount+currency+')</em></span>'
                                +'<span class="fl tdi_txt"><p><em  class="main_blue"><a href="account_details.html?adress='+item.recipientId+'">'+revicer+'</a></em></p></span></li><p class="clearfix">'
                                +'<span class="fr">'+item.amount+currency+'</span><span class="fr"><em>'+item.confirmations+'</em>Confirm</span></p></ul>');
                        }
                        $("#transactionList").append(transList);
                    })

                }
            }else if(!data.success){
                load=0;
                $("#show_more_recordsId").text("No More!")
            }
        }
    });
}
//计算交易总额
function totalTransactionAmount(blockId,offset,limit) {
    $.ajax({
        type: 'get',
        url: '/blockChain/findTransactionsByBlockId',
        processDate: true,
        async:false,
        data:{
            limit:limit,
            offset:offset,
            blockId:blockId

        },
        dataType: 'json',
        success: function (data) {

            if(data.success){
                var trans=data.transactions;
                $.each(trans,function (i,item) {
                    totalAmount=totalAmount+item.amount+item.fee;
                })
                $("#transactionTotalAmount").text(totalAmount.toFixed(2));
            }else{
                $("#transactionTotalAmount").text("0");
            }
        }
    });
}



$(function () {
    findBlockByHigth();

    $(document).on('mousewheel', function(event) {
        var scrollTop = $(window).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(window).height();
        if (scrollTop + windowHeight >= scrollHeight&&load==1){
            if (event.deltaY < 0){
                offset=offset+10;
                limit=limit+10;
                findTransactionsByBlockId(blockId,offset,limit)
            }
        }
    });

    $("#show_more_recordsId").click(function () {
        if(load==1){
            offset=offset+10;
            limit=limit+10;
            findTransactionsByBlockId(blockId,offset,limit)
        }
    })
})
