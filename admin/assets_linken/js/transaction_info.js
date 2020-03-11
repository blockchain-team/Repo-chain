/**
 * Created by dengfan on 2017/7/20.
 */


var id=getUrlParam("id")
function  getTransationhash() {
    $.ajax({
        type:"GET",
        url:"/api/transactions/get",
        processDate:true,
        data : {
            id : id
        },
        dataType:'json',
        success : function (data) {
            if(data.error_code==1){
                return showAlert("The transaction ID you entered does not exist");
            }
            if(data.success){
                 var currency = data.transaction.currency==""?"ACC":data.transaction.currency;
             $("#block").append('<a href="blocks_detail.html?height='+data.transaction.height+'">'+data.transaction.height+'</a>');
             $("#transactionId").append('<a href="transaction_record.html?id='+data.transaction.id+'">'+data.transaction.id+'</a>');
             $("#ids").attr('href','transaction_record.html?id='+data.transaction.id);
             $("#id").text(data.transaction.id);
             $("#datetime").text(AschJS.utils.format.fullTimestamp(data.transaction.timestamp));
             $("#fee").text(data.transaction.fee);
             $("#address").attr('href','account_details.html?adress='+data.transaction.senderId);
             $("#address").text(data.transaction.senderId);
             $("#fei").text('('+(data.transaction.amount)+currency+')');
             $("#recipientId").html(data.transaction.recipientId==""?"System":'<a class="main_blue" href="account_details.html?adress='+data.transaction.recipientId+'">'+data.transaction.recipientId+'</a>');
             $("#accs").text(data.transaction.amount+currency);
             $("#confirmations").text(data.transaction.confirmations);
            /* $("#amounts").text(data.transaction.amount+currency);*/
             $("#records").text(data.transaction.bytesCount);
             $("#datetimes").text(AschJS.utils.format.fullTimestamp(data.transaction.timestamp));
             $("#height").attr('href','blocks_detail.html?height='+data.transaction.height);
             $("#blockId").text(data.transaction.blockId);
             $("#amount").text(data.transaction.amount);
             $("#fees").text(data.transaction.fee);
             $("#message").text(data.transaction.message);
            };
        }
    });
}
function showAlert(content){
    $("#alert_info").text(content);
    $(".dialog_init").show();
    $(".mask").show();
    $(".close_icon").click(function(){
        $(".mask").hide();
        $(".dialog_init").hide();
        location="blocks_data.html";
    });
}

$(function () {
    getTransationhash();
});
