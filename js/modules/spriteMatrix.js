/*
Модуль  - добавляет панель автоматического создания и загрузки спрайт листов 
*/
(function(){	
  var html = `
  							<div data-sprite_matrix_panel="container"  class="form-group col-12">
								 <p name="form_show" class="clicker" style="margin-top: 10px;">Sprite Matrix <span>+</span></p>
									<div class="form-row d-none">
										<div class="alert alert-primary col-12" role="alert">
                                            Для создания спрайт-листа необходимо расположить все спрайты на экране чтобы они не перекрывали контур друг друга.
											Для спрайтов на основе прямоугольников - чтобы их границы не перекрывали друг друга. Скрытые из видимости спрайты не попадут в спрайт лист.
											Далее ввести имя спрайта для json файла и нажать на кнопку создать. Модуль создаст .json файл с именами и координатами спрайтов. Картинку спрайтов также нужно скопировать
											на компъютер. 
										</div>							
										<div class="form-group col-4">										
											<div class="form-check">
												<input data-sprite_matrix_panel-type_matrix_contur="radio" class="form-check-input" type="radio" name="type_matrix" id="exampleRadios1" value="square" checked>
												<label class="form-check-label" for="exampleRadios1">
													Спрайты на основе контура
												</label>
											</div>
											<div class="form-check">
												<input data-sprite_matrix_panel-type_matrix_square="radio" class="form-check-input" type="radio" name="type_matrix" id="exampleRadios2" value="contur">
												<label class="form-check-label" for="exampleRadios2">
													Спрайты на основе прямоугольников
												</label>
											</div>
											<div class="form-check">
												<input  class="form-check-input" type="checkbox" chacked name="is_save_control_points" id="exampleRadios3" value="contur">
												<label class="form-check-label" for="exampleRadios3">
													Сохранить контрольные точки спрайтов
												</label>
											</div>
										</div>

										<div class="form-group col-4">						
											<input name="matrix_name" type="text" class="form-control form-control-sm"  placeholder="название спрайт листа" title="название спрайт листа" value="">
											<input type="text" name="add_padding" placeholder="добавить отступы прямоугольным спрайтам" class="form-control form-control-sm"  title="Добавить отступы для прамоугольных спрайтов">
										</div>	
									
									     <div class="form-group col-4">								
											<button type="button"  style="" name="create_matrix_btn" class="btn btn-success btn-sm" title="Создать матрицу спрайтов">Создать</button>
										</div>

										<div class="alert alert-primary col-12" role="alert">
											Для создания спрайтов из сохраненного спрайт-листа, нужно загрузить картинку спрайтов, убедиться что ее масштаб равен 1:1.
											Затем нажать на кнопку "Загрузить json лист" и загрузить json файл с описанием данной картинки. После чего модуль создаст все спрайты из описания.
										</div>
										<div class="form-group col-10">
											<div class="form-check">
												<input  class="form-check-input" type="checkbox" chacked name="move_to_control_points" id="exampleRadios3" title="Отобразить спрайты на контрольных точках (при их наличии)">
												<label class="form-check-label" for="exampleRadios3">
													Отобразить на контрольных точках
												</label>
											</div>
										</div>	
											
										
								    <div class="form-group col-10">
										 <div class="form-group">
											<label name="load_matrix_click" class="inp-file" for="matrix_json" title="Загрузить спрайт лист (.json) с компьютера">Загрузить json лист</label>
											<input name="load_matrix" type="file" class="form-control-file form-control-sm"  style="position: absolute; top: 0px; visibility: hidden;" id="matrix_json">
										</div>
									</div>

									
									</div>
								</p>	
							 </div>
  `;
  
  var div = document.createElement("div");
  div.innerHTML = html;
  div = div.querySelector("div");
  //console.log(div);
  var parent = document.querySelector(".main-row");
  var insert_before = document.querySelector("[name='form_load_module']") 
  var insertedElement = parent.insertBefore(div, insert_before);
  
  
  var sprite_matrix_panel = {
	  
	  container: "sprite_matrix_panel",
	  props: [	  
	     ["form_show", "extend", "form_text", "props"], ["form_style", "class", "div.d-none"],
		 
		["create_matrix_btn", "click", "[name='create_matrix_btn']"], ["matrix_name", "inputvalue", "[name='matrix_name']"], 
		"type_matrix_contur", "type_matrix_square", 
		 ["is_save_control_points", "checkbox", "[name='is_save_control_points']"],
	     ["move_to_control_points", "checkbox", "[name='move_to_control_points']"],
		  ["add_padding", "inputvalue", "[name='add_padding']"],
		
		["load_matrix_click", 'change', "[name='load_matrix']"], ["load_matrix", "inputvalue", "[name='load_matrix']"], 
             		
	  ],
	  methods: {
		  load_matrix_click: function(){
			  
			    var move_to_control_points = this.props("move_to_control_points").getProp();
			  	var json_ = this.parent.props.load_matrix.htmlLink.files[0];
				var context = this;
				
				handleFiles_(json_); 
				
				function handleFiles_(file) {
						json = file;
						var reader = new FileReader();	
                        //console.log(file);						
						reader.onload = (function(aJson) { return function(e) { 
							aJson = e.target.result;							
							var spiteList = JSON.parse(aJson);
							ctx.clearRect(0, 0, srcWidth , srcHeight);
							ctx.putImageData(saveImg, 0, 0);

							for(var key in spiteList){
							    								
								var area = spiteList[key].area;
								if(area == undefined){									
									var point = spiteList[key].point; var width = spiteList[key].width; var height = spiteList[key].height;									
									area = [point, [point[0]+width, point[1]], [point[0]+width, point[1]+height], [point[0], point[1]+height] ];
								}								
									var img_data_arr =  getCutImg(ctx, area);
									var sprite = new CollageSprite(false,  area.slice(0), key);
									if(spiteList[key].controlSpritePoint != undefined){
										sprite.controlSpritePoint = spiteList[key].controlSpritePoint;										
									}
									if(spiteList[key].controlPoint != undefined){
										sprite.controlPoint = spiteList[key].controlPoint;
										if(move_to_control_points === true && sprite.controlPoint !==false){
											sprite.moveCenterTo(sprite.controlPoint);
											img_data_arr[1]=sprite.point; img_data_arr[2]=sprite.point2; 
										}
									}									
									context.$props("sprites")[key] = sprite;					 					 
									getImgToSprite(img_data_arr, sprite, true);
									context.$$("emiter-create-sprite").set(key);
							}
							//context.$methods().renderAll();							
						}; })(json);						
						reader.readAsText(file);					
				}
			  
		  },		  
		  create_matrix_btn: function(){
			  var is_save_control_points = this.props("is_save_control_points").getProp();
			  var matrix_name = this.props("matrix_name").getProp();			  
			  var type_matrix_contur = this.props("type_matrix_contur").getProp();
			  var type_matrix_square = this.props("type_matrix_square").getProp();
			  var padding = parseInt(this.props("add_padding").getProp());

		      var spriteMatrix = {};
			  var sprites = this.$props().sprites;
			  	
                 ctx.clearRect(0,0, srcWidth, srcHeight);
                 //this.$$("emiter-operation-with").set("common");				 
			  for(var key in sprites){				  
				  if(sprites[key].show == false)continue;
				  spriteMatrix[key] = {};
				  if(type_matrix_contur){	

                       var area  = 	sprites[key].area_1.slice(0);
						if(sprites[key].rotate !==0 ){
							area = rotationArea(area, sprites[key].rotate);
						}
					   
					  spriteMatrix[key].area = area;
				  }else{					  
					  var point = sprites[key].point.slice(0);
					   var point2 = sprites[key].point2.slice(0);
					   
					   if(sprites[key].rotate !==0 ){
						   var area = rotationArea(sprites[key].area_1, sprites[key].rotate);
                           var imgBox = getBox(area);
                           	point = imgBox[0]; point2 = imgBox[1];					   
					   }
                       if(!isNaN(padding)){
						  	point = [ point[0] - padding, point[1] - padding];
						   point2 = [ point2[0] + padding, point2[1] + padding]; 					    
					   }					   
					  spriteMatrix[key].point = point.slice(0);
					  spriteMatrix[key].width = point2[0] - point[0];
					  spriteMatrix[key].height = point2[1] - point[1];
				  }
				  if(is_save_control_points){
					  spriteMatrix[key].controlPoint = sprites[key].controlPoint;
					  spriteMatrix[key].controlSpritePoint = sprites[key].controlSpritePoint;
				  }
				  sprites[key].render();
			  }
			  

			var json = JSON.stringify(spriteMatrix);
			//console.log(json);
			  download(matrix_name+".json", json);
			 		  		  
		  }	,	  
	  }	  
  }

  HM.description.sprite_matrix_panel  = sprite_matrix_panel;
  HM.containerInit(div , HM.description, "sprite_matrix_panel");

})()