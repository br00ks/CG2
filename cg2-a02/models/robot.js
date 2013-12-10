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
define(["vbo", "models/cube","models/band", "scene_node", "gl-matrix"], 
       (function(vbo, Cube, Band, SceneNode, glmatrix ) {
       
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
        var band = new Band(gl, {height: 0.2, drawStyle: "triangles"});

        //Dimension der in der Zeichnung benannten Teile
        var headSize = [0.25, 0.3, 0.25];
        var torsoSize = [0.6, 0.9, 0.4];
        var neckSize = [0.2, 0.05, 0.2];
        var diademSize = [0.1, 0.2, 0.1];

        //Skelett fuer Torso und Kopf
        this.head = new SceneNode("head");
        mat4.translate(this.head.transform(), [0, (neckSize[1]/2+headSize[1]/2), 0]);
        this.torso = new SceneNode("torso");

        this.neck = new SceneNode("neck");
        mat4.translate(this.neck.transform(), [0, (torsoSize[1]/2+neckSize[1]/2), 0]);
        mat4.rotate(this.neck.transform(), 0.5*Math.PI, [0,0,1]); //COLORS!

        this.diadem = new SceneNode("diadem");
        mat4.translate(this.diadem.transform(), [0 , (headSize[1]/2 + diademSize[1]/2), 0]);
       // mat4.rotate(this.diadem.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!
        
        this.torso.add(this.neck);
        this.neck.add(this.head);
        this.head.add(this.diadem);

        //Skins
        var torsoSkin = new SceneNode("torso skin");
        torsoSkin.add(cube, programs.vertexColor);
        mat4.scale(torsoSkin.transform(), torsoSize);

        var neckSkin = new SceneNode("neck skin");
        neckSkin.add(cube, programs.vertexColor);
        mat4.scale(neckSkin.transform(), neckSize);
        mat4.rotate(neckSkin.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!

        var headSkin = new SceneNode("head skin");
        headSkin.add(cube,programs.vertexColor);
        mat4.scale(headSkin.transform(), headSize);
        mat4.rotate(headSkin.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!


        var diademSkin = new SceneNode("diadem skin");
        diademSkin.add(cube, programs.vertexColor);
        mat4.scale(diademSkin.transform(), diademSize);
       // mat4.rotate(diademSkin.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!


        //Verbindung Skelett + Haut
        this.torso.add(torsoSkin);
        this.head.add(headSkin);
        this.neck.add(neckSkin);
        this.diadem.add(diademSkin);

    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program,transformation) {
        this.torso.draw(gl, program, transformation);
  
    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
