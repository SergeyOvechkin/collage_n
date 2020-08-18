


function cutAndScale(area_1, area_2, move_point, transparent, isSaveImg){
	var side = getSquareSide(area_2, area_2[move_point]);
	var imgDataArr;
	if(isSaveImg == undefined || isSaveImg != false)ctx.putImageData(saveImg, 0, 0);
		if(side == 0){			
			imgDataArr = cutAndScale_X(ctx, area_1, area_2, move_point, false, transparent, );			
		}else if(side == 2){			
			imgDataArr = cutAndScale_X(ctx, area_1, area_2, move_point, true, transparent, );
		}else if(side == 1){			
			imgDataArr = cutAndScale_Y(ctx, area_1, area_2, move_point, false, transparent, );
		}else if(side == 3){			
			imgDataArr = cutAndScale_Y(ctx, area_1, area_2, move_point, true, transparent, );
		}
	if(isSaveImg == undefined || isSaveImg != false)saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
	return imgDataArr;
}

function drawAreaPoints(area, isEnd){
	    if(isEnd == undefined)isEnd = true;
		drawArea(area, isEnd);
		drawAllSquares(area, halfPoitSize);
}

///возвращает координаты токчи при клике на канвас
function getCanvasPoint(e, canvas){
	
	var bbox = canvas.getBoundingClientRect();	
	return [e.clientX - bbox.left * (canvas.width / bbox.width), e.clientY - bbox.top * (canvas.height / bbox.height)];
}

//замыкает контур фигуры при клике на начальную точку
function endArea(area, point){	
		if(area.length > 3){		
			if( Math.abs(point[0] - area[0][0]) <= halfPoitSize && Math.abs(point[1] - area[0][1]) <= halfPoitSize){			
				point[0] = area[0][0];
				point[1] = area[0][1];
                return true;				
			}		
		}
        return false;		
}

//рисует многоугольник из точек если передать isEnd = true замыкает его на нулевой точке
function drawArea(area, isEnd){	
	if(area.length > 1){
		for(var i=1; i<area.length; i++){			
			drawLine(area[i-1], area[i]);
		}
        if(isEnd)drawLine(area[area.length-1], area[0]);		
	}	
}
//рисует линию на канвас
function drawLine(point1, point2){	
	ctx.strokeStyle = "red";
	ctx.beginPath();       // Начинает новый путь

		ctx.moveTo(point1[0], point1[1]);    // Рередвигает перо в точку (30, 50)
	    ctx.lineTo(point2[0], point2[1]);  // Рисует линию до точки (150, 100)
		ctx.lineWidth = 3;
		ctx.stroke();
}
//рисует контрольные точки многоугольника
function drawAllSquares(points, halfPoitSize){	
	for (var i=0; i<points.length; i++){		
		mouseSquare(points[i], halfPoitSize, i);
	}
}

///рисует квадрат для точки площади выделения
function mouseSquare(point, halfPoitSize, number){	
	ctx.fillStyle = "yellow";
	ctx.fillRect(point[0]-halfPoitSize, point[1]-halfPoitSize, halfPoitSize*2, halfPoitSize*2);
	if(number != undefined){
		ctx.fillStyle = "black";
		ctx.fillText(number, point[0]-halfPoitSize, point[1]+halfPoitSize/2, halfPoitSize*2);
	}
}
//проверяет клик по угловой точке на многоугольнике
function isClickOnPoint(area ,point){
	for(var i=0; i<area.length; i++){	
		if( Math.abs(point[0] - area[i][0]) <= halfPoitSize*1.5 && Math.abs(point[1] - area[i][1]) <= halfPoitSize*1.5){
           // console.log(i);			
			return i;			
		}		
	}
    return false;	
}
//добавляет точку в массив области выделения
function addPointTooArray(area, index ){
		 
         if(area.length <= index)return false;
			 
		    var index2 = index+1;
		   
		   if(area.length-1 == index)index2 = 0;

            var point = [(area[index2][0] - area[index][0])/2+area[index][0],  (area[index2][1] - area[index][1])/2+area[index][1] ];		   
	   
			area.splice(index+1, 0, point);
			drawArea(area, true);
			drawAllSquares(area, halfPoitSize);
			
           return index+1;
}
function rmPointFromArray(area, index){
	
	        if(area.length-1 < index)return false;
		   
	   
			area.splice(index, 1);
			ctx.putImageData(saveImg, 0, 0);
			drawArea(area, true);
			drawAllSquares(area, halfPoitSize);
			
           return index;
	
}
///возвращает объект области фигуры 
function getPathArea(area){	
	let path = new Path2D();	
	path.moveTo(area[0][0], area[0][1]);	
	for(var i=1; i<area.length; i++){		
		path.lineTo(area[i][0], area[i][1]);	
	}
	path.closePath();	
	return path;
}
function startImg(){	
	ctx.clearRect(0, 0, srcWidth, srcHeight); 	        
	ctx.drawImage(img, 0, 0, img.naturalWidth*mainImgScale, img.naturalHeight*mainImgScale); 
	saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
}





























	

	

