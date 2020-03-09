   //加载完毕
$(function(){
    username = store.get("username","");

    if(username != "")
    {
        $(".show_name").text(username);
        $("#quit").text("退出登录");
        $("#quit").click(function(){
            store.clear();
            window.location.href = "login.html";
        });
        $(".show_name").click(function(){
            window.location.href = "account_view.html";
        });
    }
    else
    {
        $(".show_name").text("登录");
        $("#quit").text("注册");
        $("#quit").click(function(){
            store.clear();
            window.location.href = "register.html";
        });
        $(".show_name").click(function(){
            window.location.href = "login.html";
        });
    }

    $("#personal_quit").click(function(){
        store.clear();
    });
});

function getUrlParam(name)
{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
 }
