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
define(["vbo", "models/cube", "scene_node", "gl-matrix"], 
       (function(vbo, Cube, SceneNode, glmatrix) {
       
    "use strict";
    
    /* constructor for Robot objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         
     */ 
    var Robot = function(gl, programs, config) {
    
        window.console.log("Creating a Robot"); 
        
        //Komponente zum Bau des Roboters
        var cube = new Cube(gl);

        //Dimension der in der Zeichnung benannten Teile
        var headSize = [0.3, 0.35, 0.3];
        var torsoSize = [0.6, 1.0, 0.4];

        //Skelett fuer Torso und Kopf
        this.head = new SceneNode("head");
        mat4.translate(this.head.transform(), [0, (torsoSize[1]/2+headSize[1]/2), 0]);
        this.torso = new SceneNode("torso");
        this.torso.add(this.head);

        //Skins
        var torsoSkin = new SceneNode("torso skin");
        torsoSkin.add(cube, programs.vertexColor);
        mat4.scale(torsoSkin.transform(), torsoSize);

        var headSkin = new SceneNode("head skin");
        headSkin.add(cube, programs.vertexColor);
        mat4.rotate(headSkin.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!
        mat4.scale(headSkin.transform(), headSize);

        //Verbindung Skelett + Haut
        this.torso.add(torsoSkin);
        this.head.add(headSkin);


    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program,transformation) {
        this.torso.draw(gl, program, transformation);
  
    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
