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
///возвращает сторону квадрата 
function getSquareSide(area, indexPoint){
	
	var imgBox = getBox(area);	
	var side = 0;	
	var halfW = (imgBox[1][0] - imgBox[0][0])/2;
	var halfH = (imgBox[1][1] - imgBox[0][1])/2;
	
	var l_x = indexPoint[0] - imgBox[0][0];
	var r_x = imgBox[1][0] - indexPoint[0];
	var t_y = indexPoint[1] - imgBox[0][1];
	var b_y = imgBox[1][1] - indexPoint[1];
	
	if(indexPoint[0] < imgBox[0][0] + halfW && indexPoint[1] < imgBox[0][1] + halfH ){
		side = 3;
		if(halfW/l_x > halfH/t_y)side = 2;		
		//side = 0;
	}
	if(indexPoint[0] < imgBox[0][0] + halfW && indexPoint[1] > imgBox[0][1] + halfH ){
		side = 1;
		if(halfW/l_x > halfH/b_y )side = 2;
		//side = 3;
	}
	if(indexPoint[0] > imgBox[0][0] + halfW && indexPoint[1] > imgBox[0][1] + halfH ){
		side = 1;
		if(halfW/r_x > halfH/b_y )side = 0;
		//side = 2;
	}
	if(indexPoint[0] > imgBox[0][0] + halfW && indexPoint[1] < imgBox[0][1] + halfH ){
		side = 3;
		if(halfW/r_x > halfH/t_y )side = 0;
		//side = 1;
	}
	return side;
	//console.log(side);	
}
//замыкает контур фигуры при клике на начальную точку
function endArea(operation, point){	
		if(operation == "area_1" && area_1.length > 3){		
			if( Math.abs(point[0] - area_1[0][0]) <= halfPoitSize && Math.abs(point[1] - area_1[0][1]) <= halfPoitSize){			
				point[0] = area_1[0][0];
				point[1] = area_1[0][1];
				isEndArea_1 = true;
			   // currentOperation = "arrea_2"
                return true;				
			}		
		}
        return false;		
}
//рисует многоугольник из точек если передать isEnd = true замыкает его на нулевой точке
function drawArea(area, isEnd, areaNumb){	
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
//ctx.translate( moveImgArr[1][0]-distance[0], moveImgArr[1][1]-distance[1]);
//ctx.rotate(rotateFigure * Math.PI / 180);
///рисует квадрат для точки площади выделения
function mouseSquare(point, halfPoitSize, number){	
	ctx.fillStyle = "yellow";
	ctx.fillRect(point[0]-halfPoitSize, point[1]-halfPoitSize, halfPoitSize*2, halfPoitSize*2);
	if(number != undefined){
		ctx.fillStyle = "black";
		ctx.fillText(number, point[0]-halfPoitSize, point[1]+halfPoitSize/2, halfPoitSize*2);
	}
}
///возвращает координаты токчи при клике на канвас
function getCanvasPoint(e){
	var bbox = canvas.getBoundingClientRect();	
	return [e.clientX - bbox.left * (canvas.width / bbox.width), e.clientY - bbox.top * (canvas.height / bbox.height)];
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
///возвращает прямоугольник с координатами в который вписана данная область
function getBox(area){	
	var start = [null, null];
	var end = [null, null];
	for (var i=0; i<area.length; i++){
		
		if(start[0] === null || area[i][0] < start[0]){			
			start[0] = area[i][0];
		}
		if(end[0] === null || area[i][0] > end[0]){
			end[0] = area[i][0];				
		}
		if(start[1] === null || area[i][1] < start[1]){			
			start[1] = area[i][1];
		}
		if(end[1] === null || area[i][1] > end[1]){
			end[1] = area[i][1];				
		}		
	}
	return [start, end];	
}
///возвращает координаты области относительно прамоугольника в который она вписана
function getCutSize(area, startX, startY){	
	return area.map(function(pos){		
		return [pos[0]-startX, pos[1]-startY];
	})
}
//получает массив с двумя imgData объектами для последующей трансформации
function getImgData(typeOperation,  imgBox, imgBox2, cutWidth, cutWidth2, cutHeight, cutHeight2, ctx){	
	var imgMap, imgMap2;	
	if(typeOperation == "big" ){      		
		 imgMap = ctx.getImageData(imgBox2[0][0], imgBox2[0][1], cutWidth2 , cutHeight2);		 
		imgMap2 = ctx.getImageData(imgBox2[0][0], imgBox2[0][1], cutWidth2 , cutHeight2);				
	}else{       		
		imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);	
		imgMap2 = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);			
	}
	return [imgMap, imgMap2]
}

