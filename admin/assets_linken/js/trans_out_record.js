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
                    showAlert("Login timeout Please log in again!");
                    goHtml("login.html?lp=trans_out_record.html");
                }else {
                    showAlert("Fail in loading the digital asset!");
                }
                return;
            }
            var html='<tr><th>Transaction time</th><th>Transfer-out type</th><th>Transfer-out address</th><th>Amount</th><th>Status</th></tr>';
            $.each(data.data,function (index,item) {
                var createTime=item.create_time;
                var name=item.userName?item.userName:"none";
                var fromAddr=item.from_addr?item.from_addr:"none";
                var toAddr=item.to_addr?item.to_addr:"none";
                var amount=item.amount?item.amount:"none";
                var category=item.category?item.category:"none";
                var success=item.success?(item.success=="true"?"Success":"<span style='color: red;'>failure</span>"):"none";
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
    if(totalPageCount>1)getPage();



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