	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var srcWidth, srcHeight; //высота и ширина области рисования
	
	
	var colorSpriteArea = "#0fec42";
	var colorCommonArea = "red";

	 var img = new Image();
	 img.src="./img/img.png";
	 var saveImg = false; //предыдущее преобразование картинки фона
	 var restoreImg = false; //сохраненная картинка
	 var stepBack = []; //шаг назад для приобразований фоновой картинки
	 var backStepCounts = 3; //максимальное количество шагов
	 var halfPointSize = 5; //размер половины квадрата точки на площади выделения
	 var lineColor = colorCommonArea; //цвет линии выделения
	 var lineWidth = 3; //толщина линии выделения
	 var mainImgScale_x = 0.7; //множитель размера картинки(масштаб)
     var mainImgScale_y = 0.7; //множитель размера картинки(масштаб)
	 var mirror_x = 1; //отражение фона
	 var mirror_y = 1;
	 
	 //var spritesStorage = window.localStorage;
	 var modules = {}; //подключаемые cdn функции
	 var HM; //htmlix state

	 
img.onload = function(){ 
	startImg();
			
}
window.onload = function(){ 
	
	 HM = new HTMLixState(StateMap);
	 
	console.log(HM);

	var collagenSettings = get_from_storage("collagenSettings");
	//console.log(collagenSettings);
	if(collagenSettings == null)return;
					
		for(var key in collagenSettings){
			loadModul(collagenSettings[key], key);
		}			
}








