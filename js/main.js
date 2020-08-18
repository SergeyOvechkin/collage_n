	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	
	var srcWidth = canvas.clientWidth; var srcHeight = canvas.clientHeight;
	
	canvas.width=srcWidth;
    canvas.height=srcHeight;

	 var img = new Image();
	 img.src="./img/img.png";
	 var saveImg = false; //предыдущее преобразование картинки
	 var restoreImg = false;
	 var halfPoitSize = 5; //размер половины квадрата точки на площади
	 var mainImgScale_x = 0.6; //множитель размера картинки(масштаб)
     var mainImgScale_y = 0.6; //множитель размера картинки(масштаб)
	 var mirror_x = 1;
	 var mirror_y = 1;
	 
img.onload = function(){ 
   // ctx.scale(mirror_x, mirror_y);
	//ctx.drawImage(img, 0, 0, img.naturalWidth*mainImgScale_x, img.naturalHeight*mainImgScale_y); 
	//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
	startImg();
}








