
function getCutImg(ctx, area, isDrawSaveImg){
	
    ///прямогугольники в которые вписана данная область	
	var imgBox = getBox(area); 
	
	//ширина и высота прямоугольников
	var cutWidth = imgBox[1][0] - imgBox[0][0]; var cutHeight = imgBox[1][1] - imgBox[0][1];
	
	//точки площади с вычетом рассояния до прямоугольника
	var cutArea = getCutSize(area, imgBox[0][0], imgBox[0][1]); 

	//обект области фигуры
	var cutPathArea =  getPathArea(cutArea); 
	
	if(isDrawSaveImg != false){
		if(!saveImg){
			ctx.drawImage(img, 0, 0);
		}else{
			ctx.putImageData(saveImg, 0, 0);
		}
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
		 return [imgMap, [imgBox[0][0],  imgBox[0][1]],  [imgBox[1][0],  imgBox[1][1]] ]; 

}
function addEffect(ctx, area, rgbaArr){
	
	var imgBox = getBox(area); 	
	var cutWidth = imgBox[1][0] - imgBox[0][0]; var cutHeight = imgBox[1][1] - imgBox[0][1];
	var cutArea = getCutSize(area, imgBox[0][0], imgBox[0][1]); 
	var cutPathArea =  getPathArea(cutArea); 
	ctx.putImageData(saveImg, 0, 0);
	
	var rgbaArr_action = [false, false, false, false];
	
	var rgbaArr_numb = [false, false, false, false];
	
	for(var i=0; i< rgbaArr.length; i++){
		
		if(rgbaArr[i] !== false && rgbaArr[i] != "" && rgbaArr[i] != undefined){
            
			console.log(i);
			
			if(rgbaArr[i].slice(0, 2) == "+="){
				rgbaArr_action[i] = "add";
				rgbaArr_numb[i] = parseInt(rgbaArr[i].slice(2));
			}else if(rgbaArr[i].slice(0, 2) == "-="){
				rgbaArr_action[i] = "subtract";
				rgbaArr_numb[i] = parseInt( rgbaArr[i].slice(2) );
			}else if(rgbaArr[i].slice(0, 2) == "*="){
				rgbaArr_action[i] = "multiply";
				rgbaArr_numb[i] = parseInt(  rgbaArr[i].slice(2) );
			}
			else if(rgbaArr[i].slice(0, 2) == "/="){
				rgbaArr_action[i] = "split";
				rgbaArr_numb[i] = parseInt(  rgbaArr[i].slice(2) );
			}else{
				rgbaArr_action[i] = "set";
				rgbaArr_numb[i] = parseInt( rgbaArr[i] );
			}
		}		
	}		
	var H , W;	
	H = cutHeight; W = cutWidth;
		
		var imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);  	
	
			for(var tmpX = 0; tmpX <  W; tmpX++) {
				for(var tmpY = 0;  tmpY < H; tmpY++) {
					
					var point = (tmpY*W+tmpX)*4; 								
					if(ctx.isPointInPath(cutPathArea, tmpX, tmpY)){						
						
						for (var i=0; i<4; i++){
							if(rgbaArr_action[i] == "set"){
								imgMap.data[ point+i] = rgbaArr_numb[i];
							}else if(rgbaArr_action[i] == "add"){
								imgMap.data[ point+i] += rgbaArr_numb[i];
							}else if(rgbaArr_action[i] == "subtract"){
								imgMap.data[ point+i] -= rgbaArr_numb[i];
							}else if(rgbaArr_action[i] == "multiply"){
								imgMap.data[ point+i] *= rgbaArr_numb[i];
							}else if(rgbaArr_action[i] == "split"){
								imgMap.data[ point+i] /= rgbaArr_numb[i];
							}	
						}
					}								
				}
			}
			ctx.putImageData(imgMap, imgBox[0][0], imgBox[0][1]);
}
function addEffect_1(ctx, area, script){
	var temporaryObj = {};
	var imgBox = getBox(area); 	
	var cutWidth = imgBox[1][0] - imgBox[0][0]; var cutHeight = imgBox[1][1] - imgBox[0][1];
	var cutArea = getCutSize(area, imgBox[0][0], imgBox[0][1]); 
	var cutPathArea =  getPathArea(cutArea); 
	ctx.putImageData(saveImg, 0, 0);
	
	//var script = eval(script1);
	//console.log(eval(script));
		
	var H , W;	
	H = cutHeight; W = cutWidth;
		
		var imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);  	
	
			for(var tmpX = 0; tmpX <  W; tmpX++) {
				for(var tmpY = 0;  tmpY < H; tmpY++) {
					
					var point = (tmpY*W+tmpX)*4; 								
					if(ctx.isPointInPath(cutPathArea, tmpX, tmpY)){							
												
						var arr_ = runEval(imgMap.data[ point], imgMap.data[ point+1], imgMap.data[ point+2], imgMap.data[ point+3], tmpX, tmpY, W, H, temporaryObj);
						imgMap.data[ point] = arr_ [0]; imgMap.data[ point+1] = arr_ [1]; imgMap.data[ point+2] = arr_ [2]; imgMap.data[ point+3] = arr_ [3];
						
					}								
				}
			}
			ctx.putImageData(imgMap, imgBox[0][0], imgBox[0][1]);
			
	function runEval(R,G,B,A,X,Y,W,H,TMP){	
		eval(script);	
		return [R,G,B,A];
	}		
}

