

    function drawRectangle(){
		
		
		
		
		
	}
	
	
var area_1 = [];
var currentOperation = "arrea_1";	
	
	//определяет клики по кнопке button (play now)
canvas.onmousedown = function (e) {
	
	var bbox = canvas.getBoundingClientRect();
	
	var point = [e.clientX - bbox.left * (canvas.width / bbox.width), e.clientY - bbox.top * (canvas.height / bbox.height)];
    
  if(currentOperation == "arrea_1"){	
	endArea("arrea_1", point);
	area_1.push(point);	
	drawArea(area_1);
	mouseSquare(point, 10);
 }
 if(currentOperation == "arrea_2"){	



 }	
    
};
function isClickOnPoint(point){
	
	var isClick = false;
	
	for(var i=0; i<area_1.length; i++){
		
		if(point[0] - area_1[0][0] <= Math.abs(5) && point[1] - area_1[0][1] <= Math.abs(5)){
			
			
			
		}		
	}	
}
function endArea(operation, point){	
			if(operation == "arrea_1" && area_1.length > 3){		
			if(point[0] - area_1[0][0] <= Math.abs(5) && point[1] - area_1[0][1] <= Math.abs(5)){			
				point[0] = area_1[0][0];
				point[1] = area_1[0][1];				
			    currentOperation = "arrea_2"	
			}		
		}	
}
function drawArea(area){	
	if(area.length > 1){
		for(var i=1; i<area.length; i++){			
			drawLine(area[i-1], area[i]);
		}		
	}	
}
function drawLine(point1, point2){	
	ctx.strokeStyle = "red";
	ctx.beginPath();       // Начинает новый путь
	ctx.moveTo(point1[0], point1[1]);    // Рередвигает перо в точку (30, 50)
	ctx.lineTo(point2[0], point2[1]);  // Рисует линию до точки (150, 100)
	ctx.lineWidth = 3;
	ctx.stroke();
}
///рисует квадрат 
function mouseSquare(point, size){
	
	ctx.fillStyle = "yellow";
	ctx.fillRect(point[0]-size/2, point[1]-size/2, size, size);
	
}