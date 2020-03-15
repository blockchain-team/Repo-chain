//新闻公告详情
$(function(){
    var id = getUrlParam("id");
    $.ajax({
        type: "post",
        url: "/user/getNewsDetail",
        async : false,
        processDate: true,
        data: {
            id : id
        },
        dataType: 'json',
        success: function(data) {
            if(data != undefined) {
                $(".detail_content").empty();
                $("#title_path").text(data.title);
                $(".news_detail_title").text(data.title);
                $("#createTime").text(data.create_time);
                $("#author").text(data.author);
                $("#look").text(data.look_num);
                $(".news_detail_bottom").append(data.content);

                if(data.prePage != "" ){
                    $("#news_prev").attr("href","news_detail.html?id=" + data.prePage);
                    $("#news_prev").show();
                }
                if(data.nextPage != "" ){
                    $("#news_next").attr("href","news_detail.html?id=" + data.nextPage);
                    $("#news_next").show();
                }
            }
        }
    });
})