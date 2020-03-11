var pageIndex = 1;
var totalPageCount = 1;
var kw="";
var menuId = getUrlParam("id");
var username = store.get("username");
var signature = store.get("signature");

if(!username  || !signature){
    //登录提示
    location="login.html";

}
function getList() {
    kw=$("#userName").data("value");
    $.ajax({
        url:"/relateme/trans/list",
        type:"POST",
        async: false,
        data:{
            username: username,
            signature: signature,
            menuId: menuId,
            page: pageIndex,
            userName:kw
        },
        success:function (data) {
            if (data.error_code!=0){
                if(data.error_code==35){
                    showAlert("登录超时 请重新登录");
                    goHtml("login.html?lp=trans_out_record.html");
                }else {
                    showAlert("加载失败!");
                }
                return;
            }
            var html='<tr><th>交易时间</th><th>转出类型</th><th>转出地址</th><th>数量</th><th>状态</th></tr>';
            $.each(data.data,function (index,item) {
                var createTime=item.create_time;
                var name=item.userName?item.userName:"无";
                var fromAddr=item.from_addr?item.from_addr:"无";
                var toAddr=item.to_addr?item.to_addr:"无";
                var amount=item.amount?item.amount:"无";
                var category=item.category?item.category:"无";
                var success=item.success?(item.success=="true"?"成功":"<span style='color: red;'>失败</span>"):"无";
               html+='<tr><td>'+createTime+'</td><td>'+category+'</td><td>'+toAddr+'</td><td>'+amount+'</td><td>'+success+'</td></tr>'
            });
            totalPageCount=data.totalPageCount;
            $("#listView").html(html);
        }

    })
}
function getPage() {
    $(".tcdPageCode").off();
    $(".tcdPageCode").createPage({
        pageCount:totalPageCount,
        current:pageIndex,
        backFn:function(p){
            pageIndex = p;
            getList();
        }
    });
}
$(function () {
    getList();
    if(totalPageCount>1){
        getPage();
    }


    $("#search").on("click",function () {
        pageIndex=1;
        getList();
        getPage();
    })
})
function showAlert(text){
    $("#alert_info").text(text);
    $(".dialog_init,.mask").show();
}
//通用跳转页面
function goHtml(html){
    $(".common_close_icon").click(function(){
        window.location.href = html;
    });
}