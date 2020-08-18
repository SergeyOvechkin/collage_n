
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
	this.isMovePoint = false; //движение одной точки i 	
	this.rotate = 0;
	this.show = true;
	
}
CollageSprite.prototype.rotateArea = function(fi){
	
	var area = rotationArea(this.area_1, this.rotate);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
}

CollageSprite.prototype.render = function(sprite_id ,operationName, point_){
	
	if(!this.show)return;
	
	if(this.rotate !== 0){
		this.rotateArea();
			var move = [this.point[0]+(this.point2[0] - this.point[0])/2,this.point[1]+(this.point2[1] - this.point[1])/2];
			//ctx.imageSmoothingEnabled = false;
			ctx.translate(move[0],   move[1]);
			ctx.rotate(this.rotate);
	}
	
	var area = this.area_1;
	var point = this.point;
	if(point_ && this.id == sprite_id)point = point_;
	
	
	if(operationName == "move_point" && this.id == sprite_id || operationName == "move" && this.id == sprite_id ){
		area = this.area_2;

	}

	if(this.rotate !== 0){
			ctx.drawImage(this.frame, -(this.point2[0] - this.point[0])/2, -(this.point2[1] - this.point[1])/2);
			ctx.rotate(-this.rotate);
			ctx.translate( -move[0],  -move[1]);
			this.rotate = 0;
			var imgMap = getCutImg(ctx, this.area_1, false);
			getImgToSprite(imgMap, this, false);

	}else{
		
		ctx.drawImage(this.frame, point[0], point[1]);
	}

	
	if(this.id == sprite_id && operationName != "scale"){
		
		drawArea(area, true);
		drawAllSquares(area, halfPoitSize);
	}

	
}

CollageSprite.prototype.mousedown = function(point){	
	if(this.cursorOver){     //move движение всего спрайта							
		if(this.moveStart === false && this.isMovePoint === false && this.currentOperation === false){
			this.moveStart = point;
			this.currentOperation = "move";
            return ;								
		}							
	}
	var isClick = isClickOnPoint(this.area_1 ,point);
	if(isClick !==false && this.currentOperation === false){   //move_poin движение одной точки i (искажение)							
			this.currentOperation = "move_point";
			this.isMovePoint = isClick;							
	}	
}
CollageSprite.prototype.mousemove  = function(point, context){
	
	if(this.currentOperation === "move"){					                        //move движение всего спрайта					
		var distance = [this.moveStart[0] - point[0], this.moveStart[1] -  point[1] ];		
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		context.$methods().renderAll("move", [ this.point[0]-distance[0], this.point[1]-distance[1] ]);
	}
	if(this.currentOperation === "move_point"){                                    //move_poin движение одной точки i (искажение)
		this.area_2[this.isMovePoint] = point;
		context.$methods().renderAll("move_point");
	}
}
CollageSprite.prototype.mouseup  = function(context){ 

	if(this.currentOperation == "move"){ 													
		var movePointEnd = getCanvasPoint(event, canvas);
		this.currentOperation = false;
		var distance = [this.moveStart[0] - movePointEnd[0], this.moveStart[1] -  movePointEnd[1] ];
		this.area_2 = getCutSize(this.area_1, distance[0], distance[1]);
		this.area_1 = this.area_2.slice(0);
		this.point[0] -= distance[0];
		this.point[1] -= distance[1];
		this.point2[0] -= distance[0];
		this.point2[1] -= distance[1];
		context.$methods().renderAll();
		this.moveStart =false;
	}
	if(this.currentOperation === "move_point"){
		context.$methods().renderAll("scale");
        var imgDataArr = cutAndScale(this.area_1, this.area_2, this.isMovePoint, true, false)		
		//var side = getSquareSide(this.area_2, this.area_2[this.isMovePoint]);
		
		getImgToSprite(imgDataArr, this)								
		this.currentOperation = false;
		this.isMovePoint = false;
		this.area_1 = this.area_2.slice(0);							
	}
}
CollageSprite.prototype.cursorOver_ = function(point){
	
	var pathArea = getPathArea(this.area_1);						 
	var isOver = ctx.isPointInPath(pathArea, point[0], point[1]);	
	if(isOver){							
		document.body.style.cursor = "pointer";
		this.cursorOver = true;
	}else{
		document.body.style.cursor = "auto";
		this.cursorOver = false;
	}	
}
















