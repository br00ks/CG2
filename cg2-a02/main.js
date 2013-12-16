/*
  *
 * Module main: CG2 Aufgabe 2 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */

requirejs.config({
    paths: {
    
        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
            
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7",

    }
});


/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "webgl-debug", "animation", "scene", "html_controller"], 
       (function($, glmatrix, WebGLDebugUtils, Animation, Scene, HtmlController ) {

    "use strict";

    /*
     * create an animation that rotates the scene around 
     * the Y axis over time. 
     */
    var makeAnimation = function(scene) {
    
        var time = 0;

        // create animation to rotate the scene
        var animation = new Animation( (function(t, deltaT) {

            // milliseconds for one round
            var round = 360/animation.customSpeed*1000;
            console.log(round);

            // rotation angle, depending on animation time
            var angle = deltaT/1000 * animation.customSpeed; // in degrees

            // ask the scene to rotate around Y axis
            scene.rotate("worldY", angle);
            scene.rotate("neck left right", angle);
            scene.rotate("hand left", deltaT/1000 * animation.customSpeed*10);

            if (t < time+round/2) {
                scene.rotate("hipjoint right", angle);
                scene.rotate("knee right", -angle/2);
                scene.rotate("hipjoint left", angle);
                scene.rotate("knee left", -angle/2);
                scene.rotate("elbow right", angle/2);
                scene.rotate("shoulder left", -angle);

            } else if (t < time+round) {
                scene.rotate("hipjoint right", -angle);
                scene.rotate("knee right", angle/2);
                scene.rotate("hipjoint left", -angle);
                scene.rotate("knee left", angle/2);
                scene.rotate("elbow right", -angle/2);
                scene.rotate("shoulder left", angle);


            } else {
                time = time + round;
            }
            console.log(t);

            // (re-) draw the scene
            scene.draw();
            
        } )); // end animation callback
        // set an additional attribute that can be controlled from the outside
        animation.customSpeed = 20; 

        return animation;
    
    };

    var makeWebGLContext = function(canvas_name) {
    
        // get the canvas element to be used for drawing
        var canvas=$("#"+canvas_name).get(0);
        if(!canvas) { 
            throw "HTML element with id '"+canvas_name + "' not found"; 
            return null;
        };

        // get WebGL rendering context for canvas element
        var options = {alpha: true, depth: true, antialias:true};
        var gl = canvas.getContext("webgl", options) || 
                 canvas.getContext("experimental-webgl", options);
        if(!gl) {
            throw "could not create WebGL rendering context";
        };
        
        // create a debugging wrapper of the context object
        var throwOnGLError = function(err, funcName, args) {
            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
        };
       // var gl=WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
        
        return gl;
    };
    
    $(document).ready( (function() {
    
        // create WebGL context object for the named canvas object
        var gl = makeWebGLContext("drawing_area");
                                        
        // create scene, create animation, and draw once
        var scene = new Scene(gl);
        var animation = makeAnimation(scene);
        scene.draw();        

        // mapping from chaacter pressed on the keyboard to 
        // rotation axis and angle
        var keyMap = {
             'x': {axis: "worldX", angle:  5.0}, 
             'X': {axis: "worldX", angle: -5.0}, 
             'y': {axis: "worldY", angle:  5.0}, 
             'Y': {axis: "worldY", angle: -5.0}, 
             'c': {axis: "shoulder right", angle: 5.0},
             'C': {axis: "shoulder right", angle: -5.0},
             'v': {axis: "shoulder left", angle: 5.0},
             'V': {axis: "shoulder left", angle: -5.0},
             'a': {axis: "elbow right", angle: 5.0},
             'A': {axis: "elbow right", angle: -5.0},
             's': {axis: "elbow left", angle: 5.0},
             'S': {axis: "elbow left", angle: -5.0},
             'n': {axis: "neck left right", angle: 5.0},
             'N': {axis: "neck left right", angle: -5.0},
             'm': {axis: "neck up down", angle: 5.0},
             'M': {axis: "neck up down", angle: -5.0},
             'p': {axis: "pelvic up down", angle: 5.0},
             'P': {axis: "pelvic up down", angle: -5.0},
             'o': {axis: "pelvic left right", angle: 5.0},
             'O': {axis: "pelvic left right", angle: -5.0},
             'f': {axis: "ankle right", angle: 5.0}, 
             'F': {axis: "ankle right", angle: -5.0},
             'g': {axis: "ankle left", angle: 5.0}, 
             'G': {axis: "ankle left", angle: -5.0},
             'k': {axis: "knee right", angle: 5.0},
             'K': {axis: "knee right", angle: -5.0},
             'l': {axis: "knee left", angle: 5.0},
             'L': {axis: "knee left", angle: -5.0},
             'h': {axis: "hip", angle: 5.0},
             'H': {axis: "hip", angle: -5.0},
             'q': {axis: "hipjoint right", angle: 5.0},
             'Q': {axis: "hipjoint right", angle: -5.0},
             'w': {axis: "hipjoint left", angle: 5.0},
             'W': {axis: "hipjoint left", angle: -5.0},
             'ä': {axis: "hand right", angle: 5.0},
             'Ä': {axis: "hand right", angle: -5.0},
             'ü': {axis: "hand left", angle: 5.0},
             'Ü': {axis: "hand left", angle: -5.0}

        };

        // create HtmlController that takes care of all interaction
        // of HTML elements with the scene and the animation
        var controller = new HtmlController(scene,animation,keyMap); 
        
    })); // $(document).ready()

    
    
})); // define module
        

