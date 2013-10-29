/* 
 * JavaScript / Canvas teaching framwork 
 * Karin Lampesberger
 * Module: circle
 *
 * A Circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself. (centerpoint and radius)
 * 
 */


/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "radius_dragger"], 
       (function(Util,vec2,Scene,PointDragger, RadiusDragger) {
	
	 "use strict";

 	/**
	  *  A simple circle that can be dragged 
	  *  Parameters:
	  *  - center: array object representing [x,y] coordinates of the center of the circle
	  *  - radius: the distance from the center to the edge of the circle 
	  *  - lineStyle: object defining width and color attributes for circle drawing, 
	  */ 
	
	var Circle = function(center, radius, lineStyle) {

		this.center = center || [10,10];
		this.radius = radius || 6;
		this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
	

	};
	//draw this circle into a 2D rendering context
	Circle.prototype.draw = function(context) {
		
		//draw a circle with the given arc-function
		context.beginPath();
		context.arc(	this.center[0],this.center[1],  //position
				this.radius, // radius
				0.0, Math.PI*2, //start and end angle
				true);	//clockwise

		// set drawing style
		context.lineWidth = this.lineStyle.width;
		context.strokeStyle = this.lineStyle.color;
		
		context.closePath();
		
		// actually start drawing
		context.stroke(); 
        
	};

	 
	// test whether the mouse position is on this circle segment
    	Circle.prototype.isHit = function(context , mousePos) {

		//check if distance is between mouse and the center
		var dx = mousePos[0] - this.center[0];
       	var dy = mousePos[1] - this.center[1];

		//tolerance of 2 pixel
		var tolerance = 2;

		//the miminum hitpoint
		var minHit = this.radius - tolerance;
		//the maximum hitpoint
		var maxHit = this.radius + tolerance;
	
		return (dx*dx + dy*dy) <= (maxHit*maxHit) && (dx*dx + dy*dy) >= (minHit * minHit);
   
   	};

	// return a list of draggers to manipulate this circle
	Circle.prototype.createDraggers = function() {
	    	
		//style of the dragger-circle
		var draggerStyle = { radius:3, color: this.lineStyle.color, width:0, fill:true }
		var draggers = [];
		
		// create closure and callbacks for dragger
		var _circle = this; 

		// CREATE POINTDRAGGER
		// get the position for the point_dragger
		var getP0 = function() { return _circle.center; };

		// set the position for the point_dragger
		var setP0 = function(dragEvent) { _circle.center = dragEvent.position; };

		//push the new dragger to the list
		draggers.push( new PointDragger(getP0, setP0, draggerStyle) );


		// CREATE RADIUSDRAGGER	
		// getting the position of the radiusdragger
           	var getRadiusPos = function() {
		   
				var pos = []; //var pos = new Array();
				
				// takes the array object for the point of the existing 
				// position of the radius
				var posRadiuspos = _circle.center[0] + _circle.radius;
				var poshorizontalpos = _circle.center[1];
				
				//[ radiusposition , "horizontale position zum centerpoint von da aus" ]
				return [ posRadiuspos, poshorizontalpos];			
						
		};

              // setting the position of the new Radiusdraggerposition (to change 
              // the size of the circle)
              var setRadiusPos = function(dragEvent) {
			// set the position for the RadiusDragger
			// _circle.center = dragEvent.position;-->geht nicht, weil 
			// sich die radiusposition diesmal verändern soll
			
            		var newRDp = dragEvent.position;  //newRadiusDrawingPosition
            		_circle.radius = newRDp[0] -  _circle.center[0];

              };	

           	draggers.push( new RadiusDragger(getRadiusPos, setRadiusPos, draggerStyle) );
           	
		return draggers;
        
   	};



	return Circle;

	}
	
));

		
