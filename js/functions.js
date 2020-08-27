
//операции с фоновой картинкой
function startImg(){
    var min_width = document.getElementsByClassName("canvas-container")[0].clientWidth; 
	var min_height = document.getElementsByClassName("canvas-container")[0].clientHeight;
	document.getElementsByClassName("canvas-container")[0].setAttribute("style", "");

	canvas.setAttribute("style", "width:"+Math.round(min_width)+"px; height: "+Math.round(min_height)+"px;");
	srcWidth = canvas.clientWidth; srcHeight = canvas.clientHeight;
	canvas.width=srcWidth;
    canvas.height=srcHeight;

    if(img.width*mainImgScale_x > min_width || img.height*mainImgScale_y> min_height){
		
		if(img.width*mainImgScale_x > min_width && img.height*mainImgScale_y > min_height){			
			document.getElementsByClassName("canvas-container")[0].setAttribute("style", "overflow: scroll");
		}else 	if(img.height*mainImgScale_y > min_height){
			document.getElementsByClassName("canvas-container")[0].setAttribute("style", "overflow-y: scroll");
		}else 	if(img.width*mainImgScale_x > min_width){
			document.getElementsByClassName("canvas-container")[0].setAttribute("style", "overflow-x: scroll");
		}
		 canvas.setAttribute("style", "width:"+Math.round(img.width*mainImgScale_x)+"px; height: "+Math.round(img.height*mainImgScale_y)+"px;"); 
	     srcWidth = Math.round(canvas.clientWidth); srcHeight = Math.round(canvas.clientHeight);	
		 canvas.width=srcWidth;
		 canvas.height=srcHeight;
	}	
	ctx.clearRect(0, 0, srcWidth, srcHeight);
	ctx.save()
	if(mirror_x  == -1){
		ctx.translate(srcWidth, 0);
		ctx.scale( mirror_x, 1);	
	}
	if(mirror_y  == -1){
		ctx.translate(0, srcHeight);
		ctx.scale( 1, mirror_y);	
	}
	if(img.width*mainImgScale_x > min_width || img.height*mainImgScale_y> min_height){

		ctx.drawImage(img, 0, 0, srcWidth, srcHeight);
	
	}else{
		
		ctx.drawImage(img, 0, 0, img.width*mainImgScale_x, img.height*mainImgScale_y);
	}
	 
	saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
	ctx.restore();

}
//преобразует картинку в dataURL
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
//сохраняет объект в локальном хранилище
 function save_in_storage (spritesState, name){
			
				var string = JSON.stringify(spritesState);
				
				 localStorage.setItem(name, string);
				 
				// var spritesState_ = localStorage.getItem(name);
				 
				// var newObj = JSON.parse(spritesState_);
				 
				 //console.log(newObj);
			
}
//достает объект из локального хранилища
function get_from_storage (name, spr_id){
			
				var spritesState = localStorage.getItem(name);
				 
				 var newObj = JSON.parse(spritesState);
				 
				 if(spr_id)return newObj[spr_id];
				 
				 return newObj;
			
}
//загружает модуль
function loadModul(url, name){			        
				var module = document.createElement("script");
				var head = document.head || document.getElementsByTagName('head')[0];
				module.type = 'text/javascript';
				module.src  = url;
				head.appendChild(module);
				
	module.onload = function() {
		console.log("модуль "+name+" загружен", url);  
	};
	module.onerror = function() {
		alert("модуль "+name+" не найден "+url); 				
	}
}

//сохраняет шаги для редактирования фона
function saveStep(saveImg, area){
		
	stepBack.push([saveImg, area.slice(0)]);
	if(stepBack.length > backStepCounts)stepBack.shift();
	
}




























	

	

