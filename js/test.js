
	
	 var img = new Image();
	 //img.crossOrigin = "Anonymous";
	 img.src="./img/img.png";
	 
	var canvas = document.getElementById("canvas");
   // canvas.id = 'canvas';
    canvas.width=400;
    canvas.height=400;
    //document.body.appendChild(canvas);
	




 
img.onload = function(){ 
        //draw the original rectangular image as a 300x300 quadrilateral with its bottom-left and top-right corners skewed a bit:
        drawImageInPerspective(
         img, canvas,
         //coordinates of the 4 corners of the quadrilateral that the original rectangular image will be transformed onto:
         0, 0, //top left corner: x, y
         50, 300, //bottom left corner: x, y - position it 50px more to the right than the top right corner
         300, 0, //top right corner: x, y - position it 50px below the top left corner 
         300, 300, //bottom right corner: x,y
         false, //don't flip the original image horizontally
         false //don't flip the original image vertically
        );
}
    


function drawImageInPerspective(
        srcImg,
        targetCanvas,
        //Define where on the canvas the image should be drawn:  
        //coordinates of the 4 corners of the quadrilateral that the original rectangular image will be transformed onto:
        topLeftX, topLeftY,
        bottomLeftX, bottomLeftY,
        topRightX, topRightY,
        bottomRightX, bottomRightY,
        //optionally flip the original image horizontally or vertically *before* transforming the original rectangular image to the custom quadrilateral:
        flipHorizontally,
        flipVertically
    ) {

    var srcWidth=srcImg.naturalWidth;
    var srcHeight=srcImg.naturalHeight;
	//console.log(Math.min(10, -10, 0));

    var targetMarginX=Math.min(topLeftX, bottomLeftX, topRightX, bottomRightX);
    var targetMarginY=Math.min(topLeftY, bottomLeftY, topRightY, bottomRightY);

    var targetTopWidth=(topRightX-topLeftX);
    var targetTopOffset=topLeftX-targetMarginX;
	console.log(targetTopOffset);
    var targetBottomWidth=(bottomRightX-bottomLeftX);
    var targetBottomOffset=bottomLeftX-targetMarginX;

    var targetLeftHeight=(bottomLeftY-topLeftY);
    var targetLeftOffset=topLeftY-targetMarginY;
    var targetRightHeight=(bottomRightY-topRightY);
    var targetRightOffset=topRightY-targetMarginY;

    var tmpWidth=Math.max(targetTopWidth+targetTopOffset, targetBottomWidth+targetBottomOffset);
    var tmpHeight=Math.max(targetLeftHeight+targetLeftOffset, targetRightHeight+targetRightOffset);

    var tmpCanvas=document.createElement('canvas');
    tmpCanvas.width=tmpWidth;
    tmpCanvas.height=tmpHeight;
    var tmpContext = tmpCanvas.getContext('2d');

    tmpContext.translate(
        flipHorizontally ? tmpWidth : 0,
        flipVertically ? tmpHeight : 0
    );
     tmpContext.scale(
        (flipHorizontally ? -1 : 1)*(tmpWidth/srcWidth),
        (flipVertically? -1 : 1)*(tmpHeight/srcHeight)
    );

    tmpContext.drawImage(srcImg, 0, 0);  

    var tmpMap=tmpContext.getImageData(0,0,tmpWidth,tmpHeight);
    var tmpImgData=tmpMap.data;

    var targetContext=targetCanvas.getContext('2d');
    var targetMap = targetContext.getImageData(targetMarginX,targetMarginY,tmpWidth,tmpHeight);
    var targetImgData = targetMap.data;

    var tmpX,tmpY,
        targetX,targetY,
        tmpPoint, targetPoint;

    for(var tmpY = 0; tmpY < tmpHeight; tmpY++) {
        for(var tmpX = 0;  tmpX < tmpWidth; tmpX++) {

            //Index in the context.getImageData(...).data array.
            //This array is a one-dimensional array which reserves 4 values for each pixel [red,green,blue,alpha) stores all points in a single dimension, pixel after pixel, row after row:
            tmpPoint=(tmpY*tmpWidth+tmpX)*4;

            //calculate the coordinates of the point on the skewed image.
            //
            //Take the X coordinate of the original point and translate it onto target (skewed) coordinate:
            //Calculate how big a % of srcWidth (unskewed x) tmpX is, then get the average this % of (skewed) targetTopWidth and targetBottomWidth, weighting the two using the point's Y coordinate, and taking the skewed offset into consideration (how far topLeft and bottomLeft of the transformation trapezium are from 0).   
            targetX=(
                       targetTopOffset
                       +targetTopWidth * tmpX/tmpWidth
                   )
                   * (1- tmpY/tmpHeight)
                   + (
                       targetBottomOffset
                       +targetBottomWidth * tmpX/tmpWidth
                   )
                   * (tmpY/tmpHeight)
            ;
            targetX=Math.round(targetX);

            //Take the Y coordinate of the original point and translate it onto target (skewed) coordinate:
            targetY=(
                       targetLeftOffset
                       +targetLeftHeight * tmpY/tmpHeight
                   )
                   * (1-tmpX/tmpWidth)
                   + (
                       targetRightOffset
                       +targetRightHeight * tmpY/tmpHeight
                   )
                   * (tmpX/tmpWidth)
            ;
            targetY=Math.round(targetY);

            targetPoint=(targetY*tmpWidth+targetX)*4;

            targetImgData[targetPoint]=tmpImgData[tmpPoint];  //red
            targetImgData[targetPoint+1]=tmpImgData[tmpPoint+1]; //green
            targetImgData[targetPoint+2]=tmpImgData[tmpPoint+2]; //blue
            targetImgData[targetPoint+3]=tmpImgData[tmpPoint+3]; //alpha
        }
    }

    targetContext.putImageData(targetMap,targetMarginX,targetMarginY);
}
