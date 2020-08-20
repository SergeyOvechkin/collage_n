

var StateMap = {
	
	
	form_effects: {
		container: "form_b",
		props: [ ["function_to_pixels", "inputvalue", "[name='function_to_pixels']"], 
		          ["function_to_pixels_click", "click", "[name='function_to_pixels_click']"],
				  
				  ["rgba_effect", 'click', "[name='rgba_effect']"], ["color_r", 'inputvalue', "[name='color_r']"], ["color_g", 'inputvalue', "[name='color_g']"],
				 ["color_b", 'inputvalue', "[name='color_b']"], ["color_a", 'inputvalue', "[name='color_a']"],
				 ],
        methods: { 
			function_to_pixels_click: function(){
				
				
				var script = this.props("function_to_pixels").getProp();
				if(!this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно закончить выделение");
						return;					
				}
				console.log(script);
				var area_1 = this.$props("commonProps").area_1;	
				addEffect_1(ctx, area_1, script)
			    saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			    this.$methods().renderAll();
				
			},
			rgba_effect: function (){
				if(!this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно закончить выделение");
						return;					
				}
				var R =false; var G =false; var B  = false; var A = false;
				var props = this.parent.props;
				 R = props.color_r.getProp();
				 G = props.color_g.getProp();
				 B = props.color_b.getProp();
				 A = props.color_a.getProp();				
				var area_1 = this.$props("commonProps").area_1;	
				addEffect(ctx, area_1, [R, G, B, A])
				saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
			},			
		}				 	
	},
	main_form: {

		container: "main_form",
		props: [ 
				 ["load_url_img", "inputvalue", "[name='load_url_img']"], ["load_url_img_click", 'change', "[name='load_url_img']"],
				 /*["img_main_scale", "inputvalue", "[name='img_main_scale']"], */ ["phone_scale_mirror", 'click', "[name='phone_scale_mirror']"],
				 ["img_main_scale_x", 'inputvalue', "[name='img_main_scale_x']"], ["img_main_scale_y", 'inputvalue', "[name='img_main_scale_y']"],
				 ["mirror_x", 'checkbox', "[name='mirror_x']"], ["mirror_y", 'checkbox', "[name='mirror_y']"],
				 
				 ["add_index_point", "inputvalue", "[name='add_index_point']"], ["add_index_point_click", 'change', "[name='add_index_point']"],
				 ["rm_index_point", "inputvalue", "[name='rm_index_point']"], ["rm_index_point_click", 'change', "[name='rm_index_point']"],
				 ["create_sprite", 'click', "[name='create_sprite']"], ["reset_area", 'click', "[name='reset_area']"],
				 ["to_phone_img", 'click', "[name='operation_with']"], ["clear_phone", 'click', "[name='clear_phone']"],
				 ["scale_or_move_point_click", 'click', "[name='scale_or_move_point']"], ["scale_or_move_point", 'text', "[name='scale_or_move_point']"],
				 ["save_img", 'click', "[name='save_img']"], ["restore_img", 'click', "[name='restore_img']"], ["restart_img", 'click', "[name='restart_img']"],
				 ["rotate_area", 'inputvalue', "[name='rotate_area']"], ["rotate_area_click", 'change', "[name='rotate_area']"],
				 ["smoothing", 'checkbox', "[name='smoothing']"],
				 ["mirror_x_area", 'click', "[name='mirror_x_area']"], ["mirror_y_area", 'click', "[name='mirror_y_area']"],
				
				 

				 
				
		],		 
		methods: {
			rotate_area_click: function(){
				var fi = parseInt(this.props("rotate_area").getProp())* Math.PI / 180;
				var smoothing = this.props("smoothing").getProp();
				//console.log(smoothing);
				ctx.imageSmoothingEnabled = smoothing;
				
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){						
					var area_1 = this.$props("commonProps").area_1;	
                     //console.log(area_1);					
					var img_data_arr =  getCutImg(ctx, area_1);
				    area_1 = rotationArea(area_1, fi);
					//console.log(area_1);
					
					this.$props("commonProps").area_1 = area_1.slice(0);
					this.$props("commonProps").area_2 = area_1.slice(0);
					
					ctx.putImageData(saveImg, 0, 0);
					rotateImgData(ctx, img_data_arr[0], img_data_arr[1], img_data_arr[2], area_1, fi, this.$methods().renderAll.bind(this.rootLink));
					
				}else if(this.$props().sprites[this.$props("operationWith")]){
					var sprite = this.$props().sprites[this.$props("operationWith")];
					sprite.rotate = fi;
					this.$methods().renderAll();
					
				}								
			},
			save_img: function(){
				ctx.clearRect(0, 0, srcWidth, srcHeight);
				ctx.putImageData(saveImg, 0, 0);
				restoreImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
			},
			restore_img: function(){
				if(restoreImg){
					saveImg = restoreImg;
				}	
				this.$methods().renderAll();				
			},
			restart_img: function(){
					startImg();	
					this.$methods().renderAll();
			},
			scale_or_move_point_click: function(){			
				var current = this.$props("commonProps").scale_or_move;				
				if(current == "move"){
					this.$props("commonProps").scale_or_move = "scale";
					this.props("scale_or_move_point").setProp("Перемещать точку");					
				}else{
					this.$props("commonProps").scale_or_move = "move";
					this.props("scale_or_move_point").setProp("Искажать");					
				}				
			},
			clear_phone: function(){
				ctx.clearRect(0, 0, srcWidth , srcHeight);
				saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();				
			},
			to_phone_img: function(){ //работать с фоновой картинкой				
				var sprite = this.$props().sprites[this.$props("operationWith")];
				if(sprite != undefined){
					sprite.currentOperation = false; sprite.isMove = false; sprite.moveStart = false; sprite.isMovePoint = false; 
				}	
					this.$props().operationWith = "common";
					this.$methods().renderAll();
					drawAreaPoints(this.$props("commonProps").area_1);					
			},
			load_url_img_click: function(){ ///загрузить картинку				
				var fd = this.props("load_url_img").getProp();
				img = new Image();
				img.crossOrigin = "Anonymous";
				img.src=fd;
				img.onload = function(){ 
						startImg();
			    };
			},
			phone_scale_mirror: function(){ //масштаб и отражение фоновой картинки
			
			    var props = this.parent.props;
				var mirror_x_ = props.mirror_x.getProp();
				var mirror_y_ = props.mirror_y.getProp();
				mainImgScale_y =  props.img_main_scale_y.getProp() ;
				mainImgScale_x =  props.img_main_scale_x.getProp() ;				
				if(mirror_x_){mirror_x = -1;}else{mirror_x = 1;}
				if(mirror_y_){mirror_y = -1;}else{mirror_y = 1;}
				startImg();
			},
			
			 mirror_x_area: function(){
				if(!this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно закончить выделение");
						return;					
				}
				if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
				}
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){					
						var area_1 = this.$props("commonProps").area_1;
						var img_data_arr =  getCutImg(ctx, area_1);
						 area_1 = mirror_x_area(area_1, true, false);
						this.$props("commonProps").area_1 = area_1;
						ctx.putImageData(saveImg, 0, 0);
						drawImgData(ctx,  img_data_arr[0], img_data_arr[1], area_1, true, false);
				 
						//this.$methods().renderAll();
						//drawAreaPoints(this.$props("commonProps").area_1);
				}
			 },
			 mirror_y_area: function(){
				 if(!this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно закончить выделение");
						return;					
				}
				if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
				}
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){
				 var area_1 = this.$props("commonProps").area_1;
				 var img_data_arr =  getCutImg(ctx, area_1);
				 area_1 = mirror_x_area(area_1, false, true);
				 this.$props("commonProps").area_1 = area_1;
				 ctx.putImageData(saveImg, 0, 0);
				 drawImgData(ctx,  img_data_arr[0], img_data_arr[1], area_1, false, true);
				 
				 
				 //this.$methods().renderAll();
				 //drawAreaPoints(this.$props("commonProps").area_1);
				}
				 
			 },
			add_index_point_click: function(){		//добавить точку после индекса		
				    var index = parseInt(this.props("add_index_point").getProp());
					if( this.$props("operationWith") == "common" ){		  
							addPointTooArray(this.$props("commonProps").area_1, index );
					};
			},
			rm_index_point_click: function(){	//удалить точку после индекса			
				     var index = parseInt(this.props("rm_index_point").getProp());
					if( this.$props("operationWith") == "common" ){		  
							rmPointFromArray(this.$props("commonProps").area_1, index );
					};
			},
			reset_area: function(){ //сбросить область выделение
				if( this.$props("operationWith") == "common"  ){ 
					this.$props("commonProps").area_1 = [];
					 this.$props("commonProps").isEndArea_1 = false;
					this.$methods().renderAll();				
				}				
			},
			create_sprite: function(){ //создать спрайт
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){ 

					 var id = "sprite_"+Math.floor(Math.random()*10000); 
					 this.$props().operationWith = id;
					 var area = this.$props("commonProps").area_1;
					 var img_data_arr =  getCutImg(ctx, area);
					 var sprite = new CollageSprite(false,  area.slice(0), img_data_arr[1], id, img_data_arr[2]);
					 this.$methods().renderAll();
					 this.$props("sprites")[id] = sprite;					 					 
					 getImgToSprite(img_data_arr, sprite, true);
					 this.$$("emiter-create-sprite").set(id);
				}				
			}
		},				
	},
	canvas: {
		
		container: "canvas",
		props: [["mousedown", "mousedown", ""], ["mousemove", "mousemove", ""], ["mouseup", "mouseup", ""],
		         ],
		methods: {
			
			mousedown: function(){
				    if(event.which !== 1)return;
				    var area_1 = this.$props("commonProps").area_1;
					var isEndArea_1 = this.$props("commonProps").isEndArea_1;				
					var point = getCanvasPoint(event, this.parent.htmlLink);
					
					if(this.$props("operationWith") == "common"){						
							if(isEndArea_1 === false){                           //добавляет точку к выделению либо замыкает контур								
									isEndArea_1 = endArea(area_1, point);								
									if(!isEndArea_1 ){
										area_1.push(point);
									}else{										
										this.$props("commonProps").isEndArea_1 = true;
									}
							}else{		
								 this.$props("commonProps").isMovePoint  = isClickOnPoint(area_1 ,point); ///индекс движемой точки
								 this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
							}
							drawAreaPoints(area_1, isEndArea_1);

					}else if(this.$props().sprites[this.$props("operationWith")]){						
						var sprite = this.$props().sprites[this.$props("operationWith")];
						sprite.mousedown(point);						
					}				
			},
			mousemove: function(){
					var point = getCanvasPoint(event, canvas);
					if(this.$props("operationWith") == "common"){
                        var indexPoint = this.$props("commonProps").isMovePoint;					
						if(indexPoint !== false){							
							if(this.$props("commonProps").scale_or_move == "move"){ //перемещение точки
								this.$props("commonProps").area_1[indexPoint] = point;							
								this.$methods().renderAll();
								drawAreaPoints(this.$props("commonProps").area_1);
							}else if(this.$props("commonProps").scale_or_move == "scale"){ //искажение
								this.$props("commonProps").area_2[indexPoint] = point;
								this.$methods().renderAll();
								drawAreaPoints(this.$props("commonProps").area_2);
							}	
						}											
					}else if(this.$props().sprites[this.$props("operationWith")]){ //операция с конкретным спрайтом, если он не удален						
						 var sprite = this.$props().sprites[this.$props("operationWith")];												 	
						 sprite.cursorOver_(point);
						 sprite.mousemove(point, this);
					}								
			},
			mouseup: function(){
					if(event.which !== 1)return;				
					if(this.$props("operationWith") == "common"){						
						if(this.$props("commonProps").isMovePoint !== false){						
							if(this.$props("commonProps").scale_or_move == "scale"){
                                var area_1 = this.$props("commonProps").area_1; var area_2 = this.$props("commonProps").area_2;	var move_point = this.$props("commonProps").isMovePoint;							
								var imgDataArr = cutAndScale(area_1, area_2, move_point, false, true);
								this.$methods().renderAll();
								this.$props("commonProps").area_1 = area_2.slice(0);															
								drawAreaPoints(area_2);							
							}
							this.$props("commonProps").isMovePoint = false;							
						}						
					}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];	
						sprite.mouseup(this);
					}				
			}			
		}		
	},
	sprites: {
		arrayProps: [["listen_create_sprite", "emiter-create-sprite", ""]],
		arrayMethods: {			
			listen_create_sprite: function(){			
				var id = this.emiter.prop;				
				for(var i=0; i < this.parent.data.length; i++){					
					this.parent.data[i].props.class.removeProp("active");					
				}				
				this.parent.add({id: id, class: "active"}, 0);				
			}
		},
		container: "sprite",
		props: [ ["id", "text", "[name='id']"], ["class", "class", ""], ["click", "click", ""], ["rm_sprite", "click", "[name='rm_sprite']"],
		          ["show_sprite_click", "click", "[name='show_sprite']"], ["show_sprite", "text", "[name='show_sprite']"], 
				  ["stamp", "click", "[name='stamp']"], ["layer_up", "click", "[name='layer_up']"],
				  ],
		methods : {
			layer_up: function(){
				var id = this.props("id").getProp();
				var index = this.parent.index;
				var sprite = this.$props().sprites[id];
				delete this.$props().sprites[id];
				this.$props().sprites[id] = sprite;
				
				var newOrderArr = [];
				var length = this.component().data.length;
				for(var i=0; i<length; i++){
					newOrderArr.push(i);
				}
				var newIndex = newOrderArr.splice(index, 1);
				newOrderArr.unshift(newIndex);
				
				this.component().order(newOrderArr);
				
				
			},
			show_sprite_click: function(){	//отображает либо скрывает спрайт			
				var text = this.props("show_sprite");
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				
				if(sprite.show){
					sprite.show = false;
					text.setProp("Отобразить");
				}else{
					sprite.show = true;
					text.setProp("Скрыть");
				}				
			},
			click: function(){	//делает спрайт текущим			
				var id = this.props("id").getProp();
				for(var i=0; i < this.component().data.length; i++){					
					this.component().data[i].props.class.removeProp("active");					
				}
                this.props("class").setProp("active");
				this.$props().operationWith = id;
				this.$methods().renderAll();				
			},
			rm_sprite: function(){ //удаляет спрайт
				var id = this.props("id").getProp();
				delete this.$props().sprites[id];
				this.$methods().renderAll();
				this.parent.remove();
				
			},
			stamp: function(){ 
					var id = this.props("id").getProp();
					var sprite = this.$props().sprites[id];
			        ctx.putImageData(saveImg, 0, 0);
					sprite.render("common");
					saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
					this.$methods().renderAll();
					
			}
			
		},		
	},
	stateProperties: {		
		operationWith: "common", ///"sprite" операция с объектом или общей картинкой
		commonProps: {		
			area_1: [], //область выделения до смещения
			area_2: [], //область выделения после смещения
			isEndArea_1: false, //флаг показывает - закончено ли выделение первой области
			isMovePoint : false, //индекс перемещаемой точки
			scale_or_move: "move",
		},
		sprites: {},		
	},
	stateMethods: {		
		renderAll: function(operationName, point_){	//отображает на экране все спрайты и фоновую картинку		
			ctx.putImageData(saveImg, 0, 0);
			var sprId_or_common = this.stateProperties.operationWith;
			var sprites = this.stateProperties.sprites;		
			for (var key in sprites){				
				sprites[key].render(sprId_or_common, operationName, point_);
				//console.log(sprites);
			}		
		}		
	},	
	eventEmiters: {		
		["emiter-create-sprite"] : {prop: ""},		
	}	
}
window.onload= function(){	
	var HM = new HTMLixState(StateMap);	
	console.log(HM);	
}