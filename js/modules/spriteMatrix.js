/*
Модуль  - добавляет панель автоматического создания и загрузки спрайт листов 
*/

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

(function(){	
  var html = `
  							<div data-sprite_matrix_panel="container"  class="form-group col-12">
								 <p name="form_show" class="clicker" style="margin-top: 10px;">Sprite Matrix <span>+</span></p>
									<div class="form-row d-none">
										<div class="alert alert-primary col-12" role="alert">
                                            Для создания спрайт листа необходимо расположить все спрайты на экране чтобы они не перекрывали контур друг друга.
											Для спрайтов на основе прямоугольников - чтобы их граници не перекрывали друг друга. Скрытые из видимости спрайты не попадут в спрайт лист.
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
										</div>

										<div class="form-group col-4">						
											<input name="matrix_name" type="text" class="form-control form-control-sm"  placeholder="название спрайт листа" title="название спрайт листа" value="">
										</div>	
									
									     <div class="form-group col-4">								
											<button type="button"  style="" name="create_matrix_btn" class="btn btn-success btn-sm" title="Создать матрицу спрайтов">Создать</button>
										</div>

										<div class="alert alert-primary col-12" role="alert">
											Для создания спрайтов из сохраненного спрайт листа, нужно загрузить картинку спрайтов, убедиться что ее масштаб равен 1:1. Далее скрыть все уже созданные спрайты и выделения.
											Затем нажать на кнопку "load matrix.json" и загрузить json файл с описанием данной картинки. После чего модуль создаст все спрайты из описания.
										</div>	
										
								    <div class="form-group col-12">
										 <div class="form-group">
											<label name="load_matrix_click" class="inp-file" for="matrix_json" title="Загрузить спрайт лист.json с компьютера">load matrix.json</label>
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
		
		["load_matrix_click", 'change', "[name='load_matrix']"], ["load_matrix", "inputvalue", "[name='load_matrix']"], 
             		
	  ],
	  methods: {
		  load_matrix_click: function(){
			  	var json_ = this.parent.props.load_matrix.htmlLink.files[0];
				var context = this;
				handleFiles(json_); 
			
				function handleFiles(file) {
						json = file;
						var reader = new FileReader();					
						reader.onload = (function(aJson) { return function(e) { 
							aJson = e.target.result;							
							var spiteList = JSON.parse(aJson);							
							for(var key in spiteList){								
								var area = spiteList[key].area;
								if(area == undefined){									
									var point = spiteList[key].point; var width = spiteList[key].width; var height = spiteList[key].height;									
									area = [point, [point[0]+width, point[1]], [point[0]+width, point[1]+height], [point[0], point[1]+height] ];
								}								
									var img_data_arr =  getCutImg(ctx, area);
									var sprite = new CollageSprite(false,  area.slice(0), key);
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
			  
			  var matrix_name = this.props("matrix_name").getProp();			  
			  var type_matrix_contur = this.props("type_matrix_contur").getProp();
			  var type_matrix_square = this.props("type_matrix_square").getProp();

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
					  spriteMatrix[key].point = point.slice(0);
					  spriteMatrix[key].width = point2[0] - point[0];
					  spriteMatrix[key].height = point2[1] - point[1];
				  }
				  sprites[key].render();
			  }
			  
			
			  
			var json = JSON.stringify(spriteMatrix);
			console.log(json);
			  download(matrix_name+".json", json);
			 		  		  
		  }	,	  
	  }	  
  }

  HM.description.sprite_matrix_panel  = sprite_matrix_panel;
  HM.containerInit(div , HM.description, "sprite_matrix_panel");

})()