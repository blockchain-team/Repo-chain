   //加载完毕
$(function(){
    username = store.get("username","");

    if(username != "")
    {
        $("#register").text(username);
        $("#register").attr("href","account_view.html");
        $("#login").text("退出");
        $("#login").attr("href","login.html");
        $("#register").click(function(){
            window.location.href = "account_view.html";
        });
    }

});