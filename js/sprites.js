
function CollageSprite(img, area, point, id){
	
	this.id = id;
	this.frame = img;
	this.point = point;
	this.area_1 = area;
	this.area_2 = area.slice(0);
	this.cursorOver = false;
	this.currentOperation = false;	
	this.isMove = false; //движение всего спрайта
	this.moveStart = false; //начало движения координаты
	this.isMovePoint = false; //движение оной точки i точки	
	this.rotate = 0;
	
}


CollageSprite.prototype.render = function(sprite_id ,operationName, point_){
	//ctx.putImageData(saveImg, 0, 0);
	var area = this.area_1;
	var point = this.point;
	if(point_ && this.id == sprite_id)point = point_;
	
	//console.log(sprite_id ,operationName, point_, this);
	
	if(operationName == "move_point" && this.id == sprite_id || operationName == "move" && this.id == sprite_id ){
		
		
		area = this.area_2;
		ctx.drawImage(this.frame, point[0], point[1]);
		drawArea(area, true);
		drawAllSquares(area, halfPoitSize);
		
	}else if(operationName == "scale" && this.id == sprite_id  || operationName == "common" && this.id == sprite_id ){
		ctx.drawImage(this.frame, point[0], point[1]);		
	}else if(this.id == sprite_id){		
		ctx.drawImage(this.frame, point[0], point[1]);
		drawArea(area, true);
		drawAllSquares(area, halfPoitSize);
	}else{
		ctx.drawImage(this.frame, point[0], point[1]);
	} 
	
		
}