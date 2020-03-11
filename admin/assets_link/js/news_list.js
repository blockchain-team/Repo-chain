//新闻列表
var pageIndex = 1; //页码下标
var totalPageCount = 0; //总页数
var type = 1; //默认展示类型


function getNews(){
    $.ajax({
        type: "post",
        url: "/user/getNewsList",
        async : false,
        processDate: true,
        data: {
            pageIndex : pageIndex,
            type : type
        },
        dataType: 'json',
        success: function(data) {
            if(data != undefined) {
                totalPageCount = data.totalPageCount;
                var newsList = data.news;

                $(".newsbox").remove();
                $.each(newsList,function(i,itemNews){
                   var news = $('<div class="newsbox" id="'+itemNews.id+'"><a target="_blank" href="news_detail.html?id='+itemNews.id+'" class="newsImg"><img src="'+itemNews.cover+'" class="fl"/></a><dl class="fl"><dt><a href="news_detail.html?id='+itemNews.id+'" class="newsTitle" target="_blank">'+itemNews.title+'></a></dt><dd class="new_time">'+itemNews.create_time+'</dd><dd class="new_text relative"><span class="news-content">'+itemNews.description+'</span><a href="news_detail.html?id='+itemNews.id+'" target="_blank" class="see_more"><span>more>></span></a></dd></dl></div>');
                   $(".news_tab").append(news);

                   if(itemNews.is_external == 1){
                        $("#"+itemNews.id+" .newsImg").attr("href",itemNews.link);
                        $("#"+itemNews.id+" .newsTitle").attr("href",itemNews.link);
                        $("#"+itemNews.id+" .see_more").attr("href",itemNews.link);
                   }
                });
            }
        }
    });
}

//加载页码按钮
function getPageButton(){
      $(".order_pages").text("");
      $(".order_pages").append("<div class='tcdPageCode'></div>");
      //绑定页码按钮点击事件
      $(".tcdPageCode").createPage({
          pageCount:totalPageCount,
          current:pageIndex,
          backFn:function(p){
              pageIndex = p;
              getNews(pageIndex);
          }
      });
}


$(function(){
    getNews();

    if(totalPageCount > 1){
        getPageButton();
    }

    //新闻类型切换
    $("#affiche").click(function(){
        var index = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        type = 1;
        pageIndex = 1;
        getNews();
        if(totalPageCount > 1){
            getPageButton();
        }
    });
    $("#media").click(function(){
        var index = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        type = 2;
        pageIndex = 1;
        getNews();
        if(totalPageCount > 1){
            getPageButton();
        }
    });
    $("#information").click(function(){
        var index = $(this).index();
        $(this).addClass('active').siblings('li').removeClass('active');
        type = 3;
        pageIndex = 1;
        getNews();
        if(totalPageCount > 1){
            getPageButton();
        }
    });
});