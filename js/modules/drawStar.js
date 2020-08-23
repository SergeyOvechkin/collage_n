

(function(){	
	/*
	cx, cy - точка на канвас для размещения контура
	spikes - количество лучей звезды
	outerRadius, innerRadius - внутренний и внешний радиус
	использование в функции создания контура:	area = modules.drawStar(200,200, 4,70,30);
	*/
	modules.drawStar = function(cx,cy,spikes,outerRadius,innerRadius){		
	  var area = [];	
      var rot=Math.PI/2*3;
      var x=cx;
      var y=cy;
      var step=Math.PI/spikes;
      area.push([cx,cy-outerRadius]);
      for(i=0;i<spikes;i++){
        x=cx+Math.cos(rot)*outerRadius;
        y=cy+Math.sin(rot)*outerRadius;
        area.push([x,y])
        rot+=step
        x=cx+Math.cos(rot)*innerRadius;
        y=cy+Math.sin(rot)*innerRadius;
        area.push([x,y])
        rot+=step
      }
      area.push([cx,cy-outerRadius]);
	  return area//[[10,10],[20,20],[30,50],[90,300]];
    }
	console.log(modules)	
})()