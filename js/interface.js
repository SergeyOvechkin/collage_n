

var StateMap = {
	
	
	main_form: {

		container: "main_form",
		props: [ 
				 ["load_url_img", "inputvalue", "[name='load_url_img']"], ["load_url_img_click", 'change', "[name='load_url_img']"],
				 ["img_main_scale", "inputvalue", "[name='img_main_scale']"], ["img_main_scale_click", 'change', "[name='img_main_scale']"], 
				 ["add_index_point", "inputvalue", "[name='add_index_point']"], ["add_index_point_click", 'change', "[name='add_index_point']"],
				 ["rm_index_point", "inputvalue", "[name='rm_index_point']"], ["rm_index_point_click", 'change', "[name='rm_index_point']"],
				 ["create_sprite", 'click', "[name='create_sprite']"], ["reset_area", 'click', "[name='reset_area']"],
				 ["to_phone_img", 'click', "[name='operation_with']"], ["clear_phone", 'click', "[name='clear_phone']"],
				 ["scale_or_move_point_click", 'click', "[name='scale_or_move_point']"], ["scale_or_move_point", 'text', "[name='scale_or_move_point']"],
				 ["save_img", 'click', "[name='save_img']"], ["restore_img", 'click', "[name='restore_img']"], ["restart_img", 'click', "[name='restart_img']"],
				  
				 
				
		],		 
		methods: {
			save_img: function(){				
				restoreImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			},
			restore_img: function(){
				saveImg = restoreImg;
				this.$methods().renderAll();				
			},
			restart_img: function(){
					ctx.drawImage(img, 0, 0, img.naturalWidth*mainImgScale, img.naturalHeight*mainImgScale); 
					saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);	
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
			to_phone_img: function(){
				
				var sprite = this.$props().sprites[this.$props("operationWith")];
				if(sprite != undefined){
					sprite.currentOperation = false; sprite.isMove = false; sprite.moveStart = false; sprite.isMovePoint = false; 
				}	
					//sprite.render("scale");
					this.$props().operationWith = "common";
					this.$methods().renderAll();
			},
			load_url_img_click: function(){
				
				var fd = this.props("load_url_img").getProp();
				img = new Image();
				img.crossOrigin = "Anonymous";
				img.src=fd;
				img.onload = function(){ 
					ctx.clearRect(0, 0, srcWidth, srcHeight); 	        
					ctx.drawImage(img, 0, 0, img.naturalWidth*mainImgScale, img.naturalHeight*mainImgScale); 
					saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			    };
			},
			img_main_scale_click: function(){
				
				mainImgScale = this.props("img_main_scale").getProp();
				ctx.clearRect(0, 0, srcWidth, srcHeight); 
				ctx.drawImage(img, 0, 0, img.naturalWidth*mainImgScale, img.naturalHeight*mainImgScale); 
				saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			},
			add_index_point_click: function(){				
				     var index = parseInt(this.props("add_index_point").getProp());
					if( this.$props("operationWith") == "common" ){		  
							addPointTooArray(this.$props("commonProps").area_1, index );
					};
			},
			rm_index_point_click: function(){				
				     var index = parseInt(this.props("rm_index_point").getProp());
					if( this.$props("operationWith") == "common" ){		  
							rmPointFromArray(this.$props("commonProps").area_1, index );
					};
			},
			reset_area: function(){
				if( this.$props("operationWith") == "common"  ){ 
					// ctx.putImageData(saveImg, 0, 0);
					this.$methods().renderAll();
					 this.$props("commonProps").area_1 = [];
					 this.$props("commonProps").isEndArea_1 = false;				
				}				
			},
			create_sprite: function(){
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){ 

					 var id = "sprite_"+Math.floor(Math.random()*10000); 
					 this.$props().operationWith = id;
					 var area = this.$props("commonProps").area_1;
					 var img_data_arr =  getCutImg(ctx, area);
					 var sprite = new CollageSprite(false,  area.slice(0), img_data_arr[1], id);
					 //console.log(sprite);
					 this.$methods().renderAll();
					 this.$props("sprites")[id] = sprite;					 
					 //ctx.putImageData(saveImg, 0, 0);						 
					 getImgToSprite(img_data_arr, sprite);

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
						
							if(isEndArea_1 === false){								
									isEndArea_1 = endArea(area_1, point);								
									if(!isEndArea_1 ){
										area_1.push(point);
									}else{										
										this.$props("commonProps").isEndArea_1 = true;
									}
							}else /*if(this.$props("commonProps").scale_or_move == "move")*/{		
								 this.$props("commonProps").isMovePoint  = isClickOnPoint(area_1 ,point); ///индекс движемой точки
								 this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
							}	
								//console.log(this.$props("commonProps").isEndArea_1);
								drawArea(area_1, isEndArea_1);
								drawAllSquares(area_1, halfPoitSize);
					}else if(this.$props().sprites[this.$props("operationWith")]){
						var point = getCanvasPoint(event, canvas);	
						var sprite = this.$props().sprites[this.$props("operationWith")];
						if(sprite.cursorOver){							
							if(sprite.moveStart === false && sprite.isMovePoint === false && sprite.currentOperation === false){
								sprite.moveStart = point;
								sprite.currentOperation = "move";								
							}							
						}
						var isClick = isClickOnPoint(sprite.area_1 ,point);
						if(isClick !==false && sprite.currentOperation === false){							
							sprite.currentOperation = "move_point";
							sprite.isMovePoint = isClick;
							
						}
						
					}
				
			},
			mousemove: function(){					
					if(this.$props("operationWith") == "common"){
                        var indexPoint = this.$props("commonProps").isMovePoint;
						
						if(indexPoint !== false){							
							if(this.$props("commonProps").scale_or_move == "move"){
								this.$props("commonProps").area_1[indexPoint] = getCanvasPoint(event, this.parent.htmlLink);							
								this.$methods().renderAll();
								drawArea(this.$props("commonProps").area_1, true);
								drawAllSquares(this.$props("commonProps").area_1, halfPoitSize);
							}else if(this.$props("commonProps").scale_or_move == "scale"){
								this.$props("commonProps").area_2[indexPoint] = getCanvasPoint(event, this.parent.htmlLink);
								this.$methods().renderAll();
								drawArea(this.$props("commonProps").area_2, true);
								drawAllSquares(this.$props("commonProps").area_2, halfPoitSize);
							}	
						}											
					}else if(this.$props().sprites[this.$props("operationWith")]){ //операция с конкретным спрайтом, если он не удален
						
						var sprite = this.$props().sprites[this.$props("operationWith")];						
						 var point = getCanvasPoint(event, canvas);	
						 var pathArea = getPathArea(sprite.area_1);						 
						var isOver = ctx.isPointInPath(pathArea, point[0], point[1]);						
						if(isOver){							
							document.body.style.cursor = "pointer";
							sprite.cursorOver = true;
						}else{
							document.body.style.cursor = "auto";
							sprite.cursorOver = false;
						}
						var movePointEnd = getCanvasPoint(event, canvas);
						if(sprite.currentOperation === "move"){									
							var distance = [sprite.moveStart[0] - movePointEnd[0], sprite.moveStart[1] -  movePointEnd[1] ];		
							sprite.area_2 = getCutSize(sprite.area_1, distance[0], distance[1]);
							//ctx.putImageData(saveImg, 0, 0);
							this.$methods().renderAll("move", [ sprite.point[0]-distance[0], sprite.point[1]-distance[1] ]);
							//sprite.render("move", [ sprite.point[0]-distance[0], sprite.point[1]-distance[1] ]);
						}
						if(sprite.currentOperation === "move_point"){ 
							sprite.area_2[sprite.isMovePoint] = movePointEnd;
							//ctx.putImageData(saveImg, 0, 0);
							//sprite.render("move_point");
							this.$methods().renderAll("move_point");
						}
					}								
			},
			mouseup: function(){
					if(event.which !== 1)return;				
					if(this.$props("operationWith") == "common"){						
						if(this.$props("commonProps").isMovePoint !== false){
							
							if(this.$props("commonProps").scale_or_move == "scale"){
                                var area_1 = this.$props("commonProps").area_1; var area_2 = this.$props("commonProps").area_2;	var move_point = this.$props("commonProps").isMovePoint;							
									var side = getSquareSide(area_2, area_2[move_point]);
									var imgDataArr;
									ctx.putImageData(saveImg, 0, 0);
									if(side == 0){			
										imgDataArr = cutAndScale_X(ctx, area_1, area_2, move_point, false, false, );			
									}else if(side == 2){			
										imgDataArr = cutAndScale_X(ctx, area_1, area_2, move_point, true, false, );
									}else if(side == 1){			
										imgDataArr = cutAndScale_Y(ctx, area_1, area_2, move_point, false, false, );
									}else if(side == 3){			
										imgDataArr = cutAndScale_Y(ctx, area_1, area_2, move_point, true, false, );
									}
									saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
								    this.$methods().renderAll();
								    this.$props("commonProps").area_1 = area_2.slice(0);															
								drawArea(area_2, true);
								drawAllSquares(area_2, halfPoitSize);								
							}
							this.$props("commonProps").isMovePoint = false;							
						}						
					}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];	
						if(sprite.currentOperation == "move"){ 													
								var movePointEnd = getCanvasPoint(event, canvas);
								sprite.currentOperation = false;
								var distance = [sprite.moveStart[0] - movePointEnd[0], sprite.moveStart[1] -  movePointEnd[1] ];
								sprite.area_2 = getCutSize(sprite.area_1, distance[0], distance[1]);
								sprite.area_1 = sprite.area_2.slice(0);
								sprite.point[0] -= distance[0];
								sprite.point[1] -= distance[1];
								this.$methods().renderAll();
								sprite.moveStart =false;
						}
						if(sprite.currentOperation === "move_point"){
                      		
							//sprite.render("scale");
							this.$methods().renderAll("scale");
							
							var side = getSquareSide(sprite.area_2, sprite.area_2[sprite.isMovePoint]);
							var imgDataArr;						
							if(side == 0){			
								imgDataArr = cutAndScale_X(ctx, sprite.area_1, sprite.area_2, sprite.isMovePoint, false, true, );			
							}else if(side == 2){			
								imgDataArr = cutAndScale_X(ctx, sprite.area_1, sprite.area_2, sprite.isMovePoint, true, true, );
							}else if(side == 1){			
								imgDataArr = cutAndScale_Y(ctx, sprite.area_1, sprite.area_2, sprite.isMovePoint, false, true, );
							}else if(side == 3){			
								imgDataArr = cutAndScale_Y(ctx, sprite.area_1, sprite.area_2, sprite.isMovePoint, true, true, );
							}  							 
							    getImgToSprite(imgDataArr, sprite)
								
								//drawImgData( ctx, imgArr[0], imgArr[1], sprite.area_2, sprite);
								
							sprite.currentOperation = false;
							sprite.isMovePoint = false;
							sprite.area_1 = sprite.area_2.slice(0);
							
						}
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
				this.parent.add({id: id, class: "active"});
				
			}
		},
		container: "sprite",
		props: [ ["id", "text", "[name='id']"], ["class", "class", ""], ["click", "click", ""], ["rm_sprite", "click", "[name='rm_sprite']"],],
		methods : {
			click: function(){
				
				var id = this.props("id").getProp();
				for(var i=0; i < this.component().data.length; i++){					
					this.component().data[i].props.class.removeProp("active");					
				}
                this.props("class").setProp("active");
				this.$props().operationWith = id;
				this.$methods().renderAll();				
			},
			rm_sprite: function(){
				var id = this.props("id").getProp();
				delete this.$props().sprites[id];
				this.$methods().renderAll();
				this.parent.remove();
				
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
		
		renderAll: function(operationName, point_){
			
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