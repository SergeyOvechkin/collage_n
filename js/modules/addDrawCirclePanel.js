/*
Модуль  - добавляет панель рисования окружностей 
В активном состоянии устанавливает свойство operationWith = "draw-circle"
*/


(function(){	
  var html = `
  								 <div data-draw_circle_panel="container"  class="form-group" name="draw_circle_panel">
									<label for="exampleFormControlInput1" style="font-size: 15px;">Рисовать окружность</label>
									<div class="form-row">
									     <div class="form-group col-md-4">								
											<button type="button"  style="" name="draw_circle_btn" class="btn btn-success btn-sm" title="Для рисования нужно кликать по канвас после нажатия кнопки">Рисовать</button>
										</div>
										<div class="form-group col-md-4">
										
											<input name="draw_sircle_radius" type="text" class="form-control form-control-sm"  placeholder="радиус" title="" value="35">
										</div>
										<div class="form-group col-md-4">
										
											<input name="draw_sircle_color" type="text" class="form-control form-control-sm"  placeholder="цвет" title="" value="yellow">
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
  
  
  var draw_circle_panel = {
	  
	  container: "draw_circle_panel",
	  props: [
		["draw_circle_btn", "click", "[name='draw_circle_btn']"], 
		["draw_sircle_radius", "inputvalue", "[name='draw_sircle_radius']"],
		["draw_sircle_color", "inputvalue", "[name='draw_sircle_color']"], 
		["canvas_click", "emiter-mousedown-canvas", ""], 
	  ],
	  methods: {
		  draw_circle_btn: function(){

				  this.$$("emiter-operation-with").set("draw-circle");
			 		  		  
		  }	,
		 canvas_click: function(){
			if(this.$$("emiter-operation-with").prop == "draw-circle"){
			  var props = this.parent.props;
			  var radius = props.draw_sircle_radius.getProp();
			  var color = props.draw_sircle_color.getProp();
			  var point = this.emiter.prop;	
			  saveStep(saveImg, this.$props().commonProps.area_1);
				ctx.save();
	            ctx.putImageData(saveImg, 0, 0);
				ctx.beginPath();
				ctx.arc(point[0], point[1], radius, 0, 2*Math.PI, false);
				ctx.fillStyle =  color;
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle =  color;
				ctx.stroke();				
				saveImg = ctx.getImageData(0,0, srcWidth, srcHeight);
				ctx.restore();				
			}
		}	  
	  }	  
  }

  HM.description.draw_circle_panel  = draw_circle_panel;
  HM.containerInit(div , HM.description, "draw_circle_panel");
   
	//console.log(HM);	
})()