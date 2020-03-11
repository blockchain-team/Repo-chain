//图片上传预览    IE是用了滤镜。
function previewImage(file,containerID,imgID,fileID)
{
  var MAXWIDTH  = 100; 
  var MAXHEIGHT = 100;
  var div = document.getElementById(''+containerID+'');//容器id
  if (file.files && file.files[0])
  {
      div.innerHTML ='<img id='+imgID+'>';//容器内img的id及file类型的inputid
      var img = document.getElementById(''+imgID+'');//容器内img的id
      img.onload = function(){
        var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
        img.width  =  rect.width;
        img.height =  rect.height;
//		img.style.marginTop = rect.top+'px';
      }
      var reader = new FileReader();
      reader.onload = function(evt){img.src = evt.target.result;}
      reader.readAsDataURL(file.files[0]);
  }
  else //兼容IE
  {
    var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
    file.select();
    var src = document.selection.createRange().text;
    div.innerHTML = '<img id='+imgID+'>';//
    var img = document.getElementById(''+imgID+'');
    img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
    var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
    status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
    div.innerHTML = "<div style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
  }
}
function clacImgZoomParam( maxWidth, maxHeight, width, height ){
    var param = {top:0, left:0, width:width, height:height};
    if( width>maxWidth || height>maxHeight ){
        rateWidth = width / maxWidth;
        rateHeight = height / maxHeight;
        
        if( rateWidth > rateHeight ){
            param.width =  maxWidth;
            param.height = Math.round(height / rateWidth);
        }else{
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }
    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}

//调用上传
function showPreviewImage(upload_obj,upload_container,upload_shown,upload_file){
	$("#"+upload_obj).click(function(){
			$("#"+upload_file).click();
		});
	$("#"+upload_file).change(function(){

 		previewImage(this,upload_container,upload_shown,upload_file);
 	});
}

