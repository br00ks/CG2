/* 
 * JavaScript / Canvas teaching framwork 
 * Karin Lampesberger
 * Module: parametric_curve
 *
 * A parametric curve knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 * 
 */
 
  
/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "straight_line"], 
       (function(Util,vec2,Scene,PointDragger, StraightLine) {
       
       "use strict";
       
       
       //COMMENT!!!!

       var ParametricCurve =  function (xt, yt, tmin, tmax, segments, lineStyle, tickmarks) {
	      
       
           	// given function x(t)     
		this.xt = this.xt || function(t) {return -2*t +t*t};
		console.log("start drawing" + this.xt);

      		// given function y(t)  
		this.yt = this.yt || function (t) {return t};
      		
      		// given interval 
      		this.tmin = tmin || 1;
      		this.tmax = tmax || 20;
      		// number of segments of the parametric curve
      		this.segments = segments || 10;
      		
      		// draw style for drawing the parametric curve
      		this.lineStyle = lineStyle || { width: "3", color: "#0000AA" };
            		
      		//array of nodes
      		this.nodes = new Array();
      		
      		//array of straightlines
      		this.straightLines = new Array();
      		
      		// ticks are deactivated by default
      		this.checkedValue = false;
      		
              	
       };
       // sets the value of the checkbox
       ParametricCurve.prototype.setCheckedValue = function (value) {
      		this.checkedValue = value;
       }
       
       ParametricCurve.prototype.draw = function(context) {
       
 		//FORSCHLEIFE muss noch getestet werden!
             	for (var x = 0; x < this.segments; x++) {

       		// var t = this.tmin + x/this.segments * (this.tmin + this.tmax); 
       		// in seiner formel steht t.max-t.min???
       		
			var t = this.tmin + x/this.segments * (this.tmax - this.tmin); 

       		this.nodes[x] = [this.xt(t),this.yt(t)];	
       	}; 
       	
       	//FORSCHLEIFE RICHTIG??? muss noch getestet werden!
       	//draw 
       	for (var i = 0; i < this.nodes.length - 1; i++) {
       		  
       		  var tempLine = new StraightLine([this.nodes[i][0], this.nodes[i][1]], 
       		  					[this.nodes[i+1][0], this.nodes[i+1][1]],
       		  					 this.lineStyle)
       		  					 
       		  // save the lines in an array to be able to use it for the draw-function
       		  this.straightLines[i] = tempLine;
       		  tempLine.draw(context);
       		  
       		  
       		  // 1 Version, aber bei isHit auf Grenzen gestossen!
                       // context.beginPath();
                       // context.moveTo(this.nodes[i][0], this.nodes[i][1]);
                       // context.lineTo(this.nodes[i+1][0], this.nodes[i+1][1]);
                       // context.lineWidth = this.lineStyle.width;
                       // context.strokeStyle = this.lineStyle.color;
                       // context.stroke();
                       
                   
              };
            
       };
   	// test whether the mouse position is on this curve segment
       ParametricCurve.prototype.isHit = function(context , mousePos) {
       
       	for (var i = 0; i <= this.straightLines; i++) {
       		var tempLine = this.straightLines[i];
       		if (tempLine.isHit(context, mousePos)) {
       			return true;
       			console.log("true-HIT");
       		};
       	
       	};
       	return false;
       	console.log("false-HIT");
       	// FUNKTIONIERT NOCH NICHT! <-------------------------------------- TO DO!
       };
       
       // returns an empty list of draggers
       ParametricCurve.prototype.createDraggers = function() {
       
       	var draggers = [];
       	return draggers;
       
       };
       
      
       
       return ParametricCurve;
       
       
       
       
       
}));
