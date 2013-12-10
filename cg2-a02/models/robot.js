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
define(["vbo", "models/cube","models/band", "models/triangle", "models/parametric", "scene_node", "gl-matrix"], 
       (function(vbo, Cube, Band, Triangle, ParametricSurface, SceneNode, glmatrix ) {
       
    "use strict";
    
    /* constructor for Robot objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         
     */ 
    var Robot = function(gl, programs, config, models) {
    
        // window.console.log("Creating a Robot"); 

        // ########### COMPONENTS ##########

        var cube = new Cube(gl);
        var band_triangles = new Band(gl, {height: 1.0, drawStyle: "triangles"} );
        var band_lines = new Band(gl, {height: 1.0, drawStyle: "lines"} );
        var triangle = new Triangle(gl);

        //Dimension der in der Zeichnung benannten Teile
        var headSize = [0.25, 0.3, 0.25];
        var torsoSize = [0.4, 1.0, 0.6];
        var neckSize = [0.1, 0.08, 0.1];
        var diademSize = [0.18, 0.04, 0.18];
        var shoulderSize = [0.5, 0.25, 0.5];

        // ########## SKELETONS ###########

        //skeleton torso
        this.torso = new SceneNode("torso");

        //skeleton neck
        this.neck = new SceneNode("neck");
        mat4.translate(this.neck.transform(), [0, (torsoSize[1]/2+neckSize[1]/2), 0]);

        //skeleton head
        this.head = new SceneNode("head");
        mat4.translate(this.head.transform(), [0, (neckSize[1]/2+headSize[1]/2), 0]);      

        //skeleton diadem
        this.diadem = new SceneNode("diadem");
        mat4.translate(this.diadem.transform(), [0 , ((headSize[1])/2 + diademSize[1]/2), 0]);
        
        //skeleton shoulder
        this.shoulder = new SceneNode("shoulder");
       // mat4.translate(this.shoulder.transform(), [torsoSize[0]/2 + shoulderSize[1]/2, torsoSize[1]/2.0 - shoulderSize[0]/2.0, 0]);

        this.torso.add(this.neck);
        this.neck.add(this.head);
        this.head.add(this.diadem);

        this.torso.add(this.shoulder);

        // ########## SKINS ###########
        //skin torso
        var torsoSkin = new SceneNode("torso skin");
        torsoSkin.add(cube, programs.vertexColor);
        mat4.scale(torsoSkin.transform(), torsoSize);
        mat4.scale(torsoSkin.transform(), [1.0,0.5,1.0]);

        //skin neck
        var neckSkin = new SceneNode("neck skin");
        neckSkin.add(band_triangles, programs.pink);
        mat4.rotate(this.neck.transform(), 0.6*Math.PI, [0,1,0]); 

        mat4.scale(neckSkin.transform(), neckSize);
        mat4.rotate(neckSkin.transform(), 0.6*Math.PI, [0,1,0]); 

        //skin head
        var headSkin = new SceneNode("head skin");
        headSkin.add(cube, programs.vertexColor);
        mat4.scale(headSkin.transform(), headSize);
        mat4.rotate(headSkin.transform(), 0.6*Math.PI, [0,1,0]); 

        //skin diadem surface
        var diademSkin = new SceneNode("diadem skin");
        diademSkin.add(band_triangles, programs.gold);
        mat4.scale(diademSkin.transform(), diademSize);

        //skin diadem wireframe
        var diademWire = new SceneNode("diadem wire");
        diademWire.add(band_lines, programs.uni);
        mat4.scale(diademWire.transform(), diademSize);

        //skin shoulder
        var shoulderSkin = new SceneNode("shoulder skin");
        shoulderSkin.add(band_triangles, programs.uni);
        //mat4.rotate(this.shoulder.transform(), 0.5*Math.PI, [0,0,1]);
        mat4.scale(shoulderSkin.transform(), torsoSize);


        // ############ CONNECTION skeleton + body #############

        this.torso.add(torsoSkin);
        this.head.add(headSkin);
        this.neck.add(neckSkin);
        this.diadem.add(diademSkin);
        this.diadem.add(diademWire);

        this.shoulder.add(shoulderSkin);

    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program,transformation) {
        this.torso.draw(gl, program, transformation);
  
    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
