window.onload = function(){

    // canvas
    var glCanvas = document.getElementById("glCanvas");
    glCanvas.width = window.innerWidth;
    glCanvas.height = window.innerHeight;
    var glContext = glCanvas.getContext("webgl");

    // defining the max Width and height to be changed later when window resizes  
    var maxWidth = window.innerWidth;
    var maxHeight = window.innerHeight; 

    if(!glContext){
        this.console.log("this context didn't work.");
    }

    glContext.clearColor(0, 0, 0, 0.5);
    glContext.clear(glContext.COLOR_BUFFER_BIT || glContext.DEPTH_BUFFER_BIT || glContext.STENCIL_BUFFER_BIT);

    // shaders source imported from js
    vertextSource = document.getElementById("VertexShader").text;
    fragmentSource = document.getElementById("FragmentShader").text;

    vertexShader = glContext.createShader(glContext.VERTEX_SHADER);
    fragmentShader = glContext.createShader(glContext.FRAGMENT_SHADER);

    glContext.shaderSource(vertexShader, vertextSource );    
    glContext.shaderSource(fragmentShader, fragmentSource);

    glContext.compileShader(vertexShader);
    glContext.compileShader(fragmentShader);

    if(!glContext.getShaderParameter(vertexShader, glContext.COMPILE_STATUS) ){
        console.error("there was a problem with the creation and sourcing of shaders.", glContext.getShaderInfoLog(vertexShader));
    }

    if(!glContext.getShaderParameter(fragmentShader, glContext.COMPILE_STATUS) ){
        console.error("There is a problem with the fragment shader", glContext.getShaderInfoLog(fragmentShader));
    }

    var glProgram = glContext.createProgram();
    glContext.attachShader(glProgram, vertexShader);
    glContext.attachShader(glProgram, fragmentShader);
    glContext.linkProgram(glProgram);
    
    if(!glContext.getProgramParameter(glProgram, glContext.LINK_STATUS) ){
        console.error("program linking failed");
    }

    // we need to know the width and height of the frame window. 
    // we will use the min-max normalization and half that to get the result 
    // to match the canvas coordinates.

    var rectWidth = 100; // in pixels
    var differenceWidth = window.innerWidth - maxWidth;
    var normalizedWidth =  (Math.abs(((rectWidth - differenceWidth) )/(window.innerWidth)  ) )/2 ;
    var numberOfRects = 10;
    var drawArray = drawRect(normalizedWidth, maxWidth, numberOfRects, window);

    // creating buffer data to store color and vertices information.
    var glBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, glBuffer); // the array buffer containes vertex attributes information.
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(drawArray) , glContext.STATIC_DRAW);
    var verAttributeLocationIndex = glContext.getAttribLocation(glProgram, 'a_position');

    glContext.vertexAttribPointer(
         verAttributeLocationIndex,
         2,  // number of elemnts in the array to use for each vertex
         glContext.FLOAT,  // type of each element in the array
         glContext.FALSE,  // should the integer data values should be normalized into a certain range when being cast to a float. 
         0, // size of the compenets to use in the array (must be in byte)
         0); // offset from the begining of the buffer.

    glContext.enableVertexAttribArray(verAttributeLocationIndex);

    // let the gl context use the program to be able to draw the shapes. 
    glContext.useProgram(glProgram);
    glContext.drawArrays(glContext.TRIANGLES, 0, 6 * 2); 

    window.addEventListener("resize", redrawAfterResize);

    // an event function to change the drawing object after resizing the window.
    function redrawAfterResize(numOfRects){
        glCanvas.numOfRects = (typeof numOfRects == 'number')? numOfRects : glCanvas.numOfRects;
        // updating the canvas
        glCanvas.width = window.innerWidth;
        glCanvas.height = window.innerHeight;
        glContext.viewport(0, 0, glCanvas.width, glCanvas.height);

        //var differenceWidth = window.innerWidth - maxWidth;
        //var normalizedWidth =  (Math.abs(((rectWidth - differenceWidth) )/(window.innerWidth)  ) )/2 ;
       
        // var maxWidth = window.innerWidth;
        //var normalizedWidth = Math.abs((rectWidth - window.innerWidth) / (window.innerWidth - 0));
        // var normalizedWidth = rectWidth / window.innerWidth;

        // updating maxWidth 
        // maxWidth = (window.innerWidth/window.innerHeight) * maxWidth; // BAD

        glContext.clearColor(0, 0, 0, 0.5);
        glContext.clear(glContext.COLOR_BUFFER_BIT || glContext.DEPTH_BUFFER_BIT || glContext.STENCIL_BUFFER_BIT);
        // the two lines of code above this comment will erase the shapes.

        // uncommnet to have a dynamic resizing
        // var rectWidth = 100;
        // var differenceWidth = window.innerWidth - maxWidth;
        // var differenceHeight = window.innerHeight - maxHeight;

        // this line of code changes the width of the rectangle after resizig the window.
        // var normalizedWidth =  (Math.abs(((rectWidth) + differenceWidth )/(window.innerWidth) ) )/2 ;

        var drawArray = drawRect(normalizedWidth, maxWidth, glCanvas.numOfRects, window);
        // var drawArray = drawRect(normalizedWidth, window.innerWidth, glCanvas.numOfRects, window); // BAD
    
        var glBuffer = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, glBuffer);
        glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(drawArray) , glContext.STATIC_DRAW);
        var verAttributeLocationIndex = glContext.getAttribLocation(glProgram, 'a_position');
    
        glContext.vertexAttribPointer(
             verAttributeLocationIndex,
             2,
             glContext.FLOAT, 
             glContext.FALSE, 
             0,
             0);

             glContext.enableVertexAttribArray(verAttributeLocationIndex);
             glContext.useProgram(glProgram);
             glContext.drawArrays(glContext.TRIANGLES, 0, 6 * glCanvas.numOfRects); 
    }
    window.drawNumRects = redrawAfterResize;

}

