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
        var usegments = config.uSegments || 150;
        var vsegments = config.vSegments || 75;
        this.drawStyle   = config.drawStyle || "points";
        this.posFunc = posFunc;

        console.log("Creating a ParametricSurface with umin="+umin+", umax="+umax+", vmin="+vmin+", vmax="+vmax ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];

        var umin_temp = 0;
        var vmin_temp = 0;

        //2 for-Schleifen wegen beiden u,v
        for (var i=0; i <= usegments; i++) { // hier evtl usegments & vsegments noch vertauschen??? 
            umin_temp += (umax - umin) / usegments;
            vmin_temp = vmin;   //nach ersten Durchgang wieder zurücksetzen, um nicht über das Array hinaus zu laufen
            for (var j=0; j <= vsegments; j++) {
                vmin_temp += (vmax - vmin) / vsegments;
                //COMMENT!!!
                var x = this.posFunc(umin_temp, vmin_temp)[0]; //an der Stelle 0 der posFunc in der Scene.js: 0.5 * Math.sin(u) * Math.cos(v), usw.
                var y = this.posFunc(umin_temp, vmin_temp)[1];
                var z = this.posFunc(umin_temp, vmin_temp)[2];
                coords.push(x,y,z);

            };


        };

        // parametric surface out of triangles
        var triangles = [];
        for (var u = 0; u < usegments; u++) {

            for (var v = 0; v < vsegments; v++) {

                var idx = u * (vsegments +1) + v;

                triangles.push(idx);
                triangles.push(idx+1);
                triangles.push(idx+vsegments+1);
                triangles.push(idx+1);
                triangles.push(idx+vsegments+1);
                triangles.push(idx+vsegments+2);
          
            };
        };
        
        var lines = [];

        for (var u_lines = 0; u_lines < usegments; u_lines++) {

            for (var v_lines = 0; v_lines < vsegments; v_lines++) {

                var idx = u_lines * (vsegments +1) + v_lines;
                lines.push(idx);
                lines.push(idx+1);

                lines.push(idx);
                lines.push(idx+vsegments+1);

                lines.push(idx+1);
                lines.push(idx+vsegments+2);

            };

        };

        this.triangleBuffer = new vbo.Indices(gl, { "indices": triangles } );
        

        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );

        this.lineBuffer = new vbo.Indices(gl, { "indices": lines } );
       
    };  

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl,program) {

        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");

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
    return ParametricSurface;

})); // define

    
