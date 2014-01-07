/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 * d
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Parametric Surface objects
     * gl:  WebGL context object
     * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
     * config: configuration object defining attributes uMin, uMax, vMin, vMax, 
     *         and drawStyle (i.e. "points", "wireframe", or "surface")
     */ 
    var ParametricSurface = function(gl, posFunc, config) {
            
        //window.console.log("ParametricSurface() constructor not implemented yet.")
        //Werte analog zur Scene.js
        var umin = config.uMin || -Math.PI;
        var umax = config.uMax ||  Math.PI;
        var vmin = config.vMin || -Math.PI;
        var vmax = config.vMax ||  Math.PI;
        var usegments = config.uSegments || 20;
        var vsegments = config.vSegments || 10;
        this.drawStyle   = config.drawStyle || "points";
        this.posFunc = posFunc;

        console.log("Creating a ParametricSurface with umin="+umin+", umax="+umax+", vmin="+vmin+", vmax="+vmax ); 
        // vertex coordinates
        var coords = [];

        var umin_temp = 0;
        var vmin_temp = 0;

        // generate vertex coordinates and store in an array
        for (var i=0; i <= usegments; i++) { 
            umin_temp += (umax - umin) / usegments; // calculates the position of u
            vmin_temp = vmin;   //nach ersten Durchgang wieder zurücksetzen, um nicht über das Array hinaus zu laufen
            for (var j = 0; j <= vsegments; j++) {
                vmin_temp += (vmax - vmin) / vsegments; // calculates the position of v
                // calculate the coords depending on the function
                var x = this.posFunc(umin_temp, vmin_temp)[0]; 
                var y = this.posFunc(umin_temp, vmin_temp)[1];
                var z = this.posFunc(umin_temp, vmin_temp)[2];
                coords.push(x,y,z);

            };
        };


        // parametric surface out of triangles (solid surface)
        var triangles = []; // store the indices of the vertices 

        // three vertices produce one triangle
        for (var u = 0; u < usegments; u++) {
            for (var v = 0; v < vsegments; v++) {

                // calculates the vertex to start the triangle with
                var idx = u * (vsegments +1) + v;
                // first triangle
                triangles.push(idx);
                triangles.push(idx+1);
                triangles.push(idx+vsegments+1);
                //second triangle
                triangles.push(idx+1);
                triangles.push(idx+vsegments+1);
                triangles.push(idx+vsegments+2);
          
            };
        };
        
        // parametric surface out of lines
        var lines = [];

        for (var u_lines = 0; u_lines < usegments; u_lines++) {

            var idx;

            for (var v_lines = 0; v_lines < vsegments; v_lines++) {

                idx = u_lines * (vsegments +1) + v_lines;
                lines.push(idx);
                lines.push(idx+1);

                lines.push(idx);
                lines.push(idx+vsegments+1);

                // connect the last vertex from the current row with the last point of the next row
                if (u_lines + 1 == usegments) {
                    lines.push(idx + vsegments + 1);
                    lines.push(idx + vsegments + 2);
                   }
                }
            // last column!
            lines.push(idx+1);
            lines.push(idx+vsegments+2);

        };
        // create buffer
        this.triangleBuffer = new vbo.Indices(gl, { "indices": triangles } );
        
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );
        //create buffer
        this.lineBuffer = new vbo.Indices(gl, { "indices": lines } );
       
    };  
//############################################################################
//Hier muss das Material übergeben werden....
//############################################################################
    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl,program) {

        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");

        // bind the correct buffer
        if (this.drawStyle == "triangles") {
            this.triangleBuffer.bind(gl);
        } else {
            this.lineBuffer.bind(gl);
        }


        // draw the vertices as points
        if (this.drawStyle == "points") {
            gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 

        // draw the vertices as triangles
        } else if (this.drawStyle == "triangles") {
             gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
       
        // draw the vertices as lines
        } else if (this.drawStyle == "lines") {
             gl.drawElements(gl.LINES, this.lineBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);

        } else {
            window.console.log("Band: draw style " + this.drawStyle + " not implemented.");
        }
         
        
    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;

})); // define

    
