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
var currentOperation = "area_1"; //текущая операция с массивом начального размера (без смещения)
var halfPoitSize = 5; //размер половины квадрата точки на площади
var isMovePoint = false; //флаг перемещения точки масштабирования
var saveImg = false; //предыдущее преобразование картинки

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
};
///рисует область выделения и перемещает точку выделения
canvas.onmousemove = function (e) { 
	
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
	}
}
//масштабирует точку на площади
canvas.onmouseup = function (e) { 
	//console.log(isMovePoint);
	if(isMovePoint !== false){
		
		var side = getSquareSide(area_2, area_2[isMovePoint]);
		if(side == 0){			
			cutAndScale_X(ctx, area_1, area_2, isMovePoint, false, false);			
		}else if(side == 2){			
			cutAndScale_X(ctx, area_1, area_2, isMovePoint, true, false, );
		}else if(side == 1){			
			cutAndScale_Y(ctx, area_1, area_2, isMovePoint, false, false);
		}else if(side == 3){			
			cutAndScale_Y(ctx, area_1, area_2, isMovePoint, true, false);
		}       
		isMovePoint = false;
		drawArea(area_2, true, 2);
		drawAllSquares(area_2, halfPoitSize);
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












