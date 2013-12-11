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
        var pseudosphere_triangles = models.pseudosphere;
        var pseudosphere_lines = models.pseudosphere2;


        //Dimension der in der Zeichnung benannten Teile
        var headSize = [0.25, 0.3, 0.25];
        var torsoSize = [0.4, 0.7, 0.3];
        var neckSize = [0.1, 0.08, 0.1];
        var diademSize = [0.18, 0.1, 0.18];
        var shoulderSize = [0.1, 0.1, 0.1];
        var upperarmSize = [0.1, 0.1, 0.2];
        var elbowSize = [0.1, 0.1, 0.1];
        var forearmSize = [0.1, 0.1, 0.125];
        var wristSize = [0.1, 0.05,0.1];

        // ########## SKELETONS ###########

        //skeleton torso
        this.torso = new SceneNode("torso");

        //skeleton neck
        this.neck = new SceneNode("neck");
        mat4.translate(this.neck.transform(), [0, (torsoSize[1]/2+neckSize[1]/2), 0]);
        //mat4.rotate(this.neck.transform(), 0.5*Math.PI, [0,0,1]); //COLORS!

        //skeleton head
        this.head = new SceneNode("head");
        mat4.translate(this.head.transform(), [0, (neckSize[1]/2+headSize[1]/2), 0]);      

        //skeleton diadem
        this.diadem = new SceneNode("diadem");
        mat4.translate(this.diadem.transform(), [0 , (headSize[1]/2 + diademSize[1]/2), 0]);
       // mat4.rotate(this.diadem.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!

        //skeleton shoulder right
        this.shoulder_right = new SceneNode("shoulder right");
        mat4.translate(this.shoulder_right.transform(), [torsoSize[0]/2 + shoulderSize[1]/2, torsoSize[1]/2.0 - shoulderSize[0]/2.0, 0]);

        //skeleton shoulder left
        this.shoulder_left = new SceneNode("shoulder left");
        mat4.translate(this.shoulder_left.transform(), [-torsoSize[0]/2 - shoulderSize[1]/2, torsoSize[1]/2.0 -shoulderSize[0]/2.0, 0]);

        //skeleton upper arm right
        this.upperarm_right = new SceneNode("upperarm right");
        mat4.translate(this.upperarm_right.transform(), [-upperarmSize[0]/2 - shoulderSize[1], -shoulderSize[0]/2, 0]);

        //skeleton upper arm left
        this.upperarm_left = new SceneNode("upperarm left");
        mat4.translate(this.upperarm_left.transform(), [-upperarmSize[0]/2 - shoulderSize[1], shoulderSize[0]/2, 0]);

        //skeleton elbow right
        this.elbow_right = new SceneNode("elbow right");
        mat4.translate(this.elbow_right.transform(), [0, 0,-upperarmSize[0]-elbowSize[0]/2]);

        //skeleton elbow left
        this.elbow_left = new SceneNode("elbow left");
        mat4.translate(this.elbow_left.transform(), [0, 0,-upperarmSize[0]-elbowSize[0]/2]);

        // skeleton forearm right
        this.forearm_right = new SceneNode("forearm right");
        mat4.translate(this.forearm_right.transform(), [0,0,-elbowSize[0]/2-forearmSize[0]/2]);

        // skeleton forearm left
        this.forearm_left = new SceneNode("forearm left");
        mat4.translate(this.forearm_left.transform(), [0,0,-elbowSize[0]/2-forearmSize[0]/2]);

        // skeleton wrist right
        this.wrist_right = new SceneNode("wrist right");
        mat4.translate(this.wrist_right.transform(), [0,0,-forearmSize[1]]);

        // skeleton wrist left
        this.wrist_left = new SceneNode("wrist left");
        mat4.translate(this.wrist_left.transform(), [0,0,-forearmSize[1]]);


        // ########### node-structure ###############
        this.torso.add(this.neck);
        this.neck.add(this.head);
        this.head.add(this.diadem);

        this.torso.add(this.shoulder_right);
        this.torso.add(this.shoulder_left);

        this.shoulder_right.add(this.upperarm_right);
        this.shoulder_left.add(this.upperarm_left);

        this.upperarm_right.add(this.elbow_right);
        this.upperarm_left.add(this.elbow_left);

        this.elbow_right.add(this.forearm_right);
        this.elbow_left.add(this.forearm_left);

        this.forearm_right.add(this.wrist_right);
        this.forearm_left.add(this.wrist_left);

        // ########## SKINS ###########
        //skin torso
        var torsoSkin = new SceneNode("torso skin");
        torsoSkin.add(cube, programs.vertexColor);
        mat4.scale(torsoSkin.transform(), torsoSize);

        //skin neck
        var neckSkin = new SceneNode("neck skin");
        neckSkin.add(band_triangles, programs.pink);
        mat4.scale(neckSkin.transform(), neckSize);
        mat4.rotate(neckSkin.transform(), 0.6*Math.PI, [0,1,0]); 

        //skin head
        var headSkin = new SceneNode("head skin");
        headSkin.add(cube, programs.vertexColor);
        mat4.scale(headSkin.transform(), headSize);
       // mat4.rotate(headSkin.transform(), 0.6*Math.PI, [0,1,0]); 

        //skin diadem solid surface
        var diademSkin = new SceneNode("diadem skin");
        //diademSkin.add(cube, programs.vertexColor);
        diademSkin.add(band_triangles, programs.gold);
        mat4.scale(diademSkin.transform(), diademSize);
       // mat4.rotate(diademSkin.transform(), 0.6*Math.PI, [0,1,0]); //COLORS!


        //skin diadem wireframe
        var diademWire = new SceneNode("diadem wire");
        diademWire.add(band_lines, programs.uni);
        mat4.scale(diademWire.transform(), diademSize);
 
        // skin shoulders solid surface
        var shoulderSkin = new SceneNode("shoulder skin solid");
        shoulderSkin.add(band_triangles, programs.grey);

        // skin shoulders wireframe
        var shoulderSkinWire = new SceneNode("shoulder skin wire");
        shoulderSkinWire.add(band_lines, programs.uni);
        mat4.rotate(this.shoulder_right.transform(), 0.5*Math.PI, [0,0,1]);
        mat4.rotate(this.shoulder_left.transform(), 0.5*Math.PI, [0,0,1]);
        mat4.scale(shoulderSkin.transform(), shoulderSize);
        mat4.scale(shoulderSkinWire.transform(), shoulderSize);

        // skin upperarms solid surface
        var upperArmSkin = new SceneNode("upperarm skin solid");
        upperArmSkin.add(models.ellipsoid, programs.uni);

        // skin upperarms wireframe
        var upperArmSkinWire = new SceneNode("upperarm skin wire");
        upperArmSkinWire.add(models.ellipsoid2, programs.pink);

        mat4.rotate(this.upperarm_right.transform(), 0.5*Math.PI, [0,1,0]);
        mat4.rotate(this.upperarm_left.transform(), 0.5*Math.PI, [0,1,0]);
        mat4.scale(upperArmSkin.transform(), upperarmSize);
        mat4.scale(upperArmSkinWire.transform(), upperarmSize);

        // skin elbow solid surface
        var elbowSkin = new SceneNode("elbow skin solid");
        elbowSkin.add(band_triangles, programs.grey);

        // skin elbow wireframe
        var elbowSkinWire = new SceneNode("shoulder skin wire");
        elbowSkinWire.add(band_lines, programs.uni);
        mat4.scale(elbowSkin.transform(), elbowSize);
        mat4.scale(elbowSkinWire.transform(), elbowSize);

        // skin forearm solid
        var forearmSkin = new SceneNode("forearm skin solid");
        forearmSkin.add(models.ellipsoid, programs.uni);

        // skin forearm wireframe
        var forearmSkinWire = new SceneNode("shoulder skin wire");
        forearmSkinWire.add(models.ellipsoid2, programs.gold);
        mat4.scale(forearmSkin.transform(), forearmSize);
        mat4.scale(forearmSkinWire.transform(), forearmSize);

        // skin wrist solid
        var wristSkin = new SceneNode("wrist skin solid");
        wristSkin.add(band_triangles, programs.grey);

        // skin wrist wireframe
        var wristSkinWire = new SceneNode("wrist skin wire");
        wristSkinWire.add(band_lines, programs.pink);
        mat4.scale(wristSkin.transform(), wristSize);
        mat4.scale(wristSkinWire.transform(), wristSize);
        mat4.rotate(this.wrist_right.transform(), 0.5*Math.PI, [1,0,0]);
        mat4.rotate(this.wrist_left.transform(), 0.5*Math.PI, [1,0,0]);


        // ############ CONNECTION skeleton + body #############

        this.torso.add(torsoSkin);
        this.head.add(headSkin);
        this.neck.add(neckSkin);
        this.diadem.add(diademSkin);
        this.diadem.add(diademWire);

        this.shoulder_right.add(shoulderSkin);
        this.shoulder_left.add(shoulderSkin);

        this.shoulder_right.add(shoulderSkinWire);
        this.shoulder_left.add(shoulderSkinWire);

        this.upperarm_right.add(upperArmSkin);
        this.upperarm_right.add(upperArmSkinWire);

        this.upperarm_left.add(upperArmSkin);
        this.upperarm_left.add(upperArmSkinWire);

        this.elbow_right.add(elbowSkin);
        this.elbow_right.add(elbowSkinWire);

        this.elbow_left.add(elbowSkin);
        this.elbow_left.add(elbowSkinWire);

        this.forearm_right.add(forearmSkin);
        this.forearm_right.add(forearmSkinWire);

        this.forearm_left.add(forearmSkin);
        this.forearm_left.add(forearmSkinWire);

        this.wrist_right.add(wristSkin);
        this.wrist_right.add(wristSkinWire);

        this.wrist_left.add(wristSkin);
        this.wrist_left.add(wristSkinWire);


    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program,transformation) {
        this.torso.draw(gl, program, transformation);
  
    };
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
