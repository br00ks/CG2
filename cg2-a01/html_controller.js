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
define(["jquery", "straight_line", "circle.js", "parametric_curve"], 
       (function($, StraightLine, Circle, ParametricCurve) {

    "use strict"; 
                
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context and scene
     */
    var HtmlController = function(context, scene, sceneController) {
    	
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
        
        // ########################### CLICK-METHODS ###################################
       
        // event handler for "new line" - button
        $("#btnNewLine").click( (function() {
        
            // create the line and add it to the scene
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
            
            // create the circle and add it to the scene
            var style = { 
                width: Math.floor(Math.random()*3)+1, //
                color: randomColor()
            };
            //create new circle with random center, radius and style            
            var circle = new Circle( [randomX(),randomY()], 
                                        randomRadius(), 
                                         style );

            scene.addObjects([circle]);

            // deselect all objects, then select the newly created object
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
                        
        }));

        // event handler for "new parametric curve"-button
          $("#btnParamCurve").click(function() {
          
          	var style = { 
                width: Math.floor(Math.random()*3)+1,
                color: randomColor()
            	};
              //HIER EVAL?!
                                              
              var tmin = parseInt($("inputMinT").val());
              var tmax = parseInt($("inputMaxT").val());
              var segments = parseInt($("inputSegments").val());
            	var paramcurve = new ParametricCurve($("functionX").val(), $("functionY").val(), tmin, tmax, segments, style);	

 		scene.addObjects([paramcurve]);

            	// deselect all objects, then select the newly created object
            	sceneController.deselect();
            	sceneController.select(paramcurve); // this will also redraw
         
       });
       
       // ########################### CHANGE-METHODS ##################################
      
	// if the color is changed, set the new value of the selected object
       // and redraw the scene with the new value
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
		sceneController.select(selectedObject);//In seinem Code stand das malt die Szene
		//zusätzlich neu

		//and redraw the scene _ JA WIRKLICH???????notewendig?????????????????????????????
		sceneController.scene.draw(sceneController.context);

       });
       
	// if the value of the width is changed, set the new value of the selected object
       // and redraw the scene with the new value
	$("#inputNumber").change(function() {
		//console.log("changed");
		//console.log($("#inputNumber").val());

		//get the selected object
		var selectedObject = sceneController.getSelectedObject();

		//set its new width
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
			//parseFloat: transforms a passed string into a number
			selectedObject.radius = parseFloat($("#inputRadius").val());
		} else {
			selectedObject.radius = 0.0;
		};
            	//deselect() and select() to update the radius instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

       });
       
       
       
       // if the value of the functionX ( x (t) ) is changed, set the new value of the selected object
       // and redraw the scene  
       $("#functionX").change(function() {
       	console.log("changed function X");
       	//TO_DO!!!!!!!!!!!!!!!!!!!!! <-------------------------------------------------------------
       });
       
      	// if the value of the functionY ( y (t) ) is changed, set the new value of the selected object
       // and redraw the scene
       $("#functionY").change(function() {
       	console.log("changed function Y");
       	//TO_DO!!!!!!!!!!!!!!!!!!!!! <-------------------------------------------------------------
	
       });
       
     	// if the value of the minimum t is changed, set the new value of the selected object
       // and redraw the scene
    	$("#inputMinT").change(function() {
       	console.log("changed mint");
       	
       	//get the selected object
		var selectedObject = sceneController.getSelectedObject();
		selectedObject.tmin = parseInt($("#inputMinT").val());
		
		//deselect() and select() to update the radius instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);
		
       });
       
       // if the value of the maximum t is changed, set the new value of the selected object
       // and redraw the scene
       $("#inputMaxT").change(function() {
       	console.log("changed maxt");
       	
       	//get the selected object
		var selectedObject = sceneController.getSelectedObject();
		selectedObject.tmax = parseInt($("#inputMaxT").val());
		
		//deselect() and select() to update the radius instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);
       });
       
       // if the value of the segments is changed, set the new value of the selected object
       // and redraw the scene with the new value
       $("#inputSegments").change(function() {
       
       	var selectedObject = sceneController.getSelectedObject();
		selectedObject.segments = parseInt($("#inputSegments").val());
		
		//deselect() and select() to update the radius instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);
       });
       
       // if the value of the checkbox is changed, set the new value of the selected object
       // and redraw the scene
       $("#inputTicks").change(function() {
				
		var selectedObject = sceneController.getSelectedObject();	
		
		// find out if the value of inputTicks is undefined, then it is not checked
		// therefore set the attribute checkedValue to false, else true
		if ( selectedObject instanceof ParametricCurve ) {
		
			if ($("#inputTicks").attr("checked") == "checked") {
              		selectedObject.setCheckedValue(true);
              		
              	} else { 
              		selectedObject.setCheckedValue(false);
             		}
              }
		//deselect() and select() to update the radius instantly
		sceneController.deselect();
		sceneController.select(selectedObject);

		//and redraw the scene
		sceneController.scene.draw(sceneController.context);

       });
       
       // TO DO!!!!!!!!!! <-----------------------------------------------------------------------
       var onObjSelection = function() {
       
       	// selectedObject represents the current selected object
       	var selectedObject = sceneController.getSelectedObject();
       	
       	$("#inputColor").val(selectedObject.lineStyle.color);
		$("#inputNumber").val(selectedObject.lineStyle.width);
		
		// test if the objects has a attribute radius (otherwise it's no circle-object)
		// show the inputRadius-div, when this attribute exists, else hide it
		if (selectedObject.radius != undefined) {
			$("#inputRadius_area").show();
			$("#inputParam_Parametric").hide();
			$("#inputRadius").val(selectedObject.radius);
			console.log("circle");
			
		// test if the object has a function xt (otherwise it's no parametric curve)
		} else if (selectedObject.xt != undefined ){
			$("#inputParam_Parametric").show();
			$("#inputRadius_area").hide();
			$("#inputMinT").val(selectedObject.tmin);
			$("#inputMaxT").val(selectedObject.tmax);
			$("#inputSegments").val(selectedObject.segments);
			console.log("paramcurve");
			
		} else {
			$("#inputRadius_area").hide();
			$("#inputParam_Parametric").hide();
			console.log("line");
		}
       };
       
       sceneController.onSelection(onObjSelection);
       
       // TO DOOOOOOOOOOOOOOOOO!! <-----------------------------------------------------------------
       var setNewValues = function() {
       	var obj = sceneController.getSelectedObject();
       	
       	if (obj != undefined) {
       		
       		if (obj.radius != undefined) {
       			$("#inputRadius").val(obj.radius);       		
       		}
       		//deselect() and select() to update the radius instantly
			
       	}
       	
       
       };
	sceneController.onObjChange(setNewValues);
	
    };
	
    // return the constructor function 
    return HtmlController;


})); // require 



            
