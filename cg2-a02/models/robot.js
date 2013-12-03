/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: Robot
 *
 * The Robot is a composing of transformed cubes and bands as joints
 * uses the modules: scene:nodes.js and gl-matrix.js 
 *
 */


/* requireJS module definition */
define(["vbo"], 
       (function(vbo) {
       
    "use strict";
    
    /* constructor for Robot objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         
     */ 
    var Robot = function(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius       = config.radius   || 1.0;
        var height       = config.height   || 0.1;
        var segments     = config.segments || 20;
        this.drawStyle   = config.drawStyle || "points";
        
        window.console.log("Creating a Robot with radius="+radius+", height="+height+", segments="+segments ); 
    


    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program) {
    
        // bind the attribute buffers
        //program.use();
        //this.coordsBuffer.bind(gl, program, "vertexPosition");
        //this.triangleBuffer.bind(gl);

        // draw the vertices as triangles
        //gl.drawElements(gl.TRIANGLES, this.triangleBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
         
    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
