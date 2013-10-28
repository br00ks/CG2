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
define(["util", "vec2", "scene", "point_dragger"], 
       (function(Util,vec2,Scene,PointDragger) {
       
       "use strict";
       
       
       //COMMENT!!!!
       var ParametricCurve =  function (xt, yt, tmin, tmax, segments, lineStyle) {
       
             	// given function x(t)     
      		this.xt = xt || function (t) {return -2*t +t*t};
      		// given function y(t)  
      		this.yt = yt || function (t) {return t};
      		
      		// given interval 
      		this.tmin = tmin || 1;
      		this.tmax = tmax || 20;
      		// number of segments of the parametric curve
      		this.segments = segments || 10;
      		
      		// draw style for drawing the parametric curve
      		this.lineStyle = lineStyle || { width: "3", color: "#0000AA" };
            		
      		//array of nodes
      		this.nodes = new Array();
      		
      		// ticks are deactivated by default
      		this.checkedValue = false;
      		
              	
       };
       // sets the value of the checkbox
       ParametricCurve.prototype.setCheckedValue = function (value) {
      		this.checkedValue = value;
       }
       
       ParametricCurve.prototype.draw = function(context) {
       
 		//FORSCHLEIFE RICHTIG??? muss noch getestet werden!
             	for (var x = 0; x < this.segments; x++) {

       		var t = this.tmin + x/this.segments * (this.tmin + this.tmax);
       		console.log(t);
       		this.nodes[x] = [this.xt(t), this.yt(t)];
       	}; 
       	//console.log(this.nodes.length);
       	
       	//FORSCHLEIFE RICHTIG??? muss noch getestet werden!
       	//draw 
       	for (var i = 1; i < this.nodes.length - 1; i++) {
       	
                       //console.log(this.nodes[i]);
                       context.beginPath();
                       context.moveTo(this.nodes[i][0], this.nodes[i][1]);
                       context.lineTo(this.nodes[i+1][0], this.nodes[i+1][1]);
                       context.lineWidth = this.lineStyle.width;
                       context.strokeStyle = this.lineStyle.color;
                       context.stroke();
                   
              }
                
       	
       	
       };
       //TO-DO!!!!!!!!!!!!!!!!!!!!!!!!!!! <-------------------------------------------------------------
       ParametricCurve.prototype.isHit = function(context , mousePos) {
       	return false;
       };
       
       ParametricCurve.prototype.createDraggers = function() {
       
       	var draggers = [];
       	return draggers;
       
       };
       
      
       
       return ParametricCurve;
       
       
       
       
       
}));
