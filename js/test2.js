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





function cutAndScale_l(area_1, area_2, movePoint){	
 
	//определяем смещение точек
	//var distanseX = area_2[movePoint][0] - area_1[movePoint][0]; var distanseY = area_2[movePoint][1] - area_1[movePoint][1];
    //определяем начальные и конечные индексы
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][1] > area_1[endIndex][1]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	
	//определяем смещение точек
	var moveDistance = area_2[movePoint][0] - area_1[movePoint][0];
	moveDistance = moveDistance * (-1);
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
	var counter_ =0;
	var diff = 0;
	if(typeOperation == "little"){
		 diff = cutWidth - cutWidth2;
	}
	ctx.drawImage(img, 0, 0);
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
							point2  = point2  +  Math.round( tmpX+moveDistance*segmentDole*(1-(tmpX/( W*(startSegmentX_/W) )))  )*4;
						}else{							
							point2 += (tmpX)*4;								
						}						
						    imgData[point] = imgData2[point2]; imgData[ point+1] = imgData2 [point2+1]; imgData[ point+2] = imgData2 [point2+2]; imgData[ point+3] = imgData2 [point2+3];							
					}else{
						if(startSegmentX_count === 1 && startSegmentX > 0){							
							startSegmentX_ = tmpX;
							startSegmentX_count =0;

						}
						//imgData[ point+3] = 0;		
					}								
				}
			}			
	//ctx.fillRect(0, 0, srcWidth, srcHeight);
		ctx.putImageData(imgMap, imgBox2[0][0]-diff, imgBox2[0][1]);
	/*
	function left_b(){
		
		return Math.round( tmpX+moveDistance*segmentDole*(1-(tmpX/( W*(startSegmentX_/W) )))  )*4
	}
	//////////////not end//////
	function left_l(){
		
		var dole = tmpX/startSegmentX_;
		
		//return Math.round( (((tmpX)+moveDistance*segmentDole)*(1 -((moveDistance)/((W-diff)*( (startSegmentX_)/(W))))*segmentDole)))*4;

		return Math.round( tmpX+moveDistance*segmentDole*(1-(tmpX/( W*(startSegmentX_/W) )))  )*4
	}
*/
		
}
function cutAndScale_t(area_1, area_2, movePoint){	


    //определяем начальные и конечные индексы
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][0] > area_1[endIndex][0]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	
	//определяем смещение точек
	var moveDistance = area_2[movePoint][1] - area_1[movePoint][1];
	moveDistance = moveDistance * (-1);
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
	if(typeOperation == "little"){
		 diff = cutHeight - cutHeight2;
	}
	//вырезаный обект с пикселями для редактирования
	ctx.drawImage(img, 0, 0);
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
							 tmpY_ = Math.round( tmpY+moveDistance*segmentDole*(1-(tmpY/( H*(startSegmentY_/H) )))  );
							 //Math.round( (tmpY/((moveDistance*segmentDole/( middleY-startSegmentY-(moveDistance*segmentDole)) )+1)) );
                             point2 = ((tmpY_+diff)*W+tmpX)*4;
                             							 
						}else{							
							//point2 += (tmpY)*4;
							//point2 += (tmpX)*4;
							point2 = ((tmpY+diff)*W+tmpX)*4;							
						}						
						    imgData[point] = imgData2[point2]; imgData[ point+1] = imgData2 [point2+1]; imgData[ point+2] = imgData2 [point2+2]; imgData[ point+3] = imgData2 [point2+3];
							
					}else{						
						//imgData[ point+3] = 0;	
						if(startSegmentY_count === 1 && startSegmentY > 0){							
							startSegmentY_ = tmpY;
							startSegmentY_count =0;

						}
					}								
				}
			}			
	//ctx.fillRect(0, 0, srcWidth, srcHeight);
		ctx.putImageData(imgMap, imgBox2[0][0], imgBox2[0][1]-diff);		
}
function cutAndScale_r(area_1, area_2, movePoint){	

	//определяем смещение точек
	//var distanseX = area_2[movePoint][0] - area_1[movePoint][0]; var distanseY = area_2[movePoint][1] - area_1[movePoint][1];
    //определяем начальные и конечные индексы
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][1] > area_1[endIndex][1]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	
	//определяем смещение точек
	var moveDistance = area_2[movePoint][0] - area_1[movePoint][0];
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
	ctx.drawImage(img, 0, 0);
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
					//var x_1 = point;				
					if(ctx.isPointInPath(cutPathArea_2, tmpX, tmpY)){						
						if(startSegmentX === 0)startSegmentX = tmpX;						
						if(isMove){                       
							 point2  = point2  + Math.round( (tmpX/((moveDistance*segmentDole/( middleX-startSegmentX-(moveDistance*segmentDole)) )+1)) )*4;							
						}else{							
							point2 += (tmpX)*4;
								
						}						
						    imgData[point] = imgData2[point2]; imgData[ point+1] = imgData2 [point2+1]; imgData[ point+2] = imgData2 [point2+2]; imgData[ point+3] = imgData2 [point2+3];
							
					}else{						
						//imgData[ point+3] = 0;	
	
					}								
				}
			}			
	//ctx.fillRect(0, 0, srcWidth, srcHeight);
		ctx.putImageData(imgMap, imgBox2[0][0], imgBox2[0][1]);
		
}
function cutAndScale_b(area_1, area_2, movePoint){	


    //определяем начальные и конечные индексы
	var startIndex = movePoint-1; if(movePoint == 0) startIndex = area_1.length-1;
	var endIndex = movePoint+1; if(movePoint >= area_1.length-1) endIndex = 0;
	if(area_1[startIndex][0] > area_1[endIndex][0]){ var p = endIndex; endIndex = startIndex; startIndex = p; }
	
	//определяем смещение точек
	var moveDistance = area_2[movePoint][1] - area_1[movePoint][1];
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
	ctx.drawImage(img, 0, 0);
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
					
					var point = (tmpY*W+tmpX)*4; 
					var point2, tmpY_ ;// = (tmpY*W)*4;
								
					if(ctx.isPointInPath(cutPathArea_2, tmpX, tmpY)){						
						if(startSegmentY === 0)startSegmentY = tmpY;						
						if(isMove){                       
							 tmpY_ = Math.round( (tmpY/((moveDistance*segmentDole/( middleY-startSegmentY-(moveDistance*segmentDole)) )+1)) );
                             point2 = (tmpY_*W+tmpX)*4;
                             							 
						}else{							
							//point2 += (tmpY)*4;
							//point2 += (tmpX)*4;
							point2 = (tmpY*W+tmpX)*4;							
						}						
						    imgData[point] = imgData2[point2]; imgData[ point+1] = imgData2 [point2+1]; imgData[ point+2] = imgData2 [point2+2]; imgData[ point+3] = imgData2 [point2+3];
							
					}else{						
						//imgData[ point+3] = 0;	
	
					}								
				}
			}			
	//ctx.fillRect(0, 0, srcWidth, srcHeight);
		ctx.putImageData(imgMap, imgBox2[0][0], imgBox2[0][1]);
		
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
function mirrorX(area, areaWidth){
	
	for(var i=0; i<area.length; i++){		
		area[i][0] = areaWidth - area[i][0];		
	}
	return area;
	
}



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





