// test the new code that has normalization with 50px of width.
function drawRect(width,  maxWidth, numberOfObjects, window){
    // var rectWidth = width / numberOfObjects;
    var gap = 100;
    gap = gap / maxWidth;
    var rectWidth = width; // right one!
    // var rectWidth = width/maxWidth; 

    // var normalizedHeight =  (Math.abs(((rectHeight) )/(window.innerWidth) -1 ) )/2;
    // var normalizedWidth =  (Math.abs(((rectWidth) )/(window.innerWidth) -1 ) )/2 ;

    // var rectWidth = normalizedWidth;
    // console.log("normalized width", rectWidth);
    // console.log("normalized height", normalizedHeight);

    var x1 = -0.95;  // ORIGINAL (left to right)
    // var x1 = 0.95; // (right to left)
    // var x1 = 0.0 - numberOfObjects * rectWidth ; // center
    // var x1 = 0.0 ; // center
    var y1 = 0.0;
    var rectDrawArray = [];

    // get the number of max rows we need to use to draw to make line space for
    // the rectangles.
    var numberOfCols = maxNumRectangles(rectWidth, maxWidth, window);
    var numberOfRows = (numberOfObjects/numberOfCols);
    var RectHeight = maxRectHeight(numberOfRows); 

    for(j = 0; j < numberOfRows; j++){

        //  CENTER JUSTIFIED
        // if( (numberOfObjects / (j+1)) < numberOfCols){
        //     x1 = 0.0 - (numberOfObjects  / (j+1)) * rectWidth ; // center
        // }
        // else {
        //     x1 = -0.99; // CENTER
        // }

        for(i = 0; i < numberOfCols ; i++){
            // making the other corners based on the original corners.

            var x2 = x1 + rectWidth; // ORIGINAL (left to right)
            // var x2 = x1 - rectWidth; // (right to left)

            // CENTER
            // if(i % 2 == 1){
                // var x2 = x1 + rectWidth; // ORIGINAL (left to right)
            // }
            // else{
                // var x2 = x1 - rectWidth; // (right to left)
            // }
            var y2 = y1 + RectHeight;

            // creating the four corners below
            // first half of the rectangle (triangle 1)
            rectDrawArray.push(x1);
            rectDrawArray.push(y1);

            rectDrawArray.push(x2);
            rectDrawArray.push(y1);

            rectDrawArray.push(x1);
            rectDrawArray.push(y2);

            // second half of the rectangle (triangle 2)
            rectDrawArray.push(x2);
            rectDrawArray.push(y1);

            rectDrawArray.push(x1);
            rectDrawArray.push(y2);

            rectDrawArray.push(x2);
            rectDrawArray.push(y2);

            // making a gap for the next rectangle.
            x1 += rectWidth + gap; // use 0.04 as a gap value for now. (left to right JUSTIFIED)
            // x1 -= rectWidth + 0.04;  // (right to left JUSTIFIED)

            // CENTER
            // if(i % 2 == 1){
            //   x1 += rectWidth + 0.04; // use 0.04 as a gap value for now. (left to right)           
            // }
            // else{
            //   x1 -= rectWidth + 0.04;  // (right to left)
            // }
    
        }
    
    // updating y1 while resetting x1
    y1 -= RectHeight + 0.01;
    x1 = -0.95; // ORIGINAL (left to right)
    // x1 = 0.95; // (right to left)
    // x1 = 0.0; // CENTER

}

// rectDrawArray = shiftLeft(rectDrawArray, totalWidth/2);  // we are using rectWidth we need to shift the glyphs each time we add a glyph, and so we need to shift all the rectangles (glyphs) by half of rectWidth value. 
return rectDrawArray;
}

// a normalization function to turn the screen pixel size to the canvas
// size of -1 to 1. 
function minMaxNormalization(maxValue, minValue, currentValue){
    return ( ((currentValue - minValue) * 2)/(maxValue - minValue) -1 );
}

// a function that determines the maximum number of rectangles that can 
// fill the current canvas with its width. 
function maxNumRectangles(rectWidth, maxWidth, window){
    var gap = 100;
    gap = gap / maxWidth;
    // maximumWidth = parseFloat(window.innerWidth/ ( maxWidth - 100) ); // max value in a canvas is 1
    maximumWidth = parseFloat(window.innerWidth/ (maxWidth-100) ); //works
    
    // console.log("maximum width is: ", maximumWidth);
    var maxNumber = 0;

    var sum = -(maximumWidth); // lowest value in a canvas is -maximum width 
    //    var sum = -1
        while(sum < maximumWidth){
            maxNumber +=1;
            ///////////////////////
            // 2Do: change this value 
            sum = -(maximumWidth)
            // var sum = -1
            sum += maxNumber * rectWidth + maxNumber * gap ;
        }
    // console.log("max width is: ", maxWidth);
    // console.log("Sum is: ", sum);
    maxNumber -= 1;
    // console.log("the max number of rects to be drawn: ", maxNumber);
    return maxNumber;
}


function maxRectHeight(maxNumberOfRows){
    var gap = 0.1;
    var maxHeight = 1;
    // uncomment here to change the height of the rectangle based on the window resizing. 
    //return ( (maxHeight/maxNumberOfRows) - gap );
    return 0.4;
}