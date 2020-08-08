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
     //   drawImageInPerspective(ctx, 50,  0,  0, 0, 0, 0, srcWidth, srcHeight);
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
var cutPathArea_1 = null;
function cutAndScale(area_1, area_2){
	
	pathArea_1 = getPathArea(area_1);
	
	canvas.onmousedown = function (e) {
	
	var point = getCanvasPoint(e);
	
   console.log( ctx.isPointInPath(pathArea_1, point[0], point[1]) );
};
	
	console.log(area_1);	
	var imgBox = getBox(area_1);

	var cutWidth = imgBox[1][0] - imgBox[0][0];
	var cutHeight = imgBox[1][1] - imgBox[0][1];
	var cutArea = getCutSize(area_1, imgBox[0][0], imgBox[0][1]);
	var cutPathArea_1 =  getPathArea(cutArea);
	
	var imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);
	var imgData = imgMap.data;
	var imgMap2 = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);
	var imgData2 = imgMap.data;
	     
	var startI = imgBox[2];
	//var startI_2 = 
		 console.log(startI);
		 console.log(cutArea);

			for(var tmpY = 0; tmpY <  cutHeight; tmpY++) {
								
				for(var tmpX = 0;  tmpX < cutWidth; tmpX++) {

					var point = (tmpY*cutWidth+tmpX)*4; 

					var x_1 = point; var x_2 = point ;
					
					imgData[ x_1] = imgData2 [x_2];
					imgData[ x_1+1] = imgData2 [x_2+1];
					imgData[ x_1+2] = imgData2 [x_2+2];
					imgData[ x_1+3] = imgData2 [x_2+3];
					
					if(!ctx.isPointInPath(cutPathArea_1, tmpX, tmpY)){
						imgData[ x_1+3] = 0;
					}
									
				}
			}
			
	ctx.clearRect(0, 0, srcWidth, srcHeight);
	ctx.putImageData(imgMap, imgBox[0][0], imgBox[0][1]);
	
}

function getNextPoints(area, startI){
	
	
	
}

function getPathArea(area){
	
	let path = new Path2D();
	
	path.moveTo(area[0][0], area[0][1]);
	
	for(var i=1; i<area.length; i++){
		
		path.lineTo(area[i][0], area[i][1]);
	
	}
	path.closePath();
	
	return path;
}


function getBox(area){	
	var start = [null, null];
	var end = [null, null];
    var startIndexes = {l: null, r: null};
    var L_i = null;	
	var direction = area.forEach(function (pos, k){		
		if(startIndexes.l == null || area[startIndexes.l][1] > pos[1]){			
			startIndexes.l = k;
            L_i = k;			
		}
	});
	var direction = area.forEach(function (pos, k){	
	     if(k != L_i){
			if(startIndexes.r == null || area[startIndexes.r][1] > pos[1]){			
				startIndexes.r = k;			
			}	
		 }	
	});
	if(area[startIndexes.l][0] > area[startIndexes.r][0]){
		
		var h = startIndexes.l;
		var t = startIndexes.r;
		startIndexes.l = t; startIndexes.r = h;
	}
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
	//console.log(direction);
	return [start, end, startIndexes];	
}

function getCutSize(area, startX, startY){	
	return area.map(function(pos){		
		return [pos[0]-startX, pos[1]-startY];
	})
}


