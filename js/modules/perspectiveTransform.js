

/*
Модуль  - добавляет панель трансформации перспективы и  прямоугольного выделения изображения  
В активном состоянии устанавливает свойство operationWith = "square-selector"
*/

//траннсформация углов выделенной области
//coner - углы ABCD - A - Правый верхний угол, счет по часовой стрелке
//area -четыре точки прямоугольника
//direction - направление деформации
//coeff - коэфф увеличения/уменьшения угла
function perspectiveTransform(ctx, area, coner, coeff, isRotate){
	
	var area2 = area.slice(0);
	         
			 area2[0] =  area2[0].slice(0);
			 area2[1] =  area2[1].slice(0);				
			 var with_  = (area2[1][0] - area2[0][0])*coeff;
			 var dist = with_  - (area2[1][0] - area2[0][0]); //расстояние увеличения/уменьшения
			 area2[0][0] = area2[0][0] - dist/2;			 
             area2[1][0] = area2[1][0] + dist/2;///2;
			 
			 var imgBox2= getBoxRound(area2);
			 var imgBox= getBoxRound(area);
             var cutWidth =  imgBox[1][0]-imgBox[0][0];
			 var cutWidth2 =  imgBox2[1][0]-imgBox2[0][0];
			 var cutHeight = imgBox[1][1]-imgBox[0][1];
			 var cutHeight2 = imgBox2[1][1]-imgBox2[0][1];
			
			var imgMap = ctx.getImageData(imgBox[0][0], imgBox[0][1], cutWidth , cutHeight);
			var imgMap2;
			if(isRotate){
				imgMap2 = ctx.createImageData(cutWidth2, cutHeight2);
				}else{
				imgMap2 = ctx.getImageData(imgBox2[0][0], imgBox2[0][1], cutWidth2 , cutHeight2); 
			}
			
			var imgData = imgMap.data, imgData2 = imgMap2.data;	
			var W = cutWidth , H = cutHeight;
			var W2 = cutWidth2 , H2 = cutHeight2;
			
					for(var tmpY = 0; tmpY <  H2; tmpY++) {
                        if(coner == "A" || coner == "D" || coner == "AD" || coner == "DA"){
							 var coeff_y =  tmpY/H2;
							 if(coeff < 1)coeff_y = 1-tmpY/H2;
						}					 					 
						 if(coner == "B" || coner == "C" || coner == "CB" || coner == "BC"){
							 coeff_y = 1-tmpY/H2;
							 if(coeff < 1)coeff_y = tmpY/H2;
							 
						 }						 
						 for(var tmpX = 0;  tmpX < W2; tmpX++) {														
								var point2 = (tmpY*W2)*4;
								
								var coeff_56 = 1 - (W/(W+dist));
								
								var part1;
									if(coeff > 1){ part1 = tmpX*(1-coeff_56*coeff_y);}
									if(coeff < 1){ part1 = tmpX/(W/(W+dist*coeff_y)); }
								var part2;
									if(coeff > 1){ part2 = (dist/2)*coeff_y ;}
									if(coeff < 1){ part2 = ((dist/2)*coeff_y)*(-1); }									
									
									if(coner == "A" || coner == "B")point2 += Math.round( part1)*4;
									if(coner == "AD"|| coner == "BC" || coner == "DA"|| coner == "CB")point2 += Math.round( part1+part2)*4;									
									if(coner == "D" || coner == "C")point2 += Math.round( part1+part2*2)*4;
							
								var tmpX_ = tmpX;
								if(tmpX_ == 0)tmpX_ =1;
                                var coeff_1 = tmpX_/W2; 
								var point = (tmpY*W)*4 + Math.round( coeff_1*W)*4 ;								
								imgData2[point2] = imgData[point]; 
								imgData2[ point2+1] = imgData[point+1];
								imgData2[ point2+2] = imgData[point+2]; 
								imgData2[ point2+3] = imgData[point+3];											
						}
				}

           if(isRotate){
			   ctx.putImageData(saveImg, 0, 0);
			   rotateImgData(ctx, imgMap2, imgBox2[0], imgBox2[1], isRotate*(-1), function(){});
			   return;
			 }		   
           ctx.putImageData(imgMap2, imgBox2[0][0], imgBox2[0][1]);				

}

