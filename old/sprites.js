
function CollageSprite(img, area){
		
	this.frames = [img];
	this.area_1 = area;
	this.area_2 = false;
	this.currentOperation = "area_1";
	this.isMove = false;
	this.isMovePoint = false;
	this.movePointStart = false;
	this.movePointEnd = false;
	this.moveImgArr = false;
	this.rotate = 0;
	
}