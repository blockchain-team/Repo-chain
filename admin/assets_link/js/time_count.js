////获取服务器时间
//function getSevertime(){
//
//}
////倒计时
//function PublicityClock(timeEnd,days,hours,min,sec,clock){
//  var now = new Date();
//  // var now = getSevertime();
//  var endTime = new Date(timeEnd);
//  var t = endTime.getTime() - now.getTime();
//  if(t < 0){
//      clearInterval(clock);
//      // $(box).remove();
//  }
//  var d=Math.floor(t/1000/60/60/24);
//  var h=Math.floor(t/1000/60/60%24);
//  var m=Math.floor(t/1000/60%60);
//  var s=Math.floor(t/1000%60);
//  d = d >= 10 ? d : "0"+d;
//  h = h >= 10 ? h : "0"+h;
//  m = m >= 10 ? m : "0"+m;
//  s = s >= 10 ? s : "0"+s;
//
//  if(d*1>=0) {
//      $(days).html(d);
//  }
//  if(h*1>=0){
//      $(hours).html(h);
//  }
//  if(m*1>=0){
//      $(min).html(m);
//  }
//  if(s*1>=0){
//      $(sec).html(s);
//  }
//}
//
////公示页
//var clockTime1 = window.setInterval(function(){
//  PublicityClock('2018/05/13 19:41:00','.RETday','.REThour','.RETmin','.RETsec',"clockTime1");
//},1000);
//var clockTime2 = window.setInterval(function(){
//  PublicityClock('2018/05/15 18:00:00','.PEBday','.PEBhour','.PEBmin','.PEBsec','.clockTime2');
//},1000);
////开始页
//var clockTime3 = window.setInterval(function(){
//  PublicityClock('2018/05/18 18:00:00','.ACCHAINday','.ACCHAINhour','.ACCHAINmin','.ACCHAINsec','.clockTime3');
//},1000);

/**
 * 日期格式： 12/24/2012 12:00:00
 * 天：days
 * 时：hours
 * 分：minutes
 * 秒：seconds
 */

(function ($) {
    $.fn.downCount = function (date) {
        var container = this;
        var startTime = new Date(date.startTime);
        var endTime = new Date(date.endTime);
        var difference = endTime.getTime() - startTime.getTime();
        function countdown () {  
        	if(difference>=0){
        		//时间差
	            var _second = 1000,
	                _minute = _second * 60,
	                _hour = _minute * 60,
	                _day = _hour * 24;
	            //获取天时分秒
	            var days = Math.floor(difference / _day),
	                hours = Math.floor((difference % _day) / _hour),
	                minutes = Math.floor((difference % _hour) / _minute),
	                seconds = Math.floor((difference % _minute) / _second);
	            
	            days = (String(days).length >= 2) ? days : '0' + days;
	            hours = (String(hours).length >= 2) ? hours : '0' + hours;
	            minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
	            seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

	            //转换时间格式
	            var ref_days = (days === 1) ? 'day' : 'days',
	                ref_hours = (hours === 1) ? 'hour' : 'hours',
	                ref_minutes = (minutes === 1) ? 'minute' : 'minutes',
	                ref_seconds = (seconds === 1) ? 'second' : 'seconds';
	
	            container.find('.days').text(days);
	            container.find('.hours').text(hours);
	            container.find('.minutes').text(minutes);
	            container.find('.seconds').text(seconds);
	
	            container.find('.days_ref').text(ref_days);
	            container.find('.hours_ref').text(ref_hours);
	            container.find('.minutes_ref').text(ref_minutes);
	            container.find('.seconds_ref').text(ref_seconds);
        	}
            difference -= 1000;
        };
        // start
        var interval = setInterval(countdown, 1000);
    };
})(jQuery);
