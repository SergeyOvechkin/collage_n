
var area_1 = [];
var isEndArea_1 = false;
var area_2 = false;
var currentOperation = "area_1";
var halfPoitSize = 5;
var isMovePoint = false;

	
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
canvas.onmousemove = function (e) { 
	
	if(isMovePoint !== false){
		//console.log(isMovePoint);
		area_2[isMovePoint] = getCanvasPoint(e);
		//console.log(area_2);
		ctx.drawImage(img, 0, 0); 
		drawArea(area_2, true, 2);
		drawAllSquares(area_2, halfPoitSize)		
	}
}
canvas.onmouseup = function (e) { 
	//console.log(isMovePoint);
	if(isMovePoint !== false){
		
		
        cutAndScale(area_1, area_2, isMovePoint);
		isMovePoint = false;
	}
}
///добавляет точку к области после указанного индекса
add_point_button.onclick = function(event){ 
       
	   event.preventDefault();
	   
       var index = parseInt(document.querySelector("form").querySelector("input").value);

		  if( addPointTooArray(area_1, index ) ){
			  
			  area_2 = area_1.slice(0);
		  };
   
}
