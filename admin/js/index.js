//首页相关数据展示

/*//数据在页面打开后递增显示加载
var wrapTop = $(".section2").offset().top;
var istrue = true;
$(window).on("scroll",
function() {
	var s = $(window).scrollTop();
	if (s > wrapTop/3 && istrue) {
		console.log(1)
		$(".datas").each(count);
		function count(a) {
			var b = $(this);
			a = $.extend({},
			a || {},
			b.data("countToOptions") || {});
			b.countTo(a)
		};
		istrue = false;
	};
})
//设置计数
$.fn.countTo = function (options) {
	options = options || {};
	return $(this).each(function () {
		//当前元素的选项
		var settings = $.extend({}, $.fn.countTo.defaults, {
			from:            $(this).data('from'),
			to:              $(this).data('to'),
			speed:           $(this).data('speed'),
			refreshInterval: $(this).data('refresh-interval'),
			decimals:        $(this).data('decimals')
		}, options);
		//更新值
		var loops = Math.ceil(settings.speed / settings.refreshInterval),
			increment = (settings.to - settings.from) / loops;
		//更改应用和变量
		var self = this,
		$self = $(this),
		loopCount = 0,
		value = settings.from,
		data = $self.data('countTo') || {};
		$self.data('countTo', data);
		//如果有间断，找到并清除
		if (data.interval) {
			clearInterval(data.interval);
		};
		data.interval = setInterval(updateTimer, settings.refreshInterval);
		//初始化起始值
		render(value);
		function updateTimer() {
			value += increment;
			loopCount++;
			render(value);
			if (typeof(settings.onUpdate) == 'function') {
				settings.onUpdate.call(self, value);
			}
			if (loopCount >= loops) {
				//移出间隔
				$self.removeData('countTo');
				clearInterval(data.interval);
				value = settings.to;
				if (typeof(settings.onComplete) == 'function') {
					settings.onComplete.call(self, value);
				}
			}
		}
		function render(value) {
			var formattedValue = settings.formatter.call(self, value, settings);
			$self.html(formattedValue);
		}
		});
	};
	$.fn.countTo.defaults={
		from:0,               //数字开始的值
		to:0,                 //数字结束的值
		speed:1000,           //设置步长的时间
		refreshInterval:100,  //隔间值
		decimals:0,           //显示小位数
		formatter: formatter, //渲染之前格式化
		onUpdate:null,        //每次更新前的回调方法
		onComplete:null       //完成更新的回调方法
	};
	function formatter(value, settings){
		return value.toFixed(settings.decimals);
	}
	//自定义格式
	$('#block_height,#nodes,#users,#transactions').data('countToOptions',{
		formmatter:function(value, options){
			return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
		}
	});
	//定时器
	$('.datas').each(count);
	function count(options){
		var $this=$(this);
		options=$.extend({}, options||{}, $this.data('countToOptions')||{});
		$this.countTo(options);
	}*/
/**
* 格式化数字(千分位)
*/
/*function formatNum(num){
    if(num.length <= 3){
        return num;
    }
    var re=/(?=(?!(\b))(\d{3})+$)/g;
    num = (""+num).replace(re,",");
    return num;
};*/

/**
* 获取区块链相关信息
*/
function getBlockInfos(){

    /*//区块高度
    $.getJSON(getAccBlockUrl()+"/api/blocks/getheight",
    function(data){
        if(data.height != "" && data.height != undefined){
            $("#block_height").text(data.height);
        }
    });

    //节点数量
    $.getJSON(getAccBlockUrl()+"/api/peers",
    function(data){
        if(data.totalCount != "" && data.totalCount != undefined){
            $("#nodes").text(data.totalCount);
        }
    });

    //交易总量
    $.getJSON(getAccBlockUrl()+"/api/transactions",
    function(data){
        if(data.count != "" && data.count != undefined){
            $("#transactions").text(data.count);
        }
    });*/

    $.ajax({
        type: "post",
        url: "/user/getBlockDates",
        processDate: true,
        data: {},
        dataType: 'json',
        success: function(data) {
            if(data.error_code == 0) {
                $("#block_height").text(data.blockHeight);
                $("#nodes").text(data.nodes);
                $("#transactions").text(data.transactions);
            }
        }
    });
}

//获取新闻动态
function getNews(){
    $.ajax({
        type: "post",
        url: "/user/getNewsList",
        processDate: true,
        data: {
            pageNum : 10
        },
        dataType: 'json',
        success: function(data) {
            if(data != undefined) {
                var newsList = data.news;
                $(".news-list").empty();
                $("#more").empty();
                $.each(newsList,function(i,itemNews){
                    if(i == 0){
                        $("#oneImg").attr("src",itemNews.cover);
                        $("#oneContent").text(itemNews.title);
                        $(".newsDetailOne").attr("href","news_detail.html?id="+itemNews.id);
                        if(itemNews.is_external == 1){
                            $(".newsDetailOne").attr("href",itemNews.link);
                        }
                    }
                    else if(i == 1){
                        $("#twoImg").attr("src",itemNews.cover);
                        $("#twoContent").text(itemNews.title);
                        $(".newsDetailTwo").attr("href","news_detail.html?id="+itemNews.id);
                        if(itemNews.is_external == 1){
                            $(".newsDetailTwo").attr("href",itemNews.link);
                        }
                    }
                    else if(i == 2){
                        $("#threeImg").attr("src",itemNews.cover);
                        $("#threeContent").text(itemNews.title);
                        $(".newsDetailThree").attr("href","news_detail.html?id="+itemNews.id);
                        if(itemNews.is_external == 1){
                            $(".newsDetailThree").attr("href",itemNews.link);
                        }
                    }
                });
            }
        }
    });
}

$(function(){
    getBlockInfos();
    getNews();
})