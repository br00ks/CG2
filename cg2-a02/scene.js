/*
  *
 * Module scene: Computergrafik 2, Aufgabe 2
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * ddsz
 */



/* requireJS module definition */
define(["gl-matrix", "program", "shaders", "models/band", "models/triangle", "models/cube",
        "models/parametric", "models/robot"], 
       (function(glmatrix, Program, shaders, Band, Triangle, Cube, ParametricSurface, Robot) {

    "use strict";
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    var Scene = function(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {};
        this.programs.red = new Program(gl, 
                                        shaders.getVertexShader("red"), 
                                        shaders.getFragmentShader("red") );
        this.programs.vertexColor = new Program(gl, 
                                                shaders.getVertexShader("vertex_color"), 
                                                shaders.getFragmentShader("vertex_color") );   
        //unicolor für Wireframe-objekt für Band.js 
        this.programs.uni = new Program(gl, 
                                        shaders.getVertexShader("unicolor"), 
                                        shaders.getFragmentShader("unicolor") );


        
        // create some objects to be drawn in this scene
        this.triangle  = new Triangle(gl);
        this.cube      = new Cube(gl); 
        this.band1      = new Band(gl, {height: 0.4, drawStyle: "points"});
        this.band2      = new Band(gl, {height: 0.4, drawStyle: "triangles"});
        this.band3      = new Band(gl, {height: 0.4, drawStyle: "lines"});



        // create a parametric surface to be drawn in this scene
        var positionFunc = function(u,v) {
            return [ 0.5 * Math.sin(u) * Math.cos(v),
                     0.3 * Math.sin(u) * Math.sin(v),
                     0.9 * Math.cos(u) ];
        };

        // create a torus surface to be drawn in this scene
        var positionFunc_torus = function(u,v) {
            return [ (1 + 0.3 * Math.cos(v)) * Math.cos(u),
                     (1 + 0.3 * Math.cos(v)) * Math.sin(u),
                     0.3 * Math.sin(v) ];
        };

        // create a hyperboloid surface to be drawn in this scene
        var positionFunc_hyperboloid = function(u,v) {

            //COMMENT Quelle: http://www.ssicom.org/js/x910511.htm
            var cosh = function (aValue) {
                var term1 = Math.pow(Math.E, aValue);
                var term2 = Math.pow(Math.E, -aValue);

                return ((term1+term2)/2)
            };

            //COMMENT Quelle: http://www.ssicom.org/js/x911035.htm
            var sinh = function (aValue) {
                var term1 = Math.pow(Math.E, aValue);
                var term2 = Math.pow(Math.E, -aValue);

                return ((term1-term2)/2)
            };

            return [ 0.1 * cosh(v) * Math.cos(u),
                     0.1 * cosh(v) * Math.sin(u),
                     0.3 * sinh(v) ];
        };


        //create a Sine Surface to be drawn in this scene
        var positionFunc_sine_surface = function(u,v) {
            return [ Math.sin(u),
                     Math.sin(v),
                     Math.sin(u+v) ];
        };

        //create a Pseudosphere surface to be drawn in this scene
        var positionFunc_pseudosphere = function(u,v) {
            return [ Math.cos(u) * Math.sin(v),
                     Math.sin(u) * Math.sin(v),
                     Math.cos(v) + Math.log(Math.tan(v/2)) ];
        };
        var config = {  
            "uMin": -Math.PI, 
            "uMax":  Math.PI, 
            "vMin": -Math.PI, 
            "vMax":  Math.PI, 
            "uSegments": 40,
            "vSegments": 20,
        };
        this.ellipsoid = new ParametricSurface(gl, positionFunc, {drawStyle: "triangles"});
        this.ellipsoid2 = new ParametricSurface(gl, positionFunc, {drawStyle: "lines"});

        this.torus = new ParametricSurface(gl, positionFunc_torus, {drawStyle: "triangles"});
        this.torus2 = new ParametricSurface(gl, positionFunc_torus, {drawStyle: "lines"});

        this.hyperboloid = new ParametricSurface(gl, positionFunc_hyperboloid, {drawStyle: "triangles"});
        this.hyperboloid2 = new ParametricSurface(gl, positionFunc_hyperboloid, {drawStyle: "lines"});

        this.sine_surface = new ParametricSurface(gl, positionFunc_sine_surface, {drawStyle: "triangles"});
        this.sine_surface2 = new ParametricSurface(gl, positionFunc_sine_surface, {drawStyle: "lines"});

        this.pseudosphere = new ParametricSurface(gl, positionFunc_pseudosphere, {drawStyle: "triangles"});
        this.pseudosphere2 = new ParametricSurface(gl, positionFunc_pseudosphere, {drawStyle: "lines"});

        this.robot = new Robot(gl, {height: 0.4, drawStyle: "triangles"});
        // !!!!!!!!!! HIER FEHLEN NOCH DIE PROGRAMS!!!!!!!!!!!!!!!

        // initial position of the camera
        this.cameraTransformation = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);

        // transformation of the scene, to be changed by animation
        this.transformation = mat4.create(this.cameraTransformation);

        // the scene has an attribute "drawOptions" that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = { "Perspective Projection": false, 
                             "Show Triangle": false,
                             "Show Cube": false,
                             "Show Band": false,
                             "Show Solid Band": false,
                             "Show Wireframe Band": false,
                             "Show Ellipsoid": false,
                             "Show Torus": false,
                             "Show Hyperboloid": false,
                             "Show Sine Surface": false,
                             "Show Pseudosphere": false,
                             "Show Robot": true
                             };                       
    };

    // the scene's draw method draws whatever the scene wants to draw
    Scene.prototype.draw = function() {
        
        // just a shortcut
        var gl = this.gl;

        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        var projection = this.drawOptions["Perspective Projection"] ?
                             mat4.perspective(45, aspectRatio, 0.01, 100) : 
                             mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);


        // set the uniform variables for all used programs
        for(var p in this.programs) {
            this.programs[p].use();
            this.programs[p].setUniform("projectionMatrix", "mat4", projection);
            this.programs[p].setUniform("modelViewMatrix", "mat4", this.transformation);
        }
        
        //set the uniform color to black
        this.programs.uni.setUniform("uniColor","vec4", [0.0,0.0,0.0,1.0]);
        
        // set offset to avoid z-fighting
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);


        // clear color and depth buffers
        gl.clearColor(0.7, 0.7, 0.7, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
            
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  
                
        // draw the scene objects
        if(this.drawOptions["Show Triangle"]) {    
            this.triangle.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Cube"]) {    
            this.cube.draw(gl, this.programs.vertexColor);
        }
        if(this.drawOptions["Show Band"]) {    
            this.band1.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Solid Band"]) {    
            this.band2.draw(gl, this.programs.red);
        }
        if(this.drawOptions["Show Wireframe Band"]) {
            this.band3.draw(gl, this.programs.uni);
        }
        if(this.drawOptions["Show Ellipsoid"]) {    
            this.ellipsoid.draw(gl, this.programs.red);
            this.ellipsoid2.draw(gl, this.programs.uni);       
       
        }
        if(this.drawOptions["Show Torus"]) {    
            this.torus.draw(gl, this.programs.red);
            this.torus2.draw(gl, this.programs.uni);
        }

        if(this.drawOptions["Show Hyperboloid"]) {    
            this.hyperboloid.draw(gl, this.programs.red);
            this.hyperboloid2.draw(gl, this.programs.uni);

        }

        if(this.drawOptions["Show Sine Surface"]) {    
            this.sine_surface.draw(gl, this.programs.red);
            this.sine_surface2.draw(gl, this.programs.uni);

        }
        if(this.drawOptions["Show Pseudosphere"]) {    
            this.pseudosphere.draw(gl, this.programs.red);
            this.pseudosphere2.draw(gl, this.programs.uni);
        }
        if(this.drawOptions["Show Robot"]) {    
            this.robot.draw(gl, this.programs.vertexColor, this.transformation);
        }
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    Scene.prototype.rotate = function(rotationAxis, angle) {

        // window.console.log("rotating around " + rotationAxis + " by " + angle + " degrees." );

        // degrees to radians
        angle = angle*Math.PI/180;
        
        // manipulate the corresponding matrix, depending on the name of the joint
        switch(rotationAxis) {
            case "worldY": 
                mat4.rotate(this.transformation, angle, [0,1,0]);
                break;
            case "worldX": 
                mat4.rotate(this.transformation, angle, [1,0,0]);
                break;
            default:
                window.console.log("axis " + rotationAxis + " not implemented.");
            break;
        };

        // redraw the scene
        this.draw();
    }

    return Scene;            
    
})); // define module
        

