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
        //var paraboloid_triangles = new ParametricSurface(gl, ???????,  {height: 1.0, drawStyle: "triangles"} );
        var paraboloid_triangles = new Band(gl, {height: 1.0, drawStyle: "triangles"} );//HIER FEHLT NOCH DIE PARABOLOID-OBERFLÄCHE

        //Dimension der in der Zeichnung benannten Teile
        
        var headSize = [0.25, 0.3, 0.25];
        var torsoSize = [0.35, 0.5, 0.2];
        var neckSize = [0.1, 0.08, 0.1];
        var diademSize = [0.18, 0.1, 0.18];
        var shoulderSize = [0.1, 0.1, 0.1];
        var upperarmSize = [0.1, 0.1, 0.2];
        var elbowSize = [0.1, 0.1, 0.1];
        var forearmSize = [0.1, 0.1, 0.125];
        var wristSize = [0.1, 0.05,0.1];
        var pelvicSize = [0.3, 0.06, 0.2];
        var legSize = [0.1,0.1,0.3];
        var hipjointSize = [0.3, 0.06, 0.2];
        var kneejointSize = [0.12, 0.12, 0.12];
        var handSize = [0.3, 0.06, 0.2];

        // ########## SKELETONS ###########

        //skeleton torso
        this.torso = new SceneNode("torso");
        mat4.translate(this.torso.transform(), [0,torsoSize[1]/2 + pelvicSize[1]/2,0]);

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

        // skeleton hand right
        this.hand_right = new SceneNode("hand right");
        mat4.translate(this.hand_right.transform(), [0,0,-forearmSize[1]]);

        // skeleton wrist left
        this.wrist_left = new SceneNode("wrist left");
        mat4.translate(this.wrist_left.transform(), [0,0,-forearmSize[1]]);

        //skeleton pelvic bone = beckenknochen
        this.pelvic = new SceneNode("pelvic");
        mat4.translate(this.pelvic.transform(), [0,+hipjointSize[1]/2 + pelvicSize[1]/2,0]);


        //skeleton hipjoint
        this.hipjoint = new SceneNode("hipjoint");
        mat4.translate(this.hipjoint.transform(), [0,-4*hipjointSize[1], 0]);

        //skeleton leg right
        this.leg_right = new SceneNode("leg right");
        mat4.translate(this.leg_right.transform(), [legSize[1],-legSize[2]/2 - hipjointSize[1]/2,0]);

        //skeleton kneejoint_right
        this.kneejoint_right = new SceneNode("knee joint right");
        mat4.translate(this.kneejoint_right.transform(), [0, kneejointSize[1]/2 - legSize[1]/2, legSize[0]]);

        //skeleton calf right = wade
        this.calf_right = new SceneNode("calf right");
        mat4.translate(this.calf_right.transform(), [0,legSize[0] - kneejointSize[1],kneejointSize[0]]);

        //skeleton leg left
        this.leg_left = new SceneNode("leg left");
        mat4.translate(this.leg_left.transform(), [-legSize[1] , -hipjointSize[1]/2- pelvicSize[0]/2, 0]);

        // ########### node-structure ###############
        this.hipjoint.add(this.pelvic);
         //this.pelvic.add(this.torso);
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

        this.wrist_right.add(this.hand_right);

        this.pelvic.add(this.torso);


        this.hipjoint.add(this.leg_right);  
        this.hipjoint.add(this.leg_left); 

        this.leg_right.add(this.kneejoint_right); 
        this.kneejoint_right.add(this.calf_right); 

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

        //skin diadem solid surface
        var diademSkin = new SceneNode("diadem skin");
        diademSkin.add(band_triangles, programs.gold);
        diademSkin.add(band_lines, programs.uni);
        mat4.scale(diademSkin.transform(), diademSize);
      
        // skin shoulders
        var shoulderSkin = new SceneNode("shoulder skin solid");
        shoulderSkin.add(band_triangles, programs.grey);
        shoulderSkin.add(band_lines, programs.uni);
        mat4.rotate(this.shoulder_right.transform(), 0.5*Math.PI, [0,0,1]);
        mat4.rotate(this.shoulder_left.transform(), 0.5*Math.PI, [0,0,1]);
        mat4.scale(shoulderSkin.transform(), shoulderSize);
     
        // skin upperarms 
        var upperArmSkin = new SceneNode("upperarm skin solid");
        upperArmSkin.add(models.ellipsoid, programs.uni);
        upperArmSkin.add(models.ellipsoid2, programs.pink);
        mat4.rotate(this.upperarm_right.transform(), 0.5*Math.PI, [0,1,0]);
        mat4.rotate(this.upperarm_left.transform(), 0.5*Math.PI, [0,1,0]);
        mat4.scale(upperArmSkin.transform(), upperarmSize);

        // skin elbow
        var elbowSkin = new SceneNode("elbow skin solid");
        elbowSkin.add(band_triangles, programs.grey);
        elbowSkin.add(band_lines, programs.uni);
        mat4.scale(elbowSkin.transform(), elbowSize);
     
        // skin forearm
        var forearmSkin = new SceneNode("forearm skin solid");
        forearmSkin.add(models.ellipsoid, programs.uni);
        forearmSkin.add(models.ellipsoid2, programs.gold);
        mat4.scale(forearmSkin.transform(), forearmSize);

        // skin wrist
        var wristSkin = new SceneNode("wrist skin solid");
        wristSkin.add(band_triangles, programs.grey);
        wristSkin.add(band_lines, programs.pink);
        mat4.scale(wristSkin.transform(), wristSize);
        mat4.rotate(this.wrist_right.transform(), 0.5*Math.PI, [1,0,0]);
        mat4.rotate(this.wrist_left.transform(), 0.5*Math.PI, [1,0,0]);

        // skin hand
        var handSkin = new SceneNode("hand skin solid");
        handSkin.add(paraboloid_triangles, programs.uni);
        //handSkin.add(band_lines, programs.pink);
        mat4.scale(handSkin.transform(), handSize);
        mat4.rotate(this.hand_right.transform(), 0.5*Math.PI, [1,0,0]);

         //skin pelvic skin
        var pelvicSkin = new SceneNode("pelvic skin");
        pelvicSkin.add(band_triangles, programs.pink);
        pelvicSkin.add(band_lines, programs.uni);
        mat4.scale(pelvicSkin.transform(), pelvicSize);

        //skin hipjoint
        var hipjointSkin = new SceneNode("hipjoint skin");
        hipjointSkin.add(band_triangles, programs.gold);
        hipjointSkin.add(band_lines, programs.uni);
        mat4.scale(hipjointSkin.transform(), hipjointSize);


        //skin legs
        var legSkin = new SceneNode("leg skin");
        legSkin.add(cube, programs.vertexColor);
        legSkin.add(cube, programs.uni);
        mat4.scale(legSkin.transform(), legSize);
        mat4.rotate(this.leg_right.transform(), 0.5*Math.PI, [1,0,0]);
        mat4.rotate(this.leg_left.transform(), 0.5*Math.PI, [1,0,0]);

        mat4.rotate(this.calf_right.transform(), 0.5*Math.PI, [0,0,1]);


        //kneejoint right
        var kneejointSkin = new SceneNode("kneejoint skin");
        kneejointSkin.add(band_triangles, programs.grey);
        kneejointSkin.add(band_lines, programs.uni);
        mat4.scale(kneejointSkin.transform(), kneejointSize);
        mat4.rotate(this.kneejoint_right.transform(), 0.5*Math.PI, [0,0,1]);
        //mat4.rotate(this.lkneejoint_left.transform(), 0.5*Math.PI, [1,0,0]);



        // ############ CONNECTION skeleton + body #############
        this.torso.add(torsoSkin);
        this.head.add(headSkin);
        this.neck.add(neckSkin);
        this.diadem.add(diademSkin);

        this.shoulder_right.add(shoulderSkin);
        this.shoulder_left.add(shoulderSkin);

        this.upperarm_right.add(upperArmSkin);
        this.upperarm_left.add(upperArmSkin);

        this.elbow_right.add(elbowSkin);
        this.elbow_left.add(elbowSkin);

        this.forearm_right.add(forearmSkin);
        this.forearm_left.add(forearmSkin);

        this.wrist_right.add(wristSkin);
        this.wrist_left.add(wristSkin);

        this.hand_right.add(handSkin);

        this.pelvic.add(pelvicSkin);
        this.hipjoint.add(hipjointSkin);

        this.leg_right.add(legSkin);
        this.leg_left.add(legSkin);

        this.kneejoint_right.add(kneejointSkin);

        this.calf_right.add(legSkin);
    };

    // draw method: activate buffers and issue WebGL draw() method
    Robot.prototype.draw = function(gl,program,transformation) {
        this.hipjoint.draw(gl, program, transformation);
  
    };
   
        
    // this module only returns the Robot constructor function    
    return Robot;

})); // define

    
