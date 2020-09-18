/*
Модуль  - добавляет панель создания градиентов

*/

(function(){	
  var html = `
  							<div data-add_gradient_panel="container"  class="form-group" name="data-add_gradient_panel">
								 <p name="form_show" class="clicker" style="margin-top: 10px;">Добавить радиент <span>+</span></p>
								 <div  class="d-none">
									<label for="exampleFormControlInput1" style="font-size: 15px;">Добавить градиент выделению</label>
									<div class="form-row">
										<div class="form-group col-12">
										
											<textarea  name="add_gradient_colors" type="text" rows="3" cols="45" type="text" class="form-control form-control-sm"  placeholder="Массив с контрольными точками и цветами градиента: [[0,'red'], [0.5, 'yellow'],........., [0.5, 'green'] ]" title="Добавить цвета градиентов и контрольные точки" >[[0, "green"],[0.5,"cyan"],[1, "green"]]</textarea>
										    <textarea name="radial_points" type="text" rows="3" cols="45" type="text" class="form-control form-control-sm d-none"  placeholder="центр относительно высоты и ширины фигуры, начальный и конечный диаметр: [0.5,0.5,d1],[0.5,0.5,d2]]" title="центр относительно высоты и ширины фигуры, начальный и конечный диаметр" >[[0.5,0.5,30],[0.5,0.5,100]]</textarea>
										</div>									

										<div class="form-group col-5">
											<label name="" class="" for="exampleFormControl_gg" title="">Направление</label>								
										</div>
										<div class="form-group col-4">
											<select name="gradient_direction" style="width: 80px; position: relative; top: 4px;"  id="exampleFormControl_gg" title="Выбрать направление градиента">
												<option>x</option>
												<option>y</option>
												<option>radial</option>
											</select>
										</div>
									     <div class="form-group col-3">								
											<button type="button"  style="" name="add_gradient_btn" class="btn btn-success btn-sm" title="Добавить градиент">add</button>
										  </div>
									</div>
								</div>
						    </div>
  `;
  
  var div = document.createElement("div");
  div.innerHTML = html;
  div = div.querySelector("div");
  //console.log(div);
  var parent = document.querySelector(".right_collagen_panel");
  var insert_before = document.querySelector("[data-save_sprites]")
  var insertedElement = parent.insertBefore(div, insert_before);
  
  
  var add_gradient_panel = {
	  
	  container: "add_gradient_panel",
	  props: [
	    ["form_show", "extend", "form_text", "props"], ["form_style", "class", "div.d-none"],
		["add_gradient_btn", "click", "[name='add_gradient_btn']"], 
		["gradient_direction", "select", "[name='gradient_direction']"],
		["add_gradient_colors", "inputvalue", "[name='add_gradient_colors']"],
		
		["radial_points", "inputvalue", "[name='radial_points']"],
		["radial_class", "class", "[name='radial_points']"],
		["gradient_direction_click", "click", "[name='gradient_direction']"],
 		
		//["canvas_click", "emiter-mousedown-canvas", ""], 	
		//["operation_with", "emiter-operation-with", ""],
	  ],
	  methods: {
		  /*operation_with: function(){ 
	  
		  },*/
		  gradient_direction_click: function(){
			  var direction = this.parent.props.gradient_direction.getProp();
			  if(direction == "radial"){
				  this.parent.props.radial_class.removeProp("d-none");
				  
			  }else{
				  this.parent.props.radial_class.setProp("d-none");
			  }
		  },
		  add_gradient_btn: function(){
				var props = this.parent.props;
				var direction = props.gradient_direction.getProp();
				var points_colors;
				try{
					points_colors = JSON.parse(props.add_gradient_colors.getProp());
				}catch(e){
					alert("неверный формат json массива "+e);
					return;
				}	
			    if(this.$props("operationWith") == "common" ){
						if(!this.$props("commonProps").isEndArea_1){					
										alert("сперва нужно  закончить выделение контура");
											return;					
						}
						var area = this.$props("commonProps").area_1
						var box = getBox(area);
						
						var gradient;
						if(direction == "x"){
							gradient = ctx.createLinearGradient(box[0][0],0, box[1][0],0);
						}else if(direction == "y"){
							gradient = ctx.createLinearGradient(0, box[0][1], 0, box[1][1]);
						}else if(direction == "radial"){
						   var radial_points;
							try{
								radial_points = JSON.parse(props.radial_points.getProp());
							}catch(e){
								alert("неверный формат json массива radial points"+e);
									return;
							}						   
                           var offset_x1 = radial_points[0][0], offset_x2 = radial_points[1][0], offset_y1 = radial_points[0][1], offset_y2 = radial_points[1][1], d1 = radial_points[0][2], d2 = radial_points[1][2]; 						   
							gradient =  ctx.createRadialGradient(box[0][0]+(box[1][0] - box[0][0])*offset_x1 , box[0][1]+(box[1][1] - box[0][1])*offset_y1, d1 , 
							                                     box[0][0]+(box[1][0] - box[0][0])*offset_x2 , box[0][1]+(box[1][1] - box[0][1])*offset_y2, d2);							
						}					
						for(var i=0; i<points_colors.length; i++ ){
							
							gradient.addColorStop(points_colors[i][0], points_colors[i][1]);
						}
						saveStep(saveImg, this.$props().commonProps.area_1);
						drawArea(area, true, false, false, true, gradient, false);
						saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
						
		  }else{
			  alert("сперва нужно  переключиться на фоновое изображение");
		  }
				
		  }	,	  
	  }	  
  }
  HM.description.add_gradient_panel  = add_gradient_panel;
  HM.containerInit(div , HM.description, "add_gradient_panel");	
})()