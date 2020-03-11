//加载完毕
$(function () {
    username = store.get("username", "");

    if (username != "") {
        $(".show_name").text(username);
        $("#quit").text("退出登录");
        $("#quit").click(function () {
            store.clear();
            window.location.href = "login.html";
        });
        $(".show_name").click(function () {
            window.location.href = "account_view.html";
        });
    }
    else {
        $(".show_name").text("登录");
        $("#quit").text("注册");
        $("#quit").click(function () {
            store.clear();
            window.location.href = "register.html";
        });
        $(".show_name").click(function () {
            window.location.href = "login.html";
        });
    }

    $("#personal_quit").click(function () {
        store.clear();
    });
});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function getAccBlockUrl() {
    return "https://tnode.acchain.org";
}

function GetUrlRelativePath() {
    var url = document.location.toString();
    var arrUrl = url.split("//");

    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    /*if(relUrl.indexOf("?") != -1){
     relUrl = relUrl.split("?")[0];
     }*/
    return relUrl;
}

function goHtml(html){
    window.location.href = html;
}

function showAlert(content){
    $("#alert_info").text(content);
    $(".dialog_init").show();
    $(".common_mask").show();
    $(".common_close_icon").click(function(){
        $(".common_mask").hide();
        $(".dialog_init").hide();
    });
}

function maskShowAlert(content){
    $("#alert_info").html(content);
    $(".dialog_init,.mask").show();
    $(".close_icon").click(function(){
        $(".dialog,.mask").hide();
    });
}

// 公共登录超时警告
function loginOvertime(link) {
    $("#alert_info").html('登录超时,请重新登录!');
    $(".dialog_init,.mask").show();
    setTimeout(function () {
        store.clear();
        location.href = link;
        return;
    }, 2000);
}

var alertJsonObj = {
    "alert1" : {
        "cn": "傅红雪", "en": "fuhongxue"
    }
};

function getLanguage() {
    var url = document.location.toString();
    var arrUrl = url.split("//");
    var start = arrUrl[1].indexOf("/");
    var relUrl = arrUrl[1].substring(start);
    var paths = relUrl.split("/");
    return paths[1];
}

function getAlertDesc(key) {
    var language = getLanguage();
    if(language == "en") {
        //1、使用eval方法
        var eValue = eval('alertJsonObj.' + key + ".en");
    }
    else
    {
        var eValue = eval('alertJsonObj.' + key + ".cn");
    }
    //alert(eValue);
}
//getAlertDesc("alert1");

function getImg(str) {
    if(str=="ACC")return "img/acc.jpg";
    if(str=="NPC")return "img/npc_coin.jpg";
    if(str=="RET")return "img/ret_cion.jpg";
    if(str=="KCOIN")return "img/k_coin.jpg";
    if(str=="K")return "img/k_coin.jpg";
    if(str=="SRT")return "img/srt_cion.jpg";
}