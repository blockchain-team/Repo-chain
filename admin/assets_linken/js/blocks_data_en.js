var totalPageCount = 0;
var pageIndex = 1;
var offset  = 0;
var d;  //用于判断是否是最后一页的最后一个高度是否大于1;
var demo;
var host = getAccBlockUrl();
//var host = "http://45.32.248.33:4096";
$(function(){


    $("#search").on("click",function () {
        var content = $("#search_content").val();
        content=$.trim(content);
        if(!content)return;
        if(content.length==34 || content.length==33)
            window.location="account_details.html?adress="+content;
        else if(/^\d+$/.test(content))
            location="blocks_detail.html?height="+content;
        else if(content.length==64)
            location="transaction_record.html?id="+content;
        else if(content.length<34 && !/^\d+$/.test(content))
            showAlert("The input account does not exist!");
        else if(content.length>33 && !/^\d+$/.test(content))
            showAlert("The transaction ID you entered does not exist");
        else showAlert(" The input format is incorrect !");
    });
    /*$("#search").on("click",function () {
        var content = $("#search_content").val();
        content=$.trim(content);
        if(!content)return;
        if(content.length==34)
            window.location="account_details.html?adress="+content;
        else if(/^\d+$/.test(content))
            location="blocks_detail.html?height="+content;
        else if(content.length==64)
            location="transaction_record.html?id="+content;
        else if(content.length<34 && !/^\d+$/.test(content))
            showAlert("输入账户不正确!");
        else if(content.length>34)
            showAlert("输入交易ID不正确");
        else showAlert("输入格式不正确!");
        });*/
    getBlockInfo(0);
    createPage();
    demo = totalPageCount;
   /* $(".search").click(function(){
        var content = $("#search_content").val();
        searchBlockInfo($.trim(content));
    });*/
});

function getBlockInfo(offset){
        var url = "/api/blocks";
        $.ajax({
            type: "GET",
            url: url,
            async : false,
            processDate: true,
            data: {
                limit     :    7,
                offset    :    offset,
                orderBy   :   "height:desc",
            },
            dataType: 'json',
            success: function(data) {
                if(data != undefined) {
                    var success = data.success;
                    var i = 0;
                    if(success == true){
                        var blocks = data.blocks;
                        var count = data.count;
                        totalPageCount = Math.ceil(parseInt(count)/7);
                        $(".blocks_info").empty();
                        $.each(blocks,function(i,blocksItem){
                           if(i==0){
                               var  height = blocksItem.height;
                               var difference = parseInt(count) - parseInt(height);
                               if(difference == 0){
                                pageIndex = 1;
                               }else{
                                pageIndex = Math.ceil(difference/7);
                               }
                           }
                           if(i==6){
                             d=blocksItem.height;
                           }
                            i++;
                            var id = blocksItem.id;
//                           var blockInfo = $('<tr class="blocks_info" id="'+ blocksItem.id +'"><td class="height">'+ blocksItem.height +'</td><td>'+ getLocalTime(blocksItem.timestamp) +'</td><td>'+ blocksItem.id +'</td><td class="generatorId">'+ blocksItem.generatorId +'</td><td class = "transactions">'+ blocksItem.numberOfTransactions+'</td><td>'+ getConversion(blocksItem.totalFee) +'</td><td>'+ getConversion(blocksItem.reward) +'</td></tr>');
                            var blockInfo = $('<tr class="blocks_info" id="'+ blocksItem.id +'"><td class="height" data-value="'+blocksItem.height+'">'+ blocksItem.height +'</td><td>'+ AschJS.utils.format.fullTimestamp(blocksItem.timestamp) +'</td><td class="heights" style="cursor: pointer;" data-value="'+blocksItem.height+'">'+ blocksItem.id +'</td><td class="generatorId account" data-value="'+blocksItem.generatorId+'">'+ blocksItem.generatorId +'</td><td class = "transactions">'+ blocksItem.numberOfTransactions+'</td><td>'+ getConversion(blocksItem.totalFee) +'</td><td>'+ getConversion(blocksItem.reward) +'</td></tr>');
                            $(".blocks_list").append(blockInfo);

                            $(".height").on("click",function () {
                                location="blocks_detail.html?height="+$(this).data("value");
                            })
                            $(".account").on("click",function () {
                                location="account_details.html?adress="+$(this).data("value");
                            })
                            $(".heights").on("click",function () {
                                location="blocks_detail.html?height="+$(this).data("value");
                            })
                        });
                    }else{
                        $(".blocks_info").empty();
                        showAlert("Parameter error!");
                    }
                }
            }
        });
}