function getImgToSprite(imgMapArr, sprite, isRender){
   Promise.all([
   
    createImageBitmap(imgMapArr[0]),
    
  ]).then(function(sprites) {   
    sprite.point = 	imgMapArr[1];
	sprite.point2 = imgMapArr[2];
    sprite.frame = sprites[0];
	if(isRender != false)sprite.render(sprite.id);
  });
	
}
function drawImgData(ctx, imgMap, point, area, mirror_x, mirror_y, width, height){
	
   Promise.all([
   
    createImageBitmap(imgMap),
    
  ]).then(function(sprites) {
	  
	ctx.save();
						
	if(mirror_x){
		var imgBox = getBox(area);
	    ctx.translate(imgBox[1][0], 0);
		ctx.scale( -1, 1);
		ctx.translate(-imgBox[1][0]+(imgBox[1][0]-imgBox[0][0]), 0);			
	}
	if(mirror_y){
		var imgBox = getBox(area);
		ctx.translate(0, imgBox[1][1]);
		ctx.scale( 1, -1);
		ctx.translate(0, -imgBox[1][1]+(imgBox[1][1]-imgBox[0][1]));		
	}			  
	 if(width && height){
		 
		 ctx.drawImage(sprites[0], point[0], point[1], width, height);
	 } else{
		 ctx.drawImage(sprites[0], point[0], point[1]);
	 }
    
	saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
	
	ctx.restore();
	
    drawArea(area, true);
    drawAllSquares(area, halfPoitSize);
	
  });
	
}
function rotateImgData(ctx, imgMap, point, point2, area, fi, callb){
	
	var move = [point[0]+(point2[0] - point[0])/2, point[1]+(point2[1] - point[1])/2];
	
	ctx.translate( move[0],  move[1]);
	ctx.rotate(fi);
	
   Promise.all([
   
    createImageBitmap(imgMap),
    
  ]).then(function(sprites) {
	  
    ctx.drawImage( sprites[0], -(point2[0] - point[0])/2, -(point2[1] - point[1])/2 ) ;
	
	ctx.rotate(-fi);
	ctx.translate( -move[0],  -move[1]);
	saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);	
	callb();
		
    //drawArea(area, true);
   // drawAllSquares(area, halfPoitSize);
	
  });
	
}
function rotationArea(area, fi){
	
	var imgBox = getBox(area);
	var width = imgBox[1][0] - imgBox[0][0];
	var height = imgBox[1][1] - imgBox[0][1];
	
	var cutArea = getCutSize(area, imgBox[0][0]+width/2, imgBox[0][1]+height/2);
	
	var newArr = [];
	
	for(var i=0; i< cutArea.length; i++){
		var X = cutArea[i][0] * Math.cos(fi) - cutArea[i][1] * Math.sin(fi) ;
		var Y = cutArea[i][1] * Math.cos(fi) + cutArea[i][0]  * Math.sin(fi) ;
		newArr.push( [Math.round(X+imgBox[0][0]+width/2), Math.round(Y+imgBox[0][1]+height/2)] );
	}
	return newArr;	
}
function scaleArea(area, coeff_x, coeff_y){
	var imgBox = getBox(area);
	var width = imgBox[1][0] - imgBox[0][0];
	var height = imgBox[1][1] - imgBox[0][1];
	var cutArea = getCutSize(area, imgBox[0][0]+ width/2, imgBox[0][1]+height/2);
	//cutArea = getCutSize(area, width/2, height/2);
	var newArr = [];
	var X, Y;
	 for(var i=0; i< cutArea.length; i++){
		if(coeff_x){
			if(cutArea[i][0] > 0){
				//console.log(cutArea[i][0]/(width/2));
				var dist =cutArea[i][0]*coeff_x - cutArea[i][0];				
				X = cutArea[i][0] + dist*cutArea[i][0]/(width/2);
				
				//if(coeff_x >1)X = cutArea[i][0]+(coeff_x*width/2*cutArea[i][0]/width/2);
				//if(coeff_x <1)X = cutArea[i][0]-(coeff_x*width/2*cutArea[i][0]/width/2);
			}else if(cutArea[i][0] < 0){
				var dist = cutArea[i][0] - cutArea[i][0]*coeff_x;
				X = cutArea[i][0] + dist*cutArea[i][0]/(width/2);
			}
		}else{X = cutArea[i][0]}		
		if(coeff_y){
			if(cutArea[i][1] > 0){
				var dist =cutArea[i][1]*coeff_y - cutArea[i][1];				
				Y = cutArea[i][1] + dist*cutArea[i][1]/(height/2);

			}else if(cutArea[i][1] < 0){					
				var dist =cutArea[i][1] - cutArea[i][1]*coeff_y;			
				Y = cutArea[i][1] + dist*cutArea[i][1]/(height/2);				
			}
		}else{Y = cutArea[i][1]}
		newArr.push( [   Math.round(X+imgBox[0][0]+width/2) ,  Math.round(Y+imgBox[0][1]+height/2) ] );
	}
	return newArr;
	
}
function mirror_x_area(area, x, y){
	var imgBox = getBox(area);
	var width = imgBox[1][0] - imgBox[0][0];
	var height = imgBox[1][1] - imgBox[0][1];
	var cutArea = getCutSize(area, imgBox[0][0], imgBox[0][1]);
	var newArr = [];
	var X, Y;
    for(var i=0; i< cutArea.length; i++){
		if(x){X = width - cutArea[i][0];}else{X = cutArea[i][0]}		
		if(y){Y = height - cutArea[i][1];}else{Y = cutArea[i][1]}
		newArr.push( [   Math.round(X+imgBox[0][0]) ,  Math.round(Y+imgBox[0][1]) ] );
	}
	return newArr;	
	
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
	//console.log(side, indexPoint);
	return side;
		
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
function cutAndScale_X(ctx, area_1, area_2, movePoint, flip, transparent, imgData_){	
   
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
		//ctx.drawImage(img, 0, 0);
	}else{
		//ctx.putImageData(saveImg, 0, 0);
	}
	//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
	var H , W;
	if(typeOperation == "big" ){
		 H = cutHeight2; W = cutWidth2;		 
	}else{		
		H = cutHeight; W = cutWidth;
	}
    if(imgData_){
		
		var imgMap = imgData_[0], imgData = imgMap.data, imgMap2  = imgData_[1], imgData2 = imgMap2.data;
	}else{
			var imgMapArr = getImgData(typeOperation, imgBox, imgBox2, cutWidth, cutWidth2, cutHeight, cutHeight2, ctx);
			var imgMap = imgMapArr[0], imgData = imgMap.data, imgMap2  = imgMapArr[1], imgData2 = imgMap2.data;
		
	}	

	 
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
		if(!transparent){
			ctx.putImageData(imgMap, imgBox2[0][0]-diff, imgBox2[0][1]);
		}
        return [imgMap, [imgBox2[0][0]-diff,  imgBox2[0][1] ], [imgBox2[1][0],  imgBox2[1][1] ] ]; 			
	    //ctx.fillRect(0, 0, srcWidth, srcHeight);
		//
		//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
		
}
//аналогичен предыдущему только по вертикали flip - true -для верхней стороны картинки, false нижней
function cutAndScale_Y(ctx, area_1, area_2, movePoint, flip, transparent, imgData_){	

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
		//ctx.drawImage(img, 0, 0);
	}else{
		//ctx.putImageData(saveImg, 0, 0);
	}
	//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
	var H , W;
	if(typeOperation == "big" ){
		 H = cutHeight2; W = cutWidth2;		 
	}else{		
		H = cutHeight; W = cutWidth;
	}
	 
    if(imgData_){
		
		var imgMap = imgData_[0], imgData = imgMap.data, imgMap2  = imgData_[1], imgData2 = imgMap2.data;
	}else{
			var imgMapArr = getImgData(typeOperation, imgBox, imgBox2, cutWidth, cutWidth2, cutHeight, cutHeight2, ctx);
			var imgMap = imgMapArr[0], imgData = imgMap.data, imgMap2  = imgMapArr[1], imgData2 = imgMap2.data;
		
	}
	 
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
	   if(!transparent){
			ctx.putImageData(imgMap, imgBox2[0][0], imgBox2[0][1]-diff);
		}
		 return [imgMap, [imgBox2[0][0],  imgBox2[0][1]-diff], [imgBox2[1][0],  imgBox2[1][1] ]  ]; 
	    //ctx.fillRect(0, 0, srcWidth, srcHeight);
		//ctx.putImageData(imgMap, imgBox2[0][0], imgBox2[0][1]-diff);
		//saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
}


