//语言选择	
function hideSel(selector){
	if($(selector).css("display")){
		$(window).click(function(){
			$(selector).hide();
		});
	}
};
$(".language_text,.language_choose .down_icon").click(function(ev){
	var ev=ev||window.event;
    ev.preventDefault();    
    ev.stopPropagation();        
    ev.returnValue=false;	
	$("#language_gather").show();
	$(".language_choose .language_option").click(function(){
		$(".language_choose .language_text").html($(this).html());
		$("#language_gather").hide();		
	})
	hideSel("#language_gather");    
});	