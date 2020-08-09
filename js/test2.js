	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	var srcWidth, srcHeight;
	
	 var img = new Image();
	 img.src="./img/img2.jpg";
	 
img.onload = function(){ 

	 srcWidth=img.naturalWidth;
     srcHeight=img.naturalHeight;
	
    canvas.width=srcWidth;
    canvas.height=srcHeight;	        
	ctx.drawImage(img, 0, 0); 		
		//процент увеличения_уменьшения (- отрицательный знак) левого верхнего угла и правого вержнего по вертикали и горизонтали
		//drawImageInPerspective(ctx, 50,  0,  0, 0, 0, 0, srcWidth, srcHeight);
}


function cutAndScale(area_1, area_2, movePoint){	
	//определяем смещение точек
	var distanseX = area_2[movePoint][0] - area_1[movePoint][0]; var distanseY = area_2[movePoint][1] - area_1[movePoint][1];
    //определяем начало и конец смещения по Y 
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][1] > area_1[endIndex][1]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	var moveDistance = area_2[movePoint][0] - area_1[movePoint][0];
	var typeOperation = "big"; if(area_2[movePoint][0] < area_1[movePoint][0])typeOperation = "little";
	
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
	ctx.drawImage(img, 0, 0); 
	if(typeOperation == "big"){
		
		var imgMap = ctx.getImageData(imgBox2[0][0], imgBox2[0][1], cutWidth2 , cutHeight2);
		var imgData = imgMap.data;
		var imgMap2 = ctx.getImageData(imgBox2[0][0], imgBox2[0][1], cutWidth2 , cutHeight2);
		var imgData2 = imgMap2.data;
		
	}else{
		var imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);
		var imgData = imgMap.data;
		var imgMap2 = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);
		var imgData2 = imgMap2.data;
	
	}
	        var currentY_st = cutArea2[startIndex][1]; var currentX_st = cutArea2[startIndex][0];
			var currentY_end = cutArea2[movePoint][1]; var currentX_end = cutArea2[movePoint][0];
			var middleX = cutArea2[movePoint][0];
			var segmentH = currentY_end - currentY_st;
			var segmentDole = 0.0001;
			var count  = 1; //текущий отрезок высоты
			
			var isMove = false;
			
	        var H = cutHeight2; var W = cutWidth2; if(typeOperation == "little"){H = cutHeight; W = cutWidth;}
	
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
					var point = (tmpY*W+tmpX)*4; 
					var point2 = (tmpY*W)*4;
					var x_1 = point;
					
					if(ctx.isPointInPath(cutPathArea_2, tmpX, tmpY)){						
						if(startSegmentX === 0)startSegmentX = tmpX;						
						if(isMove){
							point2 = point2 + Math.round(tmpX/((moveDistance*segmentDole/( middleX-startSegmentX-(moveDistance*segmentDole)) )+1))*4;							
						}else{							
							point2 += tmpX*4;
						}
						var x_1 = point; var x_2 = point2 ;						
						    imgData[ x_1] = imgData2 [x_2]; imgData[ x_1+1] = imgData2 [x_2+1]; imgData[ x_1+2] = imgData2 [x_2+2]; imgData[ x_1+3] = imgData2 [x_2+3];						
					}else{						
						imgData[ x_1+3] = 256;								
					}								
				}
			}			
	ctx.clearRect(0, 0, srcWidth, srcHeight);
	ctx.drawImage(img, 0, 0); 
	ctx.putImageData(imgMap, imgBox[0][0], imgBox[0][1]);	
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


































    

//процент увеличения_уменьшения (- отрицательный знак) левого верхнего угла и правого вержнего по вертикали и горизонтали
function drawImageInPerspective(ctx, left_y1,  right_y1,  top_x1, top_x2,  x1, y1,  srcWidth, srcHeight ) {

        var targetMap = ctx.getImageData(x1, y1, srcWidth, srcHeight);
		var targetImgData = targetMap.data;
		var targetMap2 = ctx.getImageData(x1, y1, srcWidth, srcHeight);
		var targetImgData2 = targetMap2.data;
		 
		
		if(left_y1 !=0 || right_y1 !=0){
			
			var ofset = left_y1/100;
			
			console.log(srcHeight, srcWidth);
			
			for(var tmpY = 0; tmpY < srcHeight; tmpY++) {

				for(var tmpX = 0;  tmpX < srcWidth; tmpX++) {
					
					var point = (tmpY*srcWidth+tmpX)*4; 
					
					var x_ =  (tmpY*srcWidth)*4 + Math.round(tmpX/(1+1*tmpY/srcHeight))*4 ;
					//console.log(x_, tmpY + tmpX);
					
					var x_1 = point; var x_2 = x_ ;
					
					targetImgData[ x_1] = targetImgData2[x_2];
					targetImgData[ x_1+1] = targetImgData2[x_2+1];
					targetImgData[ x_1+2] = targetImgData2[x_2+2];
					targetImgData[ x_1+3] = targetImgData2[x_2+3];
					
					
				}
			//	console.log(tmpY*srcHeight, tmpY);
			}
			//console.log(targetImgData);
        }
		ctx.fillStyle = "green";
		ctx.fillRect(0, 0, 1000, 1000);
		ctx.putImageData(targetMap, 0, 0);
	    
}


