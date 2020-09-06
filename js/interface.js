

var StateMap = {
	form_load_module: {
		container: "form_load_module",
		props: [ ["module_url", "inputvalue", "[name='module_url']"],  ["load_module", "click", "[name='load_module']"], 
					["setting_name", "inputvalue", "[name='setting_name']"],  
					["setting_add", "click", "[name='setting_add']"],  ["setting_remove", "click", "[name='setting_remove']"], 
					["form_show", "extend", "form_text", "props"], ["form_style", "class", "div.d-none"],
		],		 				
		methods: {
			load_module: function(){ //подключает загруженный скрипт, модуль
				var module_url  = this.props("module_url").getProp();           
				loadModul(module_url);
			},
			setting_add: function(){//добавляет модуль в автозагрузку
				var setting_name = this.parent.props.setting_name.getProp(); var module_url = this.parent.props.module_url.getProp();
				if(setting_name != "" && setting_name.length > 4 &&  module_url !="" && module_url.length > 4){				
					var collagenSettings = get_from_storage("collagenSettings");
					if(collagenSettings == null)collagenSettings = {};
					collagenSettings[setting_name] = module_url;			
					save_in_storage(collagenSettings, "collagenSettings");				
					alert("настройки "+setting_name+" сохранены");
				}				
			},
			setting_remove: function(){//удаляет модуль из автозагрузки
				var setting_name = this.parent.props.setting_name.getProp();				
					var collagenSettings = get_from_storage ("collagenSettings");
					if(collagenSettings == null)collagenSettings = {};
					if(collagenSettings[setting_name] == undefined){
						alert("настроек с таким имененм не найдено");
						return					
					}
					delete collagenSettings[setting_name];
					save_in_storage (collagenSettings, "collagenSettings");
					alert("настройки "+setting_name+" удалены");
			}
		}	
	},
	form_text: {
		container: "form_text",
		props: [ ["font_url", "inputvalue", "[name='font_url']"], ["add_font", "click", "[name='add_font']"], ["font", "inputvalue", "[name='font']"],
				 ["text_x", "inputvalue", "[name='text_x']"], ["text_y", "inputvalue", "[name='text_y']"], ["max_w", "inputvalue", "[name='max_w']"],
				 ["color", "inputvalue", "[name='color']"], ["text", "inputvalue", "[name='text']"], ["add_text", "click", "[name='add_text']"],
				 ["form_show", "click", "[name='form_show']"], ["form_style", "class", "div.d-none"],
		],
		methods: {
			form_show: function(){ //отобразить скрыть форму текста
				if(this.prop == null){				
					this.prop = true;
					this.props("form_style").removeProp("d-none");
					this.htmlLink.querySelector("span").innerText="-";
				}else{
					this.prop = null;
					this.props("form_style").setProp("d-none");
					this.htmlLink.querySelector("span").innerText="+";
				}				
			},
			add_text: function(){ //добавить текст				
				var props = this.parent.props; var font_url = props.font_url.getProp(); var font = props.font.getProp();  var text = props.text.getProp();
				var text_x = props.text_x.getProp();  var text_y = props.text_y.getProp(); var max_w = 	props.max_w.getProp(); var color = props.color.getProp();
					ctx.putImageData(saveImg, 0, 0);
					saveStep(saveImg, this.$props().commonProps.area_1);
					ctx.save();
					ctx.fillStyle = color;
					ctx.font = font;					
					if(max_w == "" || max_w == false){
						ctx.fillText(text, text_x, text_y);
					}else{
						ctx.fillText(text, text_x, text_y, max_w);
					}
					saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
					ctx.restore();	
					this.$methods().renderAll();		
			},
			add_font: function(){ //загрузить cdn шрифт
				var props = this.parent.props;					
			    var font_url = props.font_url.getProp(); // var font_url_as = "new_font";            
				var link = document.createElement("link");
				var head = document.head || document.getElementsByTagName('head')[0];
				link.href = font_url;
				link.rel = "stylesheet";
				link.onerror = function(){					
					alert("ошибка подкдючения шрифтов: "+font_url+"  убедитесь в правильности url");
				}
				head.appendChild(link);	
				
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
						image.onerror = function() {	
						ctx.font = '15px '+font1[i_];
						i_++;
						ctx.fillText('Hello!', 20, 10);
						context.$methods().renderAll();
					};
				}
			}
		},
	},
	form_effects: {
		container: "form_effects",
		props: [ ["function_to_pixels", "inputvalue", "[name='function_to_pixels']"], ["function_to_pixels_click", "click", "[name='function_to_pixels_click']"],				  
				  ["rgba_effect", 'click', "[name='rgba_effect']"], ["color_r", 'inputvalue', "[name='color_r']"], ["color_g", 'inputvalue', "[name='color_g']"],
				 ["color_b", 'inputvalue', "[name='color_b']"], ["color_a", 'inputvalue', "[name='color_a']"], ["function_to_contur", 'inputvalue', "[name='function_to_contur']"],
				 ["function_to_contur_click", 'click', "[name='function_to_contur_click']"], ["form_show", "extend", "form_text", "props"], ["form_style", "class", "div.d-none"],
				 ["form_effects_class", 'class', ""], ["add_rm_classes_on_change_operationWith", 'emiter-operation-with', ""],
				 ["border_with_coeff_x", "inputvalue",  "[name='border_with_coeff_x']"], ["border_with_coeff_y", "inputvalue",  "[name='border_with_coeff_y']"], 
				 ["function_to_border_click", "click",  "[name='function_to_border_click']"],
				 ],
        methods: {
			add_rm_classes_on_change_operationWith: function(){ //скрывает форму при смене типа операции
				var props = this.parent.props; 			
				if(this.emiter.prop == "common"){
					props.form_effects_class.removeProp("d-none");
				}else{
					props.form_effects_class.setProp("d-none");
				}				
			},			
			function_to_contur_click: function(){ //применить функцию для создания контура
				if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
				}
				var script = this.props("function_to_contur").getProp();
				saveStep(saveImg, this.$props().commonProps.area_1);
				var contur = createContur(script);
				if(contur.length > 1){
					this.$props("commonProps").area_1 = contur;
					if(contur.length > 2){
						this.$props("commonProps").isEndArea_1 = true;
					}
					this.$methods().renderAll();
					drawAreaPoints(this.$props("commonProps").area_1, this.$props("commonProps").isEndArea_1);
				}				
			},
			function_to_pixels_click: function(){ //применить функцию для изменения пикселей
				if(this.$props("operationWith") != "common" || !this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно переключиться на фоновое изображение и закончить выделение контура");
						return;					
				}
				var script = this.props("function_to_pixels").getProp();			
				var area_1 = this.$props("commonProps").area_1;	
				saveStep(saveImg, this.$props().commonProps.area_1);
				addEffectEval(ctx, area_1, script);
			    saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			    this.$methods().renderAll();
				drawAreaPoints(area_1);				
			},
			function_to_border_click: function(){//функция для изменения пикселей на границе выделения
				var border_with_coeff_x = parseFloat(this.props("border_with_coeff_x").getProp());
				var border_with_coeff_y = parseFloat(this.props("border_with_coeff_y").getProp());				
			    if(this.$props("operationWith") != "common" || !this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно переключиться на фоновое изображение и закончить выделение контура");
						return;					
				}
				if(isNaN(border_with_coeff_x) || isNaN(border_with_coeff_y)){
					alert("некорректно заданы коэффициенты ширины граници");
					return;
				}
				 var coeff_x = 1-border_with_coeff_x;
				 var coeff_y = 1-border_with_coeff_y;
				 
				var script = this.props("function_to_pixels").getProp();			
				var area_1 = this.$props("commonProps").area_1;
				saveStep(saveImg, this.$props().commonProps.area_1);
				//var area_2 = scaleArea(area_1, coeff_x, coeff_y);
				
				
				addEffectEvalToBorder(ctx, area_1, script, coeff_x, coeff_y);
			    saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
			    this.$methods().renderAll();
				drawAreaPoints(area_1);					
			},
			rgba_effect: function (){ //формула или значение для цвета пикселя
				if(this.$props("operationWith") != "common" || !this.$props("commonProps").isEndArea_1){					
						alert("сперва нужно переключиться на фоновое изображение и закончить выделение контура");
						return;					
				}
				var props = this.parent.props;
				var R = props.color_r.getProp(); var G = props.color_g.getProp(); var B = props.color_b.getProp();var A = props.color_a.getProp();				
				var area_1 = this.$props("commonProps").area_1;	
				saveStep(saveImg, this.$props().commonProps.area_1);
				addEffect(ctx, area_1, [R, G, B, A])
				saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
				drawAreaPoints(this.$props("commonProps").area_1);
			},			
		}				 	
	},
	main_form: {
		container: "main_form",
		props: [ 
				 ["load_url_img", "inputvalue", "[name='load_url_img']"], ["load_url_img_click", 'change', "[name='load_url_img']"],
				 ["load_img_click", 'change', "[name='load_img']"], ["load_img", 'inputvalue', "[name='load_img']"], 				
				 ["step_back", "click", "[name='step_back']"], ["phone_scale_mirror", 'click', "[name='phone_scale_mirror']"],
				 ["img_main_scale_x", 'inputvalue', "[name='img_main_scale_x']"], ["img_main_scale_y", 'inputvalue', "[name='img_main_scale_y']"],
				 ["mirror_x", 'checkbox', "[name='mirror_x']"], ["mirror_y", 'checkbox', "[name='mirror_y']"],				 
				 ["add_index_point", "inputvalue", "[name='add_index_point']"], ["add_index_point_click", 'change', "[name='add_index_point']"],
				 ["rm_index_point", "inputvalue", "[name='rm_index_point']"], ["rm_index_point_click", 'change', "[name='rm_index_point']"],
				 ["create_sprite", 'click', "[name='create_sprite']"], ["reset_area", 'click', "[name='reset_area']"],
				 ["to_phone_img", 'click', "[name='operation_with']"], ["clear_phone", 'click', "[name='clear_phone']"],
				 ["scale_or_move_point_click", 'click', "[name='scale_or_move_point']"], ["scale_or_move_point", 'text', "[name='scale_or_move_point']"],
				 ["save_img", 'click', "[name='save_img']"], ["restore_img", 'click', "[name='restore_img']"], ["restart_img", 'click', "[name='restart_img']"],
				 ["rotate_area", 'inputvalue', "[name='rotate_area']"], ["rotate_area_click", 'change', "[name='rotate_area']"], ["smoothing", 'checkbox', "[name='smoothing']"],
				 ["mirror_x_area", 'click', "[name='mirror_x_area']"], ["mirror_y_area", 'click', "[name='mirror_y_area']"],
				 ["scale_x_area", 'inputvalue', "[name='scale_x_area']"], ["scale_y_area", 'inputvalue', "[name='scale_y_area']"], ["scale_x_y", 'click', "[name='scale_x_y']"], 
				
				["add_rm_classes_on_change_operationWith", 'emiter-operation-with', ""], ["add_rm_index_point", 'class', "[name='add_rm_index_point']"],
				 //["scale_area_class", 'class', "[name='scale_area_class']"],  
				 ["common_btns_class", 'class', "[name='common_btns_class']"],
                 ["to_phone_img_class", 'class', "[name='operation_with']"], 
				 ["scale_rotate_area_sprite", 'class', "[name='scale_rotate_area_sprite']"], 
				 ["mirror_x_area", 'class', "[name='mirror_x_area']"], ["mirror_y_area", 'class', "[name='mirror_y_area']"],
				 
				 
		],			
		methods: {
			add_rm_classes_on_change_operationWith: function(){ //скрывает кнопки при операции со спрайтами и фоновой картинкой
				var props = this.parent.props; 			
				if(this.emiter.prop == "common"){ //видимые кнопки при операциях с фоном
					props.mirror_x_area.removeProp("d-none");
					props.mirror_y_area.removeProp("d-none");
					props.add_rm_index_point.removeProp("d-none");
					props.common_btns_class.removeProp("d-none");
					props.scale_rotate_area_sprite.removeProp("d-none");
					props.to_phone_img_class.setProp("d-none");
				}else if(this.$props().sprites[this.$props("operationWith")]){ //со спрайтами
					props.mirror_x_area.removeProp("d-none");
					props.mirror_y_area.removeProp("d-none");
					props.add_rm_index_point.setProp("d-none");
					props.common_btns_class.setProp("d-none");
					props.scale_rotate_area_sprite.removeProp("d-none");					
					props.to_phone_img_class.removeProp("d-none");
				}else{ //другими операциями
					props.mirror_x_area.setProp("d-none");
					props.mirror_y_area.setProp("d-none");					
					props.scale_rotate_area_sprite.setProp("d-none");
					props.add_rm_index_point.setProp("d-none");
					props.common_btns_class.setProp("d-none");
					props.to_phone_img_class.removeProp("d-none");
				}
				
			},
			step_back: function(){ //возвращает предыдущий шаг преобразования фоновой картинки
				if(stepBack.length > 0){
					var step = stepBack.pop();					
					saveImg = step[0];					
					this.$methods().setAreas(step[1]);
					this.$methods().renderAll();
				}	
			},
			scale_x_y: function(){	//масштабирует выделенную область или спрайт	
				var coeff_x = this.props("scale_x_area").getProp(); var coeff_y = this.props("scale_y_area").getProp();
				if(coeff_y == "" || coeff_y == false)coeff_y = 1;  if(coeff_x == "" || coeff_x == false)coeff_x = 1;			
				if(this.$props("operationWith") == "common" ){
						if(!this.$props("commonProps").isEndArea_1){					
										alert("сперва нужно  закончить выделение контура");
											return;					
						}
					var area_1 = this.$props("commonProps").area_1;
					saveStep(saveImg, this.$props().commonProps.area_1);
					var area = scaleArea(area_1, coeff_x, coeff_y);			
					var imgArr = getCutImg(ctx, area_1);
					var imgBox_1 =  getBox(area_1);
					var imgBox_2 =  getBox(area);
					this.$methods().setAreas(area);
					var context = this;				
					drawImgData(ctx, imgArr[0], imgBox_2[0], area, false, false,  (imgBox_1[1][0] -  imgBox_1[0][0])*coeff_x,  (imgBox_1[1][1] -  imgBox_1[0][1])*coeff_y, true, function(){							
							//drawAreaPoints(context.$props("commonProps").area_1, context.$props("commonProps").isEndArea_1);
							context.$methods().renderAll();
						});				
					
					
				}else if( this.$props().sprites[this.$props("operationWith")] ){					
					var sprite = this.$props().sprites[this.$props("operationWith")];
					sprite.scale(coeff_x, coeff_y);
					this.$methods().renderAll();
				}				
			},
			load_img_click: function(event){ //загружает картинку с компьютера		
				var img_ = this.parent.props.load_img.htmlLink.files[0];
				var context = this;
				handleFiles(img_); 			
				function handleFiles(file) {
						img.file = file;
						var reader = new FileReader();					
						reader.onload = (function(aImg) { return function(e) { 
							aImg.src = e.target.result;  startImg();													
						}; })(img);						
						reader.readAsDataURL(file);					
				}			
			},
			rotate_area_click: function(){ //вращение выделенной области или спрайта
				var fi = parseInt(this.props("rotate_area").getProp())* Math.PI / 180;
				var smoothing = this.props("smoothing").getProp();
				ctx.imageSmoothingEnabled = smoothing;
				
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){						
					var area_1 = this.$props("commonProps").area_1;	
					saveStep(saveImg, this.$props().commonProps.area_1);
					var img_data_arr =  getCutImg(ctx, area_1);
				    area_1 = rotationArea(area_1, fi);
					this.$methods().setAreas(area_1);				
					ctx.putImageData(saveImg, 0, 0);
					var context = this;
					rotateImgData(ctx, img_data_arr[0], img_data_arr[1], img_data_arr[2], fi, function(){
						 context.$methods().renderAll();	
					});					
				}else if(this.$props().sprites[this.$props("operationWith")]){
					var sprite = this.$props().sprites[this.$props("operationWith")];
					sprite.rotate = fi;
					this.$methods().renderAll();					
				}								
			},
			save_img: function(){ //сохраняет текущий снимок фоновой картинки
				ctx.clearRect(0, 0, srcWidth, srcHeight);
				ctx.putImageData(saveImg, 0, 0);
				restoreImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
			},
			restore_img: function(){ //отображает предыдущий сохраненный снимок
				if(restoreImg){
					saveImg = restoreImg;
				}	
				this.$methods().renderAll();
			},
			restart_img: function(){ //перезагружает фоновую картинку
					startImg();	
					this.$methods().renderAll();
			},
			scale_or_move_point_click: function(){ //переключает движение и масштабирование точек			
				var current = this.$props("commonProps").scale_or_move;				
				if(current == "move"){
					this.$props("commonProps").scale_or_move = "scale";
					this.props("scale_or_move_point").setProp("Перемещать точку");					
				}else{
					this.$props("commonProps").scale_or_move = "move";
					this.props("scale_or_move_point").setProp("Искажать");					
				}				
			},
			clear_phone: function(){ ///делает фон прозрачным
				saveStep(saveImg, this.$props().commonProps.area_1);
				ctx.clearRect(0, 0, srcWidth , srcHeight);
				saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
				this.$methods().renderAll();
			},
			to_phone_img: function(){ //работать с фоновой картинкой				
				var sprite = this.$props().sprites[this.$props("operationWith")];
				if(sprite != undefined){
					sprite.currentOperation = false; sprite.isMove = false; sprite.moveStart = false; sprite.isMovePoint = false; 
				}
				    lineColor = colorCommonArea;
					this.$props().operationWith = "common";
					this.$$("emiter-operation-with").set("common");
					this.$methods().renderAll();				
			},
			load_url_img_click: function(){ ///загрузить картинку cdn				
				var fd = this.props("load_url_img").getProp();
				img = new Image();
				img.crossOrigin = "Anonymous";
				img.src=fd;
				var context = this;
				img.onload = function(){ 
						startImg();
						context.$methods().renderAll();
			    };
			},
			phone_scale_mirror: function(){ //масштаб и отражение фоновой картинки	
				saveStep(saveImg, this.$props().commonProps.area_1);
			    var props = this.parent.props; var mirror_x_ = props.mirror_x.getProp(); var mirror_y_ = props.mirror_y.getProp();
				mainImgScale_y =  props.img_main_scale_y.getProp(); mainImgScale_x =  props.img_main_scale_x.getProp() ;				
				if(mirror_x_){mirror_x = -1;}else{mirror_x = 1;}
				if(mirror_y_){mirror_y = -1;}else{mirror_y = 1;}
				startImg();
				this.$methods().renderAll();
			},		
			 mirror_x_area: function(){//отражение выделения либо спрайта
				if( this.$props("operationWith") == "common" ){
                        if(!this.$props("commonProps").isEndArea_1){					
							alert("сперва нужно закончить выделение");
							return;					
						}					
						var area_1 = this.$props("commonProps").area_1;
						saveStep(saveImg, this.$props().commonProps.area_1);
						var img_data_arr =  getCutImg(ctx, area_1);
						 area_1 = flipArea(area_1, true, false);
						this.$props("commonProps").area_1 = area_1;
						ctx.putImageData(saveImg, 0, 0);
						var context = this;
						drawImgData(ctx,  img_data_arr[0], img_data_arr[1], area_1, true, false, false, false, true, function(){							
							context.$methods().renderAll();						
						});					
				}else if( this.$props().sprites[this.$props("operationWith")] ){					
					var sprite = this.$props().sprites[this.$props("operationWith")];
					sprite.flip(true, false, this);

				}
			 },
			 mirror_y_area: function(){
				if( this.$props("operationWith") == "common" ){
					    if(!this.$props("commonProps").isEndArea_1){					
							alert("сперва нужно закончить выделение");
							return;					
						}
				 var area_1 = this.$props("commonProps").area_1;
				 saveStep(saveImg, this.$props().commonProps.area_1);
				 var img_data_arr =  getCutImg(ctx, area_1);
				 area_1 = flipArea(area_1, false, true);
				 this.$props("commonProps").area_1 = area_1;
				 ctx.putImageData(saveImg, 0, 0);
				 var context = this;
				 drawImgData(ctx,  img_data_arr[0], img_data_arr[1], area_1, false, true, false, false, true, function(){							
							context.$methods().renderAll();								
				});				 
				}else if( this.$props().sprites[this.$props("operationWith")] ){					
					var sprite = this.$props().sprites[this.$props("operationWith")];
					sprite.flip(false, true, this);
				}				 
			 },
			add_index_point_click: function(){		//добавить точку после индекса
				 if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
				}			
				    var index = parseInt(this.props("add_index_point").getProp());
					if( this.$props("operationWith") == "common" ){	
							saveStep(saveImg, this.$props().commonProps.area_1);
							addPointTooArray(this.$props("commonProps").area_1, index );
							this.$methods().renderAll();	
					};
			},
			rm_index_point_click: function(){	//удалить точку после индекса			
				     var index = parseInt(this.props("rm_index_point").getProp());
					 if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
					}
					if( this.$props("operationWith") == "common" ){	
							saveStep(saveImg, this.$props().commonProps.area_1);
							rmPointFromArray(this.$props("commonProps").area_1, index );
							this.$methods().renderAll();
					};
			},
			reset_area: function(){ //сбросить область выделение
				if(this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение");
						return;					
				}
				if( this.$props("operationWith") == "common"  ){ 
					this.$props("commonProps").area_1 = [];
					 this.$props("commonProps").isEndArea_1 = false;
					this.$methods().renderAll();				
				}				
			},
			create_sprite: function(){ //создать спрайт			
				if(!this.$props("commonProps").isEndArea_1 || this.$props("operationWith") != "common"){					
						alert("сперва нужно переключиться на фоновое изображение и закончить выделение");
						return;					
				}
				if( this.$props("operationWith") == "common" && this.$props("commonProps").isEndArea_1 ){ 				
				      lineColor = colorSpriteArea;
					 var id = "sprite_"+Math.floor(Math.random()*10000); 
					 this.$props().operationWith = id;
					 var area = this.$props("commonProps").area_1;
					 var img_data_arr =  getCutImg(ctx, area);
					 var sprite = new CollageSprite(false,  area.slice(0), id);
					 this.$methods().renderAll();
					 this.$props("sprites")[id] = sprite;					 					 
					 getImgToSprite(img_data_arr, sprite, true);
					 this.$$("emiter-create-sprite").set(id);
					 this.$$("emiter-operation-with").set(id);
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
					var point = getCanvasPoint(event, this.parent.htmlLink);
					this.$$("emiter-mousedown-canvas").set(point);			    
				    if(event.which !== 1)return;
				    var area_1 = this.$props("commonProps").area_1;
					var isEndArea_1 = this.$props("commonProps").isEndArea_1;				
					if(this.$props("operationWith") == "common"){						
							if(isEndArea_1 === false){                           //добавляет точку к выделению либо замыкает контур								
									isEndArea_1 = endArea(area_1, point);								
									if(!isEndArea_1 ){
										area_1.push(point);
									}else{										
										this.$props("commonProps").isEndArea_1 = true;
									}
							}else{
								//saveStep(saveImg, this.$props().commonProps.area_1);
								 this.$props("commonProps").isMovePoint  = isClickOnPoint(area_1 ,point); ///индекс движемой точки
								 this.$props("commonProps").area_2 = this.$props("commonProps").area_1.slice(0);
							}
							drawAreaPoints(area_1, isEndArea_1);

					}else if(this.$props().sprites[this.$props("operationWith")]){						
						var sprite = this.$props().sprites[this.$props("operationWith")];
						sprite.mousedown(point, event, this);						
					}				
			},
			mousemove: function(){
					var point = getCanvasPoint(event, canvas);
					this.$$("emiter-mousemove-canvas").set(point);
					if(this.$props("operationWith") == "common"){
                        var indexPoint = this.$props("commonProps").isMovePoint;					
						if(indexPoint !== false){							
							if(this.$props("commonProps").scale_or_move == "move"){ //перемещение точки
								this.$props("commonProps").area_1[indexPoint] = point;
								this.$methods().renderAll();
								//drawAreaPoints(this.$props("commonProps").area_1);
							}else if(this.$props("commonProps").scale_or_move == "scale"){ //искажение
								this.$props("commonProps").area_2[indexPoint] = point;
								this.$methods().renderAll(false, {drawAreaPoints: false});
								drawAreaPoints(this.$props("commonProps").area_2);
							}	
						}											
					}else if(this.$props().sprites[this.$props("operationWith")]){ //операция с конкретным спрайтом, если он не удален						
						 var sprite = this.$props().sprites[this.$props("operationWith")];												 	
						 sprite.cursorOver_(point);
						 sprite.mousemove(point, this, event);
					}								
			},
			mouseup: function(){
					var point = getCanvasPoint(event, canvas);	
					this.$$("emiter-mouseup-canvas").set(point);			    
					if(event.which !== 1)return;										
					if(this.$props("operationWith") == "common"){						
						if(this.$props("commonProps").isMovePoint !== false){						
							if(this.$props("commonProps").scale_or_move == "scale"){
                                var area_1 = this.$props("commonProps").area_1; var area_2 = this.$props("commonProps").area_2;	var move_point = this.$props("commonProps").isMovePoint;							
								saveStep(saveImg, this.$props().commonProps.area_1);
								var imgDataArr = cutAndScale(area_1, area_2, move_point, false, true);
								this.$methods().renderAll(false, {drawAreaPoints: false});
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
	control_points: {
		container: "control_points",
		props: [["control_point_x", "inputvalue", "[name='control_point_x']"], 
		        ["control_point_y", "inputvalue", "[name='control_point_y']"],
				["point_x", "text", "[name='point_x']"], 
		        ["point_y", "text", "[name='point_y']"],
				["move_coner_to_point", "click", "[name='move_coner_to_point']"], 
		        ["move_center_to_point", "click", "[name='move_center_to_point']"],
				["listen_change_points", "emiter-mousemove-canvas", ""],
				["add_area_point", "click", "[name='add_area_point']"],
				["move_area_point", "inputvalue", "[name='move_area_point']"],
				["move_area_point_click", "click", "[name='move_area_point_click']"],
				["current_operation", "text", "[name='current_operation']"],
				["listen_current_operation", 'emiter-operation-with', ""],

               				
			 ],
		methods: {
			listen_current_operation: function(){
				 			this.parent.props.current_operation.setProp(this.emiter.prop); 			
			},
			listen_change_points: function(){ //отображает координаты x,y при движении курсора мыши
				var props = this.parent.props;
				props.point_x.setProp(this.emiter.prop[0]);
				props.point_y.setProp(this.emiter.prop[1]);				
			},
			move_area_point_click: function(){ //перемещает точку контура в новое положение
				var x = parseInt(this.parent.props.control_point_x.getProp()); var y = parseInt(this.parent.props.control_point_y.getProp());
				var index = parseInt(this.parent.props.move_area_point.getProp());
				if(isNaN(x) || isNaN(y) || isNaN(index) || this.$props("operationWith") != "common"){					
					alert("сперва нужно переключиться на фоновое изображение и ввести координаты точки");
					return;
				}	
				if(this.$props("operationWith") == "common"){ 
					 var area_1 = this.$props("commonProps").area_1;
					 saveStep(saveImg, this.$props().commonProps.area_1);
					if(area_1[index] !== undefined){
						area_1[index] = [x, y];	
						this.$methods().setAreas(area_1);
						this.$methods().renderAll();														
													
					}				
				}				
			},
			add_area_point: function(){ //добавляет указанную точку к незаконченному контуру
				var x = parseInt(this.parent.props.control_point_x.getProp()); var y = parseInt(this.parent.props.control_point_y.getProp());
				var index = parseInt(this.parent.props.move_area_point.getProp());
				if(isNaN(x) || isNaN(y) || isNaN(index) || this.$props("operationWith") != "common"){					
					alert("сперва нужно переключиться на фоновое изображение и ввести координаты точки");
					return;
				}
				if(this.$props("operationWith") == "common"){ 
					if(this.$props("commonProps").isEndArea_1 === false){ 
						var area_1 = this.$props("commonProps").area_1;
						saveStep(saveImg, this.$props().commonProps.area_1);
						var isEndArea_1 = endArea(area_1, [x, y]);
							if(!isEndArea_1 ){
								area_1.push([x, y]);
							}else{
								this.$props("commonProps").area_1 = area_1;
								this.$props("commonProps").isEndArea_1 = true;
								this.$methods().renderAll();
								return;
							}
						this.$props("commonProps").area_1 = area_1;	
						this.$methods().renderAll();							
					}
				}
			},			
			move_coner_to_point: function(){ //перемещает угол контура либо спрайта к указанной точке на канвас
				var x = this.parent.props.control_point_x.getProp(); var y = this.parent.props.control_point_y.getProp();
				if(this.$props("operationWith") == "common"){ 
					if(this.$props("commonProps").isEndArea_1 !== false){ 
					    var area_1 = this.$props("commonProps").area_1;
						saveStep(saveImg, this.$props().commonProps.area_1);
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x, imgBox[0][1]-y);
						this.$methods().setAreas(area_1);
						this.$methods().renderAll();						
					}				
				}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];
						var area_1 = sprite.area_1;
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x, imgBox[0][1]-y);
						sprite.setAreas(area_1);
						this.$methods().renderAll();				
				}				
			},
			move_center_to_point: function(){  //перемещает цетр спрайта либо контура к указанной точке
				var x = this.parent.props.control_point_x.getProp(); var y = this.parent.props.control_point_y.getProp();
				if(this.$props("operationWith") == "common"){ 
					if(this.$props("commonProps").isEndArea_1 !== false){ 						
					    var area_1 = this.$props("commonProps").area_1;
						saveStep(saveImg, this.$props().commonProps.area_1);
						var imgBox = getBox(area_1);						
						area_1 = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );
						this.$methods().setAreas(area_1);
						this.$methods().renderAll();							
					}				
				}else if(this.$props().sprites[this.$props("operationWith")]){
						var sprite = this.$props().sprites[this.$props("operationWith")];
						var area_1 = sprite.area_1;
						var imgBox = getBox(area_1);
						area_1 = getCutSize(area_1, imgBox[0][0]-x+(imgBox[1][0]-imgBox[0][0])/2, imgBox[0][1]-y+(imgBox[1][1]-imgBox[0][1])/2 );
						sprite.setAreas(area_1);
						this.$methods().renderAll();				
				}					
			},
		}
	},
	sprites: {
		selector: ".sprites",
		arrayProps: [
			["listen_create_sprite", "emiter-create-sprite", ""],
			["show_box_click", "click",  "[name='show_box']"], 
			["show_box", "checkbox",  "[name='show_box']"],
			["show_points_click", "click",  "[name='show_points']"], 
			["show_points", "checkbox",  "[name='show_points']"], 
			["add_control_point", "click",  "[name='add_control_point']"], //контрольные точки-координаты центра спрайта на канвас
			["all_to_control_points", "click",  "[name='all_to_control_points']"],
			
			["add_control_sprite_point", "click",  "[name='add_control_sprite_point']"], //контрольные точки спрайтов на спрайт листах
			["all_to_control_sprite_points", "click",  "[name='all_to_control_sprite_points']"],
			
		],
		arrayMethods: {
			all_to_control_sprite_points: function(){				
				var it = 0;
				for(var key in this.$props().sprites){
					var sprite = this.$props().sprites[key];
					if(sprite.controlSpritePoint)sprite.moveCenterTo(sprite.controlSpritePoint);					
					it++;
				}
				if(it>0)this.$methods().renderAll();			
			},
			add_control_sprite_point: function(){			
					var sprite = this.$props().sprites[this.$props("operationWith")];
					if( sprite != undefined ){					
						var x = sprite.point[0]+sprite.getHalfW();
						var y = sprite.point[1]+sprite.getHalfH();
						sprite.controlSpritePoint = [x, y];						
					}												
			},
			all_to_control_points: function(){			
				var it = 0;
				for(var key in this.$props().sprites){
					var sprite = this.$props().sprites[key];
					if(sprite.controlPoint)sprite.moveCenterTo(sprite.controlPoint);					
					it++;
				}
				if(it>0)this.$methods().renderAll();				
			},
			add_control_point: function(){			
					var sprite = this.$props().sprites[this.$props("operationWith")];
					if( sprite != undefined ){					
						var x = sprite.point[0]+sprite.getHalfW();
						var y = sprite.point[1]+sprite.getHalfH();
						sprite.controlPoint = [x, y];						
					}												
			},
			listen_create_sprite: function(){			
				var id = this.emiter.prop;				
				for(var i=0; i < this.parent.data.length; i++){					
					this.parent.data[i].props.class.removeProp("active");					
				}				
				var container = this.parent.add({id: id, class: "active"}, 0);	
                container.props.id.prop = id;				
			},
			show_box_click: function(){
				this.$props().showBox = this.parent.props.show_box.getProp();	
				this.$methods().renderAll();							
			},
			show_points_click: function(){
				this.$props().showPoints = this.parent.props.show_points.getProp();
				this.$methods().renderAll();			
			},
			
		},
		container: "sprite",
		props: [ ["id", "inputvalue", "[name='id']"], ["change_id", "change", "[name='id']"], ["class", "class", ""], ["click", "click", ""], ["rm_sprite", "click", "[name='rm_sprite']"],
		          ["show_sprite_click", "click", "[name='show_sprite']"], ["show_sprite", "text", "[name='show_sprite']"], 
				   ["layer_up", "click", "[name='layer_up']"], ["stamp", "click", "[name='stamp']"], ["stamp_cursor", "click", "[name='stamp_cursor']"],
				   ["save_sprite", "click", "[name='save_sprite']"],  ["copy_contur", "click", "[name='copy_contur']"],
				    ["to_control_point", "click", "[name='to_control_point']"],
				  ],
		methods : {
			to_control_point: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				//console.log(sprite);
				if(sprite && sprite.controlPoint){					
					sprite.moveCenterTo(sprite.controlPoint);
					this.$methods().renderAll();
				}				
			},
			change_id: function(){
				var id = this.props("id").getProp();
				if(this.$props().sprites[id] != undefined){					
					id = id + "_duble";
					this.props("id").setProp(id);
				}				
				var old_id = this.parent.props.id.prop;
				var sprite = this.$props().sprites[old_id];
				sprite.id = id;
				delete this.$props().sprites[old_id];
				this.$props().sprites[id] = sprite;	
				this.$props().operationWith = id;
				this.parent.remove();					
				var container = this.component().add({id: id, class: "active"}, 0);
				container.props.id.prop = id;	
			},
			copy_contur: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				saveStep(saveImg, this.$props().commonProps.area_1);
				if(sprite.rotate !== 0){	
                     var area = rotationArea(sprite.area_1, sprite.rotate);				
					this.$methods().setAreas( area  );				
				}else{					
					this.$methods().setAreas(sprite.area_1);
				}
				this.$props("commonProps").isEndArea_1 = true;								
			},
			save_sprite: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				sprite.saveOnPC();
			},
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
				 lineColor = colorSpriteArea;
                this.props("class").setProp("active");
				this.$props().operationWith = id;
				this.$$("emiter-operation-with").set(id);
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
					saveStep(saveImg, this.$props().commonProps.area_1);
			        ctx.putImageData(saveImg, 0, 0);
					sprite.render("common");
					saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);
					this.$methods().renderAll();
					
			},
			stamp_cursor: function(){
				var id = this.props("id").getProp();
				var sprite = this.$props().sprites[id];
				if(!sprite.stamp_cursor){
					sprite.stamp_cursor = true;
					this.htmlLink.style = "background-color: red;";
				}else{
					sprite.stamp_cursor = false;
					this.htmlLink.style = "";
				}	
				
			}
			
		},		
	},
	save_sprites: {
		selector: "ul:first-of-type",
		arrayProps: [ ["load_save_sprites", "click", "[name='load_save_sprites']",] ],
		arrayMethods: {
			load_save_sprites: function(){
               if(this.prop == null){				
					this.parent.removeAll();			
					var sprites_ = get_from_storage("spritesState");
					if(sprites_){					
						for(var key in sprites_){						
							this.parent.add({id: key});						
						}				
					}
					delete sprites_;
					this.prop = true;
					this.htmlLink.innerHTML = "Скрыть"
			   }else{
				   this.parent.removeAll();
				   this.prop = null;
				   this.htmlLink.innerHTML = "Показать сохраненные спрайты"
			   }
			}	
		},		
		container: "save_sprite",
		props: [ ["create_save_sprite", "click", "[name='create_save_sprite']"], ["id", "text", "[name='id']"],
				 ["rm_save_sprite", "click", "[name='rm_save_sprite']"], ["to_beginning_coordinats", "checkbox", "[name='to_beginning_coordinats']"],
		],
		methods: {
			create_save_sprite: function(){
				var id = this.props("id").getProp();
				if(this.$props().sprites[id]){					
					alert("спрайт с таким именем уже загружен");
					return;
				}
				 lineColor = colorSpriteArea;
				this.$$("emiter-operation-with").set(id);
				//this.$props().operationWith = id;
				var sprite = createFromPC(id, this, this.props("to_beginning_coordinats").getProp());
                if(sprite)this.$$("emiter-create-sprite").set(id);	
                					
								
			},
			rm_save_sprite: function(){
				var id = this.props("id").getProp();
				removeFromPC(id);
                this.component().props.load_save_sprites.emitEvent("click");			
			}			
		},
	},
	stateProperties: {		
		operationWith: "common", ///"spriteID" операция с объектом - спрайтом или общей картинкой "common"
		commonProps: { 	//обект с переменными для операций с фоновой картинкой	
			area_1: [], //область выделения до смещения
			area_2: [], //область выделения после смещения
			isEndArea_1: false, //флаг показывает - закончено ли выделение первой области (замкнут контур выделения)
			isMovePoint : false, //индекс перемещаемой точки контура
			scale_or_move: "move", // масштаб по точкам либо перемещение точки контура
		},
		sprites: {},	//спрайты
	    showBox: true, //показывать квадрат в который вписан спрайт
	    showPoints: false, //контрольные точки выделения спрайтов		
	},
	stateMethods: {		
		renderAll: function(operationName, option){	//отображает на экране все спрайты и фоновую картинку

			if(option == undefined){
				option = {
					showBox: this.stateProperties.showBox,
					showPoints:  this.stateProperties.showPoints,
                    drawAreaPoints: true,					
				}
			}else{
				option.showBox = this.stateProperties.showBox;
				option.showPoints = this.stateProperties.showPoints;
				if(option.drawAreaPoints == undefined)option.drawAreaPoints = true;
			}		
			ctx.putImageData(saveImg, 0, 0);
			var sprId_or_common = this.stateProperties.operationWith;
			var sprites = this.stateProperties.sprites;		
			for (var key in sprites){				
				sprites[key].render(sprId_or_common, operationName, option);
				//console.log(sprites);
			}
			if( this.stateProperties.operationWith == "common" && option.drawAreaPoints != false)drawAreaPoints(this.stateProperties.commonProps.area_1, this.stateProperties.commonProps.isEndArea_1);
		},
        setAreas: function(area){ //копирует масив с точками 
				this.stateProperties.commonProps.area_1 = area.slice(0);
				this.stateProperties.commonProps.area_2 = area.slice(0);					
		}		
	},	
	eventEmiters: {		
		["emiter-create-sprite"] : {prop: ""}, //событие создания спрайта
		["emiter-mousemove-canvas"] : {prop: ["x", "y"]}, //событие движения курсора по канвас и массив с координатами точки 
		["emiter-mousedown-canvas"] : {prop:  ["x", "y"]},
		["emiter-mouseup-canvas"] : {prop:  ["x", "y"]},
		["emiter-operation-with"] : {
			prop: "common",
			behavior: function(){				
				this.$props().operationWith = this.prop;
			}		
		}, //событие смены операции (фоном, спрайтом)

	}	
}
/*window.onload= function(){	
	
}*/