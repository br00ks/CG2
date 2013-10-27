/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

 
/* requireJS module definition */
define(["jquery", "straight_line", "circle.js"], 
       (function($, StraightLine, Circle) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context, scene, sceneController) {
    
    
	//hide the radius-input by default
	$("#inputRadius_area").hide();
	
        // generate random X coordinate within the canvas
        var randomX = function() { 
            return Math.floor(Math.random()*(context.canvas.width-10))+5; 
        };
            
        // generate random Y coordinate within the canvas
        var randomY = function() { 
            return Math.floor(Math.random()*(context.canvas.height-10))+5; 
        };

	// generate random Radius within the canvas
        var randomRadius = function() { 
	    //returns a random number
            return Math.floor(Math.random()*(context.canvas.height/4))+5
	   // return 4;
        };
        
        
            
        // generate random color in hex notation
        var randomColor = function() {

            // convert a byte (0...255) to a 2-digit hex string
            var toHex2 = function(byte) {
                var s = byte.toString(16); // convert to hex string
                if(s.length == 1) s = "0"+s; // pad with leading 0
                return s;
            };
                
            var r = Math.floor(Math.random()*25.9)*10;
            var g = Math.floor(Math.random()*25.9)*10;
            var b = Math.floor(Math.random()*25.9)*10;
                
            // convert to hex notation
            return "#"+toHex2(r)+toHex2(g)+toHex2(b);
        };
        
        /*
         * event handler for "new line" - button.
         */
        $("#btnNewLine").click( (function() {
        
            // create the actual line and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            };
                          
            var line = new StraightLine( [randomX(),randomY()], 
                                         [randomX(),randomY()], 
                                         style );
            scene.addObjects([line]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
                        
        }));
	
	// event handler for "new circle" - button
	 $("#btnNewCircle").click( (function() {
       		//console.log("you clicked on New Circle");
            // create the actual circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1, //
                color: randomColor()
            };
            //create new circle with random center, radius and style            
            var circle = new Circle( [randomX(),randomY()], 
                                        randomRadius(), 
                                         style );
	   // $("#inputNumber") = circle.style.width;
	  //  $("#inputColor") = circle.style.color;
            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));

	$("#inputColor").change(function() {
		//console.log("changed");
		//console.log($("#inputColor").val());

		//get the selected object
		var selectedObject = sceneController.getSelectedObject();

		//set its new color
		//http://api.jquery.com/val/
		selectedObject.lineStyle.color = $("#inputColor").val();

		//deselect and select the object to change the color of the draggers
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);

         });

	$("#inputNumber").change(function() {
		//console.log("changed");
		//console.log($("#inputNumber").val());

		//get the selected object
		var selectedObject = sceneController.getSelectedObject();

		//set its new width
		//http://api.jquery.com/val/
		selectedObject.lineStyle.width = $("#inputNumber").val();

		//deselect() and select() to update the width instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);

         });
	 
	// When radius is changed and the new radius > 0, set the new radius
	// else set the radius to 0.0 by default
	$("#inputRadius").change(function() {
		//console.log("changed");
		//console.log($("#inputNumber").val());

		//get the selected object
		var selectedObject = sceneController.getSelectedObject();

		//if radius < 0, set radius to 0
		if (parseFloat($("#inputRadius").val()) >= 0) {
			selectedObject.radius = parseFloat($("#inputRadius").val());
		} else {

			selectedObject.radius = 0.0;
		};
            	//deselect() and select() to update the radius instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);

         });
         
         $("#btnParamCurve").click(function() {
        	var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            	};
            	
            	var param_curve = new ParametricCurve();
            	
         
         });
    
    };

    // return the constructor function 
    return HtmlController;


})); // require 



            
