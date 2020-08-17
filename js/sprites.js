
function CollageSprite(img, area, point, id, point2){
	
	this.id = id;
	this.frame = img;
	this.point = point;
	this.point2 = point2;
	this.area_1 = area;
	this.area_2 = area.slice(0);
	this.cursorOver = false;
	this.currentOperation = false;	
	this.isMove = false; //движение всего спрайта
	this.moveStart = false; //начало движения координаты
	this.isMovePoint = false; //движение оной точки i точки	
	this.rotate = 0;
	
}
CollageSprite.prototype.rotateArea = function(fi){
	
	var area = rotationArea(this.area_1, this.rotate);
	this.area_1 = area.slice(0);
	this.area_2 = area.slice(0);
}

CollageSprite.prototype.render = function(sprite_id ,operationName, point_){
	
	if(this.rotate !== 0){
		this.rotateArea();
			var move = [this.point[0]+(this.point2[0] - this.point[0])/2, this.point[1]+(this.point2[1] - this.point[1])/2];
	        
			ctx.translate( move[0],  move[1]);
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