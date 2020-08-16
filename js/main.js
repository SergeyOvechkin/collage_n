	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	
	var srcWidth = canvas.clientWidth; var srcHeight = canvas.clientHeight;
	
	canvas.width=srcWidth;
    canvas.height=srcHeight;
	//console.log(srcWidth, srcHeight);
	
	
	 var img = new Image();
	 img.src="./img/img.png";
	 var saveImg = false; //предыдущее преобразование картинки
	 var restoreImg = img;
	 var halfPoitSize = 5; //размер половины квадрата точки на площади
	 var mainImgScale = 0.6; //множитель размера картинки(масштаб)
	 
img.onload = function(){ 
	ctx.drawImage(img, 0, 0, img.naturalWidth*mainImgScale, img.naturalHeight*mainImgScale); 
	saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
}








