
function CollageSprite(img, area, point, id, point2){
	
	this.id = id;
	this.frame = img;
	this.point = point;
	this.point2 = point2;
	this.area_1 = area;
	this.area_2 = area.slice(0);
	this.cursorOver = false;
	this.currentOperation = false;  //"move" - движение всего спрайта 	"move_point" - искажение
	//this.isMove = false; //движение всего спрайта
	this.moveStart = false; //начало движения "move" координаты
	this.isMovePoint = false; //движение одной точки - ее индекс i	
	this.rotate = 0;
	this.show = true;
	
}
CollageSprite.prototype.rotateArea = function(){
	
	var area = rotationArea(this.area_1, this.rotate);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
}

CollageSprite.prototype.render = function(sprite_id , operationName, option){
	
	if(!this.show)return;
    var area = this.area_1;
		if(operationName == "move_point" && this.id == sprite_id || operationName == "move" && this.id == sprite_id ){
		area = this.area_2;
	}	
	var point = this.point;
	
	
	if(this.rotate !== 0 && option != "rotate_no"){
		//this.rotateArea();
		area = rotationArea(this.area_1, this.rotate);
		if(operationName == "move_point" && this.id == sprite_id || operationName == "move" && this.id == sprite_id ){
			area = rotationArea(this.area_2, this.rotate);
		}
		if(operationName == "move_point" && this.id == sprite_id){			
			area = this.temporalArr.area_2;
		}
		
		    var halfW = (this.point2[0] - this.point[0])/2;
			var halfH = (this.point2[1] - this.point[1])/2;			
			var move = [this.point[0]+  halfW, this.point[1] + halfH];

			ctx.translate(move[0],   move[1]);
			ctx.rotate(this.rotate);
			ctx.drawImage(this.frame, -halfW, -halfH);
			ctx.rotate(-this.rotate);
			ctx.translate( -move[0],  -move[1]);
			
	}else{
		
		ctx.drawImage(this.frame, point[0], point[1]);
	}

	if(this.id == sprite_id && operationName != "scale"){	
		drawAreaPoints(area)
	}
}

CollageSprite.prototype.mousedown = function(point){	
	if(this.cursorOver){     //move движение всего спрайта							
		if(this.moveStart === false && this.isMovePoint === false && this.currentOperation === false){
			this.moveStart = point;
			this.currentOperation = "move";
			this.savePoints = {point: this.point.slice(0), point2: this.point2.slice(0),}
            return ;								
		}							
	}
	/*var area = this.area_1;
	if(this.rotate !== 0){
		area = rotationArea(this.area_1, this.rotate);
		this.temporalArr = {area_1: area.slice(0), area_2: area.slice(0)};
	}
	var isClick = isClickOnPoint(area ,point);
	if(isClick !==false && this.currentOperation === false){   //move_poin движение одной точки i (искажение)							
			this.currentOperation = "move_point";
			this.isMovePoint = isClick;							
	}	*/
}
CollageSprite.prototype.mousemove  = function(point, context){
	
	if(this.currentOperation === "move"){					                        //move движение всего спрайта					
		var distance = [this.moveStart[0] - point[0], this.moveStart[1] -  point[1] ];		
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.point = [this.savePoints.point[0] -distance[0],  this.savePoints.point[1] -distance[1]];
		this.point2 = [this.savePoints.point2[0] -distance[0], this.savePoints.point2[1] -distance[1]];
		context.$methods().renderAll("move");
	}
	/*if(this.currentOperation === "move_point"){
		//move_poin движение одной точки i (искажение)
		if(this.rotate !== 0){ 
			this.temporalArr.area_2[this.isMovePoint] = point;
		}else{
			this.area_2[this.isMovePoint] = point;
		}
		
		context.$methods().renderAll("move_point");
	}*/
}
CollageSprite.prototype.mouseup  = function(context){ 

	if(this.currentOperation == "move"){ 													
		var movePointEnd = getCanvasPoint(event, canvas);
		this.currentOperation = false;
		var distance = [this.moveStart[0] - movePointEnd[0], this.moveStart[1] -  movePointEnd[1] ];
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.area_1 = this.area_2.slice(0);
		this.point = [this.savePoints.point[0] -distance[0],  this.savePoints.point[1] -distance[1]];
		this.point2 = [this.savePoints.point2[0] -distance[0], this.savePoints.point2[1] -distance[1],  ];
		context.$methods().renderAll();
		this.moveStart =false;
	}
	/*
	if(this.currentOperation === "move_point"){
		context.$methods().renderAll("scale", "rotate_no");
		if(this.rotate !== 0){

            var distance = getDistance(this.temporalArr.area_2[this.isMovePoint], this.temporalArr.area_1[this.isMovePoint]);			

			var R = (distance[1] )*(distance[1])+(distance[0] )*(distance[0] );
			R = Math.sqrt(R)
			console.log(R);
			var X = R*Math.cos(-this.rotate);
			var Y = R*Math.sin(-this.rotate);
			console.log(X, Y);
			
			this.area_2 = this.area_1.slice(0);
         	this.area_2[this.isMovePoint][0] +=	distance[0]; this.area_2[this.isMovePoint][1] += distance[1] Y;	
		}
        var imgDataArr = cutAndScale(this.area_1, this.area_2, this.isMovePoint, true, false)		
		getImgToSprite(imgDataArr, this)								
		this.currentOperation = false;
		this.isMovePoint = false;
		this.area_1 = this.area_2.slice(0);							
	}
	*/
}
CollageSprite.prototype.cursorOver_ = function(point){
	var area = this.area_1;
	if(this.rotate !== 0){
		area = rotationArea(this.area_1, this.rotate);
	}	
	var pathArea = getPathArea(area);						 
	var isOver = ctx.isPointInPath(pathArea, point[0], point[1]);	
	if(isOver){							
		document.body.style.cursor = "pointer";
		this.cursorOver = true;
	}else{
		document.body.style.cursor = "auto";
		this.cursorOver = false;
	}	
}
