function getBlockDetail(id){
    $("#"+ id + " .height").click(function(){
        var url = "/api/blocks/get";
        $.ajax({
            type: "GET",
            url: url,
            async : false,
            processDate: true,
            data: {
                id     :    id,
            },
            dataType: 'json',
            success: function(data) {
                if(data != undefined) {
                    var success = data.success;
                    var i = 0;
                    if(success == true){
                        var block = data.block;
                        $("#block_detail_id").text(block.id);
                        $("#block_detail_time").text(AschJS.utils.format.fullTimestamp(block.timestamp));
                        $("#block_detail_height").text(block.height);
                        $("#block_detail_preblock").text(block.previousBlock);
                        $("#block_detail_trans_num").text(block.numberOfTransactions);
                        $("#block_detail_reward").text(getConversion(block.reward));
                        $("#block_detail_summary").text(block.payloadHash);
                        $("#block_detail_generator").text(block.generatorId);
                        $("#block_detail_generatorkey").text(block.generatorPublicKey);
                        $(".mask").show();
                        $("#block_detail").show();

                        $("#block_detail_close").click(function(){
                            $("#block_detail_id").text();
                            $("#block_detail_time").text();
                            $("#block_detail_height").text();
                            $("#block_detail_preblock").text();
                            $("#block_detail_trans_num").text();
                            $("#block_detail_reward").text();
                            $("#block_detail_summary").text();
                            $("#block_detail_generator").text();
                            $("#block_detail_generatorkey").text();
                            $(".mask").hide();
                            $("#block_detail").hide();
                        });
                    }else{
                        showAlert("Parameter error!");
                    }
                }
            }
        });
    });
}

function getGeneratorInfo(id){
    $("#"+ id + " .generatorId").click(function(){

        var address = $("#"+ id + " .generatorId").text();
        var url = "/api/accounts";
        $.ajax({
            type: "GET",
            url: url,
            async : false,
            processDate: true,
            data: {
                address     :    address,
            },
            dataType: 'json',
            success: function(data) {
                if(data != undefined) {
                    var success = data.success;
                    var i = 0;
                    if(success == true){
                        var account = data.account;
                        $("#account_address").text(account.address);
                        $("#account_key").text(account.publicKey);
                        $("#account_balance").text(getConversion(account.balance));
                        $(".mask").show();
                        $("#accout_info").show();

                        $("#account_close").click(function(){
                            $("#account_address").text("");
                            $("#account_key").text("");
                            $("#account_balance").text("");
                            $(".mask").hide();
                            $("#accout_info").hide();
                        });
                    }else{
                        showAlert("Parameter error!");
                    }
                }
            }
        });
    });
}

function getBlockTrans(id){
        $("#"+ id + " .transactions").click(function(){

            var url = "/api/transactions";
            $.ajax({
                type: "GET",
                url: url,
                async : false,
                processDate: true,
                data: {
                    blockId     :    id,
                },
                dataType: 'json',
                success: function(data) {
                    if(data != undefined) {
                        var success = data.success;
                        var count = data.count;
                        var i = 0;
                        if(success == true){
                            var transactions = data.transactions;
                            $(".deal_list").empty();
                            $.each(transactions,function(i,transItem){
//                               var transInfo = $('<ul><li>'+ transItem.id +'</li><li>'+ transItem.confirmations +'</li><li>'+ getConversion(transItem.amount) +'</li><li>'+ getConversion(transItem.fee) +'</li><li>'+ getLocalTime(transItem.timestamp) +'</li></ul>');
                               var transInfo = $('<ul><li>'+ transItem.id +'</li><li>'+ transItem.confirmations +'</li><li>'+ getConversion(transItem.amount) +'</li><li>'+ getConversion(transItem.fee) +'</li><li>'+ AschJS.utils.format.fullTimestamp(transItem.timestamp) +'</li></ul>');
                               $(".deal_list").append(transInfo);
                            });
                            $("#count").text(count);
                            $(".mask").show();
                            $("#block_transaction").show();
                            $("#trans_close").click(function(){
                                $(".deal_list").empty();
                                $(".mask").hide();
                                $("#block_transaction").hide();
                            });
                        }else{
                            $("#count").text("0");
                            $(".deal_list").empty();
                            showAlert("Parameter error!");
                        }
                    }
                }
            });
        });
}

