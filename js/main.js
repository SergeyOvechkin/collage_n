	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var srcWidth, srcHeight; //высота и ширина области рисования

	 var img = new Image();
	 img.src="./img/img.png";
	 var saveImg = false; //предыдущее преобразование картинки
	 var restoreImg = false;
	 var halfPoitSize = 5; //размер половины квадрата точки на площади
	 var lineColor = "red"; //цвет линии выделения
	 var lineWidth = 3; //толщина линии выделения
	 var mainImgScale_x = 0.7; //множитель размера картинки(масштаб)
     var mainImgScale_y = 0.7; //множитель размера картинки(масштаб)
	 var mirror_x = 1;
	 var mirror_y = 1;
	 
img.onload = function(){ 
	startImg();
}








