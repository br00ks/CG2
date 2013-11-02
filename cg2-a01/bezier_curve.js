/* 
 * JavaScript / Canvas teaching framwork 
 * Karin Lampesberger & Rebecca Ritter
 * Module: bezier_curve
 *
 * A bezier curve knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 * 
 */
 
  
/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "straight_line", "parametric_curve"], 
       (function(Util,vec2,Scene,PointDragger, StraightLine, ParametricCurve) {
       
       "use strict";
       
       
       var BezierCurve =  function (p0, p1, p2, p3, segments, lineStyle) {
       	this.p0 = p0 || [50, 50];
       	this.p1 = p1 || [100, 50];
       	this.p1 = p2 || [25, 150];
       	this.p3 = p3 || [150, 50];
       	
       	this.xt = function(t) {
       		return (Math.pow((1 - t), 3) * this.p0[0]) + (3 * Math.pow((1 - t), 2) 
       			* t * this.p1[0]) + (3 * (1 - t) * Math.pow(t, 2) * this.p2[0]) 
       			+ (Math.pow(t, 3) * this.p3[0]);
       	};
       	
       	this.yt = function(t) {
       		return (Math.pow((1 - t), 3) * this.p0[1]) + (3 * Math.pow((1 - t), 2) 
       			* t * this.p1[1]) + (3 * (1 - t) * Math.pow(t, 2) * this.p2[1]) 
       			+ (Math.pow(t, 3) * this.p3[1]);
       	};
       	
       	this.tmin = 0;
       	this.tmax = 1;
       	this.segments = segments || 10;
       	this.lineStyle = lineStyle || { width: "3", color: "#0000AA" };
      
      		//this.bezier_curve =  new ParametricCurve(this.xt, this.yt, this.tmin, this.tmax, this.segments, this.lineStyle);
       
       };
       
       
       BezierCurve.prototype.draw = function(context) {
       
       };
       
       BezierCurve.prototype.isHit = function(context, mousePos) {
       
       };
       
       BezierCurve.prototype.createDraggers = function() {
       
       };
       	
       
       return BezierCurve;
       
              
}));
