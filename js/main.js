	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var srcWidth, srcHeight;

	 var img = new Image();
	 img.src="./img/img.png";
	 
img.onload = function(){ 

	 srcWidth=img.naturalWidth;
     srcHeight=img.naturalHeight;
	
    canvas.width=srcWidth;
    canvas.height=srcHeight;	        
	ctx.drawImage(img, 0, 0); 		
		//процент увеличения_уменьшения (- отрицательный знак) левого верхнего угла и правого вержнего по вертикали и горизонтали
		//drawImageInPerspective(ctx, 50,  0,  0, 0, 0, 0, srcWidth, srcHeight);
}

var area_1 = []; //область выделения до смещения
var isEndArea_1 = false; //флаг показывает - закончено ли выделение первой области
var area_2 = false; //область выделения после смещения
var area_3 = false;
var currentOperation = "area_1"; //текущая операция с масивом начального размера (без смещения)
var halfPoitSize = 5; //размер половины квадрата точки на площади
var isMovePoint = false; //флаг перемещения точки масштабирования
var isMoveCut = false;
var movePointStart = false;
var movePointEnd = false;
var moveImgArr = false;
var saveImg = false; //предыдущее преобразование картинки
var rotateFigure = 0;

///добавляет точки к первой облати выделения пока контур не сомкнется	
canvas.onmousedown = function (e) {
	
	var point = getCanvasPoint(e);
    
  if(currentOperation == "area_1"){
    
	if(isEndArea_1 === false){
		var isEnd = endArea("area_1", point);	  
		if( ! isEnd )area_1.push(point);
    }else{
		
		var isClickPoint = isClickOnPoint(area_1 ,point);
		if(isClickPoint) currentOperation = "area_2"
	}		
	drawArea(area_1, isEndArea_1, 1);
	drawAllSquares(area_1, halfPoitSize);

 }
 if(currentOperation == "area_2"){	
         		 
		 if(!area_2){
			 isMovePoint = isClickOnPoint(area_1, point);
			 area_2 = area_1.slice(0);
		}
		 isMovePoint = isClickOnPoint(area_2, point);
 }
 if(isMovePoint === false && isMoveCut === 1){
	 
	 isMoveCut = 2;
	 
 }
 if(isMovePoint === false && isMoveCut === 0 && area_2){
	 
	 	var pathArea  = getPathArea(area_2);
        var point = getCanvasPoint(e);		
							
	if(! ctx.isPointInPath(pathArea, point[0], point[1]) )return;
	 
	 var imgMapArr = getCutImg(ctx, area_2);
	 getImg(imgMapArr[0], imgMapArr[1]);
	 isMoveCut = 1;
	 movePointStart = getCanvasPoint(e);
	 
 }


 
};
///рисует область выделения и перемещает точку выделения
canvas.onmousemove = function (e) { 
	document.body.style.cursor = "auto";
	if(isMovePoint !== false){
		//console.log(isMovePoint);
		area_2[isMovePoint] = getCanvasPoint(e);
		//console.log(area_2);
	if(!saveImg){
		ctx.drawImage(img, 0, 0);
	}else{
		ctx.putImageData(saveImg, 0, 0);
	} 
		drawArea(area_2, true, 2);
		drawAllSquares(area_2, halfPoitSize)
		
	}else{
		
		var pathArea = false;
        var point = getCanvasPoint(e);		
		if(area_2){			
			pathArea = getPathArea(area_2);	
            area_1 = area_2.slice(0);			
		}else if(isEndArea_1){
			pathArea = getPathArea(area_1);
			area_2 = area_1.slice(0);
		}
		if(isMoveCut == false && pathArea && ctx.isPointInPath(pathArea, point[0], point[1]) ){
			document.body.style.cursor = "pointer";
			isMoveCut = 0;
		}else{
			
			
		}
	}
	if(isMovePoint === false && isMoveCut === 1 || isMovePoint === false && isMoveCut === 2){
		
		movePointEnd = getCanvasPoint(e);
		
		var distance = [movePointStart[0] - movePointEnd[0], movePointStart[1] -  movePointEnd[1] ];
		
		area_3 = getCutSize(area_2, distance[0], distance[1]);
		
			if(!saveImg){
				ctx.drawImage(img, 0, 0);
			}else{
				ctx.putImageData(saveImg, 0, 0);
			}
			   // ctx.save();
				//ctx.translate( moveImgArr[1][0]-distance[0], moveImgArr[1][1]-distance[1]);
			   // ctx.rotate(rotateFigure * Math.PI / 180);
				
				ctx.drawImage(moveImgArr[0], moveImgArr[1][0]-distance[0], moveImgArr[1][1]-distance[1]);
				//ctx.restore();
				if(isMoveCut === 1){
					drawArea(area_3, true, 2);
					drawAllSquares(area_3, halfPoitSize);
				}
				 
				//ctx.rotate((rotateFigure * Math.PI / 180)*(-1));
			    if(isMoveCut === 2){
					
					saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
					drawArea(area_2, true, 2);
					drawAllSquares(area_2, halfPoitSize);
					isMoveCut = false;
				}
	}
}
//масштабирует точку на площади
canvas.onmouseup = function (e) { 
	//console.log(isMovePoint);
	if(isMovePoint !== false){
		
		var side = getSquareSide(area_2, area_2[isMovePoint]);
		var imgArr;
		if(side == 0){			
			imgArr = cutAndScale_X(ctx, area_1, area_2, isMovePoint, false, true);			
		}else if(side == 2){			
			imgArr = cutAndScale_X(ctx, area_1, area_2, isMovePoint, true, true, );
		}else if(side == 1){			
			imgArr = cutAndScale_Y(ctx, area_1, area_2, isMovePoint, false, true);
		}else if(side == 3){			
			imgArr = cutAndScale_Y(ctx, area_1, area_2, isMovePoint, true, true);
		}  
		drawImgData( ctx, imgArr[0], imgArr[1]);
		
		isMovePoint = false;

		area_1 = area_2.slice(0);
	
	}
}
///добавляет точку к области 1 после указанного индекса
add_point_button.onclick = function(event){ 
       
	   event.preventDefault();
	   
       var index = parseInt(document.querySelector("form").querySelector("input").value);

		  if( addPointTooArray(area_1, index ) ){
			  
			  area_2 = area_1.slice(0);
		  };
   
}
///сбрасывает текущее выделение
reset.onclick = function(event){ 
       
	   event.preventDefault();
		isMovePoint = false;
	    area_1 = [];
        isEndArea_1 = false;
        area_2 = false;
        currentOperation = "area_1";
	if(!saveImg){
		ctx.drawImage(img, 0, 0);
	}else{
		ctx.putImageData(saveImg, 0, 0);
	}
   
  
}

add_img_button.onclick = function(event){ 
       

   var fd = document.forms["formA"].elements['img'].value;
   	 img = new Image();
	 img.crossOrigin = "Anonymous";
	 img.src=fd;
	 img.onload = function(){ 

		 srcWidth=img.naturalWidth;
		 srcHeight=img.naturalHeight;
	
		canvas.width=srcWidth;
		canvas.height=srcHeight;	        
		ctx.drawImage(img, 0, 0); 
		saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);

	}
  
}














