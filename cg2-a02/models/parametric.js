/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 *
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
        var umin = config.uMin || -Math.PI;
        var umax = config.uMax ||  Math.PI;
        var vmin = config.vMin || -Math.PI;
        var vmax = config.vMax ||  Math.PI;
        var usegments = config.uSegments || 40;
        var vsegments = config.vSegments || 20;
        this.posFunc = posFunc;

        console.log("Creating a ParametricSurface with umin="+umin+", umax="+umax+", vmin="+vmin+", vmax="+vmax ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];

        var umin_temp = 0;
        var vmin_temp = 0;

        for (var i=0; i <= usegments; i++) { // hier evtl usegments & vsegments noch vertauschen???
            umin_temp += (umax - umin) / usegments;
            vmin_temp = vmin;
            for (var j=0; j <= vsegments; j++) {

                vmin_temp += (vmax - vmin) / vsegments;
                // X and Z coordinates are on a circle around the origin
                var x = this.posFunc(umin_temp, vmin_temp)[0];
                var y = this.posFunc(umin_temp, vmin_temp)[1];
                var z = this.posFunc(umin_temp, vmin_temp)[2];
                coords.push(x,y,z);

            };


        };

        this.coordsBuffer = new vbo.Attribute(gl, { "numComponents": 3,
                                                    "dataType": gl.FLOAT,
                                                    "data": coords 
                                                  } );

       
    };  

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl,program) {

        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, "vertexPosition");
 
        // draw the vertices as points
        gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
       
        
    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;

})); // define

    