//метод масштабирует точку выделенной площади area_2 относительно точки площади area_1
//movePoint - индекс точки из массивов area_1 и area_2 
//flip - true -масштабирует левую часть области изображения, false правую
//area_1, area_2, - массивы с точками выделенной области до масштабирования и после, точка - также массив в формате [x, y];
// transparent - делает прозрачной область вокруг выделения (пока не работает)
function cutAndScale_X(ctx, area_1, area_2, movePoint, flip, transparent){	
   
	//определяем смещение точек
    //определяем начальные и конечные индексы
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][1] > area_1[endIndex][1]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	
	//определяем смещение точек
	var moveDistance = area_2[movePoint][0] - area_1[movePoint][0];
	if(flip)moveDistance = moveDistance * (-1);
	var typeOperation = "big"; if(moveDistance < 0)typeOperation = "little";

	
    ///прямогугольники в которые вписана данная область	
	var imgBox = getBox(area_1); var imgBox2 = getBox(area_2);
	
	//ширина и высота прямоугольников
	var cutWidth = imgBox[1][0] - imgBox[0][0]; var cutHeight = imgBox[1][1] - imgBox[0][1];
	var cutWidth2 = imgBox2[1][0] - imgBox2[0][0]; var cutHeight2 = imgBox2[1][1] - imgBox2[0][1];
	
	//точки площади с вычетом рассояния до прямоугольника
	var cutArea = getCutSize(area_1, imgBox[0][0], imgBox[0][1]); var cutArea2 = getCutSize(area_2, imgBox2[0][0], imgBox2[0][1]);
	
	//обект области фигуры
	var cutPathArea_1 =  getPathArea(cutArea); var cutPathArea_2 =  getPathArea(cutArea2);

	
	//вырезаный обект с пикселями для редактирования
	var diff = 0;
	if(typeOperation == "little" && flip){
		 diff = cutWidth - cutWidth2;
	}
	if(!saveImg){
		ctx.drawImage(img, 0, 0);
	}else{
		ctx.putImageData(saveImg, 0, 0);
	}
	
	var H , W;
	if(typeOperation == "big" ){
		 H = cutHeight2; W = cutWidth2;		 
	}else{		
		H = cutHeight; W = cutWidth;
	}	
	var imgMapArr = getImgData(typeOperation, imgBox, imgBox2, cutWidth, cutWidth2, cutHeight, cutHeight2, ctx);
	var imgMap = imgMapArr[0], imgData = imgMap.data, imgMap2  = imgMapArr[1], imgData2 = imgMap2.data;
	 
	        var currentY_st = cutArea2[startIndex][1]; var currentX_st = cutArea2[startIndex][0];
			var currentY_end = cutArea2[movePoint][1]; var currentX_end = cutArea2[movePoint][0];
			var middleX = cutArea2[movePoint][0];
			var segmentH = currentY_end - currentY_st;
			var segmentDole = 0.0001;
			var count  = 1; //текущий отрезок высоты
			
			var isMove = false;
			
			var startSegmentX_count = 0;
		     var startSegmentX_ = 1;

			for(var tmpY = 0; tmpY <  H; tmpY++) {
				
				isMove = false;
				if(tmpY > currentY_end && count == 1){
					count = 2;
				    currentY_st = cutArea2[movePoint][1]; currentX_st = cutArea2[movePoint][0];
					currentY_end = cutArea2[endIndex][1]; currentX_end = cutArea2[endIndex][0];
					segmentH = currentY_end - currentY_st;
				}
                if(tmpY >= currentY_st && tmpY <= currentY_end){
					isMove = true;
					segmentDole = (tmpY - currentY_st)/segmentH;
					if(count == 2)segmentDole = 1- segmentDole;
				}	
				var startSegmentX = false;				
				for(var tmpX = 0;  tmpX < W; tmpX++) {										
					if(startSegmentX === false)startSegmentX = 0;					
					var point = (tmpY*W+tmpX+diff)*4; 
					var point2 = (tmpY*W+diff)*4;
					//var x_1 = point;				
					if(ctx.isPointInPath(cutPathArea_2, tmpX, tmpY)){						
						if(startSegmentX === 0)startSegmentX = tmpX;						
						if(startSegmentX_count === 0){
							startSegmentX_count =1;
						}						
						if(isMove){
							if(!flip){
								point2  = point2  + Math.round( (tmpX/((moveDistance*segmentDole/( middleX-startSegmentX-(moveDistance*segmentDole)) )+1)) )*4; 
							}else{
								point2  = point2  +  Math.round( tmpX+moveDistance*segmentDole*(1-(tmpX/( W*(startSegmentX_/W) )))  )*4;
							}	
						}else{							
							point2 += (tmpX)*4;								
						}						
						    imgData[point] = imgData2[point2]; imgData[ point+1] = imgData2 [point2+1]; imgData[ point+2] = imgData2 [point2+2]; imgData[ point+3] = imgData2 [point2+3];							
					}else{
						if(startSegmentX_count === 1 && startSegmentX > 0){							
							startSegmentX_ = tmpX;
							startSegmentX_count =0;

						}
						if(transparent)imgData[ point+3] = 0; //прозрачным область вокруг площади выделения		
					}								
				}
			}
        return [imgMap, [imgBox2[0][0]-diff,  imgBox2[0][1] ] ]; 			
	    //ctx.fillRect(0, 0, srcWidth, srcHeight);
		//ctx.putImageData(imgMap, imgBox2[0][0]-diff, imgBox2[0][1]);
		//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
		
}
//аналогичен предыдущему только по вертикали flip - true -для верхней стороны картинки, false нижней
function cutAndScale_Y(ctx, area_1, area_2, movePoint, flip, transparent){	

    //определяем начальные и конечные индексы
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][0] > area_1[endIndex][0]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	
	//определяем смещение точек
	var moveDistance = area_2[movePoint][1] - area_1[movePoint][1];
	if(flip)moveDistance = moveDistance * (-1);
	var typeOperation = "big"; if(moveDistance < 0)typeOperation = "little";

	
    ///прямогугольники в которые вписана данная область	
	var imgBox = getBox(area_1); var imgBox2 = getBox(area_2);
	
	//ширина и высота прямоугольников
	var cutWidth = imgBox[1][0] - imgBox[0][0]; var cutHeight = imgBox[1][1] - imgBox[0][1];
	var cutWidth2 = imgBox2[1][0] - imgBox2[0][0]; var cutHeight2 = imgBox2[1][1] - imgBox2[0][1];
	
	//точки площади с вычетом рассояния до прямоугольника
	var cutArea = getCutSize(area_1, imgBox[0][0], imgBox[0][1]); var cutArea2 = getCutSize(area_2, imgBox2[0][0], imgBox2[0][1]);

	//обект области фигуры
	var cutPathArea_1 =  getPathArea(cutArea); var cutPathArea_2 =  getPathArea(cutArea2);

	
	var counter_ =0;
	var diff = 0;
	if(typeOperation == "little" && flip){
		 diff = cutHeight - cutHeight2;
	}
	//вырезаный обект с пикселями для редактирования
	if(!saveImg){
		ctx.drawImage(img, 0, 0);
	}else{
		ctx.putImageData(saveImg, 0, 0);
	}
	var H , W;
	if(typeOperation == "big" ){
		 H = cutHeight2; W = cutWidth2;		 
	}else{		
		H = cutHeight; W = cutWidth;
	}
	 
	var imgMapArr = getImgData(typeOperation, imgBox, imgBox2, cutWidth, cutWidth2, cutHeight, cutHeight2, ctx);
	var imgMap = imgMapArr[0], imgData = imgMap.data, imgMap2  = imgMapArr[1], imgData2 = imgMap2.data;
	 
	        var currentY_st = cutArea2[startIndex][1]; var currentX_st = cutArea2[startIndex][0];
			var currentY_end = cutArea2[movePoint][1]; var currentX_end = cutArea2[movePoint][0];
			var middleY = cutArea2[movePoint][1];
			var segmentW = currentX_end - currentX_st;
			var segmentDole = 0.0001;
			var count  = 1; //текущий отрезок длинны
			
			var isMove = false;
			
			var startSegmentY_count = 0;
		     var startSegmentY_ = 1;

			for(var tmpX = 0; tmpX <  W; tmpX++) {
				
				isMove = false;
				if(tmpX > currentX_end && count == 1){
					count = 2;
				    currentX_st = cutArea2[movePoint][0]; currentY_st = cutArea2[movePoint][1];
					currentX_end = cutArea2[endIndex][0]; currentY_end = cutArea2[endIndex][1];
					segmentW = currentX_end - currentX_st;
				}
                if(tmpX >= currentX_st && tmpX <= currentX_end){
					isMove = true;
					segmentDole = (tmpX - currentX_st)/segmentW;
					if(count == 2)segmentDole = 1- segmentDole;
				}	
				var startSegmentY = false;
				for(var tmpY = 0;  tmpY < H; tmpY++) {
										
					if(startSegmentY === false)startSegmentY = 0;					
					//var point = (tmpX*H+tmpY)*4; 
					//var point2 = (tmpX*H)*4;
					
					var point = ((tmpY+diff)*W+tmpX)*4; 
					var point2, tmpY_ ;// = (tmpY*W)*4;
								
					if(ctx.isPointInPath(cutPathArea_2, tmpX, tmpY)){						
						if(startSegmentY === 0)startSegmentY = tmpY;
						if(startSegmentY_count === 0){
							startSegmentY_count =1;
						}						
						if(isMove){                       
							 if(flip){
								 tmpY_ = Math.round( tmpY+moveDistance*segmentDole*(1-(tmpY/( H*(startSegmentY_/H) )))  );
							 }else{
								 tmpY_ = Math.round( (tmpY/((moveDistance*segmentDole/( middleY-startSegmentY-(moveDistance*segmentDole)) )+1)) );							 
							 }	 						 
                             point2 = ((tmpY_+diff)*W+tmpX)*4;                             							 
						}else{							
							point2 = ((tmpY+diff)*W+tmpX)*4;							
						}						
						    imgData[point] = imgData2[point2]; imgData[ point+1] = imgData2 [point2+1]; imgData[ point+2] = imgData2 [point2+2]; imgData[ point+3] = imgData2 [point2+3];							
					}else{						
						if(transparent)imgData[ point+3] = 0;	
						if(startSegmentY_count === 1 && startSegmentY > 0){							
							startSegmentY_ = tmpY;
							startSegmentY_count =0;

						}
					}								
				}
			}
		 return [imgMap, [imgBox2[0][0],  imgBox2[0][1]-diff] ]; 
	    //ctx.fillRect(0, 0, srcWidth, srcHeight);
		//ctx.putImageData(imgMap, imgBox2[0][0], imgBox2[0][1]-diff);
		//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
}