(function(){	
  var html = `
  								 <div data-perspective_transform="container"  class="form-group" name="perspective_transform_panel">
								  <p name="form_show" class="clicker" style="margin-top: 10px;">Perspective Transform<span>+</span></p>
									<div class="form-row d-none">
									

									<label for="exampleFormControlInput1" style="font-size: 15px;">Преобразование перспективы
									</label>
									<div class="form-row">
									     <div class="form-group col-md-3">								
											<button type="button"  style="" name="start_select" class="btn btn-success btn-sm" title="Начать выделение области">Select</button>
										</div>
										<div class="form-group col-md-2">					
											<input name="coner_name" type="text" class="form-control form-control-sm"  placeholder="угол ABCD" title="Ввести угол: ABCD  А-правый верхний,счет - по часовой стрелке" value="A">
										</div>
										<div class="form-group col-md-2">							
											<input name="direction" type="text" class="form-control form-control-sm"  placeholder="направление x,y" title="ввести ось преобразований x или y" value="x">
										</div>
										<div class="form-group col-md-2">							
											<input name="coeff" type="text" class="form-control form-control-sm"  placeholder="коэффициент в долях" title="Коэффициент увеличения или уменьшения стороны" value="1.6">
										</div>
										<div class="form-group col-md-3">								
											<button type="button"  style="" name="start_deformation" class="btn btn-success btn-sm">Apply</button>
										</div>
									</div>
									<div class="alert alert-info" role="alert">
										<p> Для начала работы необходимо нажать кнопку "select", затем выделить область, ввести параметры и нажать "apply".</p>                                    
										<p> Углы квадрата выделения: ABCD.</p>
										<p>A-верхний правый угол, счет по часовой стрелке.</p>
										<p>x,y - оси искажения</p>	
										<p> AD или BC, x - применить к обоим углам по оси x </p>								 
										<p>AB или CD, y - применить к обоим углам по оси y</p>									
									</div>									
									</div>
								 </div>
  `;
  
  var div = document.createElement("div");
  div.innerHTML = html;
  div = div.querySelector("div");
  //console.log(div);
  var parent = document.querySelector("[data-main_form]");
  var insert_before = document.querySelector("[name='common_btns_class']")
  var insertedElement = parent.insertBefore(div, insert_before);
  
  
  var perspective_transform = {
	  
	  container: "perspective_transform",
	  props: [
		["start_select", "click", "[name='start_select']"],
		["start_deformation", "click", "[name='start_deformation']"],
		
		["coner_name", "inputvalue", "[name='coner_name']"],
		["direction", "inputvalue", "[name='direction']"], 
		["coeff", "inputvalue", "[name='coeff']"], 
		
		["canvas_click", "emiter-mousedown-canvas", ""], 
		["canvas_move", "emiter-mousemove-canvas", ""], 
		
		["form_show", "extend", "form_text", "props"], ["form_style", "class", "div.d-none"],
	  ],
	  methods: {
		  start_deformation: function(){ 
		      if(this.$$("emiter-operation-with").prop != "square-selector" || this.$props().commonProps.area_1.length != 4){				  
				  alert("сперва необходимо выделить прямоугольнцю область для трансформации и ввести все параметры");
				  return;
			  }
		      
			  var area = this.$props().commonProps.area_1;
			  var coner = this.props("coner_name").getProp();
			  var direction = this.props("direction").getProp();
			   var coeff = this.props("coeff").getProp();
			   
			  if(direction == "y"){
				  //ctx.save();
				 
				  var fi = 90* Math.PI / 180;
				  var img_data_arr =  getCutImg(ctx, area);				  
				 // area = rotationArea(area, fi);
				  if(coner === "A"){
					coner = "B";					
				  }else if(coner === "B"){
					  coner = "C";
				  }else if(coner === "C"){
					  coner = "D";}
				  else if(coner === "D"){coner = "A";}		  
				  if(coner === "AB" || coner === "BA"){coner = "BC";}
				  if(coner === "CD" || coner === "DC"){coner = "AD";}
				  
				  area_= rotationArea(area, fi);
				  area_ = getSquareFromTwo(area_[3], area_[1]);
				  saveStep(saveImg, this.$props().commonProps.area_1); 
				  ctx.putImageData(saveImg, 0, 0);
				  ctx.imageSmoothingEnabled = false;
				  rotateImgData(ctx, img_data_arr[0], img_data_arr[1], img_data_arr[2],  fi, function(){
					  	//ctx.putImageData(saveImg, 0, 0);		  
					    perspectiveTransform(ctx, area_, coner, coeff, fi);
						
				  }, false);
				  //ctx.restore();
			  }else{
				 saveStep(saveImg, this.$props().commonProps.area_1); 
				 ctx.putImageData(saveImg, 0, 0);
				 perspectiveTransform(ctx, area, coner, coeff, false);
				 saveImg = ctx.getImageData(0, 0, srcWidth , srcHeight);			 
			  }
		  },
		  start_select: function(){

				  this.$$("emiter-operation-with").set("square-selector");
				  this.$props().commonProps.area_1 = [];
			 		  		  
		  }	,
		 canvas_click: function(){
			if(this.$$("emiter-operation-with").prop == "square-selector"){
			  var point = this.emiter.prop;	
              this.$props().commonProps.area_1.push(point);
				this.$props().commonProps.isEndArea_1 = false;
				
					if(this.$props().commonProps.area_1.length == 2){
						ctx.putImageData(saveImg, 0, 0);
						drawBox(this.$props().commonProps.area_1[0], point, "violet", 3);
                         var area = getBox([this.$props().commonProps.area_1[0], point])						
					    this.$methods().setAreas(getSquareFromTwo( area[0], area[1] ) );
						this.$props().commonProps.isEndArea_1 = true;
						
					}else if(this.$props().commonProps.area_1.length > 2){
					
					this.$props().commonProps.area_1 = [point];
				}               		
			}
		},
		canvas_move: function(){
			if(this.$$("emiter-operation-with").prop == "square-selector"){
			  var point = this.emiter.prop;	
              
				if(this.$props().commonProps.area_1.length == 1){					
					ctx.putImageData(saveImg, 0, 0);
					drawBox(this.$props().commonProps.area_1[0], point, "violet", 3);					
				}			
			}
		}		
	  }	  
  }

  HM.description.perspective_transform  = perspective_transform;
  HM.containerInit(div , HM.description, "perspective_transform");
   
//	console.log(HM);	
})()