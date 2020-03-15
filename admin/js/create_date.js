var monDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var curYear = new Date().getFullYear();
var chosenMon = 11;
var chosenYear = 2016;
for(var i = curYear; i > (curYear - 70); i--) //以今年为准，前70年 内
{
	var $yearStr = $('<div class="year-num">'+i+'</div>');
	$(".year-choose").append($yearStr);
}
for(var i = 1;i<13;i++){
	//var $monStr = $('<div class="month-num">'+i+'</div>');
	if(i<10){
		var $monStr = $('<div class="month-num">0'+i+'</div>');
	}else{
		var $monStr = $('<div class="month-num">'+i+'</div>');
	}
	$(".month-choose").append($monStr);
}
$(".date-year").click(function(event){
	$(".year-choose").show();
	event.stopPropagation();
	$(".month-choose").hide();
	$(".day-choose").hide();
	$(".date-month-txt").text("01");
	$(".year-num").click(function(event){
		$(".date-year-txt").text($(this).text());
		$(".year-choose").hide();
		event.stopPropagation();
	});
	hideSel(".year-choose");
});

$(".date-month").click(function(event){
	$(".month-choose").show();
	event.stopPropagation();
	$(".year-choose").hide();
	$(".day-choose").hide();
	$(".date-day-txt").text("01");
	$(".month-num").click(function(event){
		$(".date-month-txt").text($(this).text());
		$(".month-choose").hide();
		event.stopPropagation();
	});
	hideSel(".month-choose");
});

$(".date-day").click(function(event){
	$(".year-choose").hide();
	$(".month-choose").hide();
	chosenMon = $(".date-month-txt").text();
	chosenYear = $(".date-year-txt").text();
	$(".day-choose").empty();
	if(IsPinYear(chosenYear)){
		monDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	}else{
		monDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	}
	for(var j = 0;j< monDays[chosenMon-1];j++){
		//var $dayStr = $('<div class="day-num">'+(j+1)+'</div>');
		if((j+1)<10){
			var $dayStr = $('<div class="day-num">0'+(j+1)+'</div>');
		}else{
			var $dayStr = $('<div class="day-num">'+(j+1)+'</div>');
		}
		$(".day-choose").append($dayStr);
	}
	$(".day-choose").show();
	event.stopPropagation();
	$(".day-num").click(function(event){
		$(".date-day-txt").text($(this).text());
		$(".day-choose").hide();
		event.stopPropagation();
	});
	hideSel(".day-choose");
});

function IsPinYear(year) //判断是否闰平年  
{
	return(0 == year % 4 && (year % 100 != 0 || year % 400 == 0))
}


	
function hideSel(selector){
	if($(selector).css("display")){
		$(window).click(function(){
			$(selector).hide();
		});
	}
}