function searchBlockInfo(id){
        var url = "/api/blocks/get";
        var r = /^\d+$/;
        if(id.length == 64){
            $(".tcdPageCode").hide();
            $.ajax({
                type: "GET",
                url: url,
                async : false,
                processDate: true,
                data: {
                    id  :   id,
                },
                dataType: 'json',
                success: function(data) {
                    if(data != undefined) {
                        var success = data.success;
                        if(success == true){
                            var blocks = data.block;
                            var count = data.count;
                            $(".blocks_info").text("");
                            var i = 0;
                            var id = blocks.id;
//                            var blockInfo = $('<tr class="blocks_info" id="'+ blocks.id +'"><td class="height">'+ blocks.height +'</td><td>'+ getLocalTime(blocks.timestamp) +'</td><td>'+ blocks.id +'</td><td class="generatorId">'+ blocks.generatorId +'</td><td class = "transactions">'+ blocks.numberOfTransactions+'</td><td>'+ getConversion(blocks.totalFee) +'</td><td>'+ getConversion(blocks.reward) +'</td></tr>');
                            var blockInfo = $('<tr class="blocks_info" id="'+ blocks.id +'"><td class="height">'+ blocks.height +'</td><td>'+ AschJS.utils.format.fullTimestamp(blocks.timestamp) +'</td><td>'+ blocks.id +'</td><td class="generatorId">'+ blocks.generatorId +'</td><td class = "transactions">'+ blocks.numberOfTransactions+'</td><td>'+ getConversion(blocks.totalFee) +'</td><td>'+ getConversion(blocks.reward) +'</td></tr>');
                            $(".blocks_list").append(blockInfo);
                            getBlockDetail(id);
                            getGeneratorInfo(id);
                            getBlockTrans(id);
                        }else{
                            $(".blocks_info").text("");
                            showAlert("Invalid Block ID!");
                        }
                    }
                }
            });
        }else if(r.test(id) == true){
                $(".tcdPageCode").hide();
                $.ajax({
                    type: "GET",
        //            url: "http://45.32.248.33:4096/api/blocks/get",
                    url: url,
                    async : false,
                    processDate: true,
                    data: {
                        height  :   id,
                    },
                    dataType: 'json',
                    success: function(data) {
                        if(data != undefined) {
                            var success = data.success;
                            if(success == true){
                                var blocks = data.block;
                                var count = data.count;
                                $(".blocks_info").text("");
                                var i = 0;
                                var id = blocks.id;
//                                var blockInfo = $('<tr class="blocks_info" id="'+ blocks.id +'"><td class="height">'+ blocks.height +'</td><td>'+ getLocalTime(blocks.timestamp) +'</td><td>'+ blocks.id +'</td><td class="generatorId">'+ blocks.generatorId +'</td><td class = "transactions">'+ blocks.numberOfTransactions+'</td><td>'+ getConversion(blocks.totalFee) +'</td><td>'+ getConversion(blocks.reward) +'</td></tr>');
                                var blockInfo = $('<tr class="blocks_info" id="'+ blocks.id +'"><td class="height">'+ blocks.height +'</td><td>'+ AschJS.utils.format.fullTimestamp(blocks.timestamp) +'</td><td>'+ blocks.id +'</td><td class="generatorId">'+ blocks.generatorId +'</td><td class = "transactions">'+ blocks.numberOfTransactions+'</td><td>'+ getConversion(blocks.totalFee) +'</td><td>'+ getConversion(blocks.reward) +'</td></tr>');
                                $(".blocks_list").append(blockInfo);
                                getBlockDetail(id);
                                getGeneratorInfo(id);
                                getBlockTrans(id);
                            }else{
                                $(".blocks_info").text("");
                                showAlert("Invalid Block ID!");
                            }
                        }
                    }
                });
        }else if(id == undefined || id.length == 0 || id ==""){
            getBlockInfo(0);
            createPage();
            demo = totalPageCount;
            $(".tcdPageCode").show();
        }else{
            $(".tcdPageCode").hide();
            $(".blocks_info").text("");
            showAlert("Invalid Block Height and Block ID!");
        }


}

function showAlert(content){
    $("#alert_info").text(content);
    $(".dialog_init").show();
    $(".mask").show();
    $(".close_icon").click(function(){
    	$(".mask").hide();
    	$(".dialog_init").hide();
    });
}

//生成分页按钮
function createPage(){
    //生成分页按钮
    $(".tcdPageCode").text("");
       //绑定页码按钮点击事件
    $(".tcdPageCode").createPage({
          pageCount:totalPageCount,
          current:pageIndex,
          backFn:function(p){
              pageIndex = p;
              var difference = 0;
              if(pageIndex == 1){
                difference = 0;
              }else{
                difference =   (pageIndex - 1) * 7;
              }
              getBlockInfo(difference);
              if(totalPageCount > demo && pageIndex==(demo-2) && d>8){
                createPage();
              }
          }
    });
}

function getConversion(num){
    return Number(num)/Math.pow(10,6)
}

function getLocalTime(nS) {
   return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
}