function drawImgData(ctx, imgMap, point){
	
   Promise.all([
   
    createImageBitmap(imgMap),
    
  ]).then(function(sprites) {
  
    ctx.drawImage(sprites[0], point[0], point[1]);
	saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
    drawArea(area_2, true, 2);
    drawAllSquares(area_2, halfPoitSize);
	
  });
	
}
function getImg(imgMap, point){
	
   Promise.all([
   
    createImageBitmap(imgMap),
    
  ]).then(function(sprites) {
  
    moveImgArr = [sprites[0], point];
	 //ctx.drawImage(sprites[0], 0, 0);
	
  });
	
}
function getCutImg(ctx, area){
	
    ///прямогугольники в которые вписана данная область	
	var imgBox = getBox(area); 
	
	//ширина и высота прямоугольников
	var cutWidth = imgBox[1][0] - imgBox[0][0]; var cutHeight = imgBox[1][1] - imgBox[0][1];
	
	//точки площади с вычетом рассояния до прямоугольника
	var cutArea = getCutSize(area, imgBox[0][0], imgBox[0][1]); 

	//обект области фигуры
	var cutPathArea =  getPathArea(cutArea); 

	if(!saveImg){
		ctx.drawImage(img, 0, 0);
	}else{
		ctx.putImageData(saveImg, 0, 0);
	}
	var H , W;
	
	H = cutHeight; W = cutWidth;
		
		var imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);	
	
			for(var tmpX = 0; tmpX <  W; tmpX++) {
				for(var tmpY = 0;  tmpY < H; tmpY++) {
					
					var point = (tmpY*W+tmpX)*4; 
			
								
					if(! ctx.isPointInPath(cutPathArea, tmpX, tmpY)){						
						
						imgMap.data[ point+3] = 0;	

					}								
				}
			}
		 return [imgMap, [imgBox[0][0],  imgBox[0][1]] ]; 

}




	

	
