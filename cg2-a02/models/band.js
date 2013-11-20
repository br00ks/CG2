/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    var Band = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.1;
        var segments     = config.segments || 20;
        this.drawStyle   = config.drawStyle || "points";
        
        window.console.log("Creating a Band with radius="+radius+", height="+height+", segments="+segments ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];
        for(var i=0; i<=segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i/segments)*Math.PI*2;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 = height/2;
            var y1 = -height/2;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x,y0,z);
            coords.push(x,y1,z);
            
        };
        // create list of indices 
        var triangles = [0,1,2,2,1,3];

        var k = 0;
        // we need to run through the segments
        // every 6 steps the value of k is calculated
        // we already have one segments given, therefore 
        // the step is repeated until m < segments -1 
        for (var m=0; m < segments-1; m++) {

            // [0,1,2,2,1,3] length = 6
            // the new 6 elements of the triangle-list depend
            // on the last 6 elements
            // the new element's value depends on the value of 
            // the element[-6] + 2
            for (var j=0; j < 6; j++) {
                var temp_index = k+j;
                var temp = triangles[temp_index]+2;
                triangles.push(temp);
            };
            k = k+6;

        };
        console.log(triangles);

        // create list of indices 
        var lines = [1,0,0,2,1,3];
        
        var r = 0;
        // we need to run through the segments
        // every 6 steps the value of r is calculated
        // we already have one segments given, therefore 
        // the step is repeated until s < segments -1 
        for (var s=0; s < segments-1; s++) {

            // [0,1,2,2,1,3] length = 6
            // the new 6 elements of the triangle-list depend
            // on the last 6 elements
            // the new element's value depends on the value of 
            // the element[-6] + 2
            for (var t=0; t < 6; t++) {
                var temp_index = r+t;
                var temp = lines[temp_index]+2;
                lines.push(temp);
            };
            r = r+6;

        };

        // create index buffer object (VBO) for the coordinates
        this.triangleBuffer = new vbo.Indices(gl, { "indices": triangles } );

        // create index buffer object (VBO) for the coordinates
        this.lineBuffer = new vbo.Indices(gl, { "indices": lines } );
               
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );

    };

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
        this.triangleBuffer.bind(gl);
        
        if (this.drawStyle == "triangles") {
            this.triangleBuffer.bind(gl);
        } else {
            this.lineBuffer.bind(gl);

        }

       

        // draw the vertices as points
        if (this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 

        } else if (this.drawStyle == "triangles") {
             gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
       
        } else if (this.drawStyle == "lines") {
             gl.drawElements(gl.LINES, this.lineBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);


        } else {
            window.console.log("Band: draw style " + this.drawStyle + " not implemented.");
        }
         
    };
        
    // this module only returns the Band constructor function    
    return Band;

})); // define

    
