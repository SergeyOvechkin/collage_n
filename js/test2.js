	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	
	 var img = new Image();
	 img.src="./img/img2.jpg";
	 
	


img.onload = function(){ 


	
	var srcWidth=img.naturalWidth;
    var srcHeight=img.naturalHeight;
	
    canvas.width=srcWidth;
    canvas.height=srcHeight;
	        
		ctx.drawImage(img, 0, 0); 
		
		//процент увеличения_уменьшения (- отрицательный знак) левого верхнего угла и правого вержнего по вертикали и горизонтали
        drawImageInPerspective(ctx, 50,  0,  0, 0, 0, 0, srcWidth, srcHeight);
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
