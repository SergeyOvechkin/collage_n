
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

//создает тег link и загружает стили 
function loadStyles(url){
	
			    var link = document.createElement("link");
				var head = document.head || document.getElementsByTagName('head')[0];
				link.href = url;
				link.rel = "stylesheet";
				link.onerror = function(){					
					alert("ошибка подкдючения стилей: "+url+"  убедитесь в правильности url");
				}
				head.appendChild(link);	
}
//предварительная загрузка шрифтов из подключенных стилей
function preloadFonts(font_url, ctx){	           
	            if(!ctx){
	                var canvas = document.createElement("canvas");
					canvas.width = 50;
					canvas.height = 50;
					ctx = canvas.getContext("2d");
				}
			    var re = /(family=)(\w+)(\+?)(\w*)/g;
				var font = font_url.match(re);
				var font1 = [];
				var context = this;
				var i_ = 0;
				if(!Array.isArray(font)){
                    					
					return;				
				}
				for(var i=0; i<font.length; i++){					
					var one = font[i].replace(/(family=)(\w+)(\+?)(\w*)/g, "$2 $4");
					var two = one.replace(/(\w+)(\s)(?!(\w)+)/, "$1");					
					font1.push(two);						
						var image = new Image;
						image.src = font_url;
						image.onerror = function(){	
						ctx.font = '15px '+font1[i_];
						i_++;
						ctx.fillText('Hello!', 20, 10);
						//context.$methods().renderAll();
					};
				}	
}

//сохраняет шаги для редактирования фона
function saveStep(saveImg, area){
		
	stepBack.push([saveImg, area.slice(0)]);
	if(stepBack.length > backStepCounts)stepBack.shift();
	
}

// добавляет json файл в загрузку  для скачивания со страницы
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}




























	

	

