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
       
       var ParametricCurve =  function (xt, yt, tmin, tmax, segments, lineStyle) {
       
             	// given function x(t)     
      		this.xt = xt;
      		// given function y(t)  
      		this.yt = yt;
      		
      		// given interval 
      		this.interval = [tmin,tmax] || [ 0, 20 ];
      		// number of segments of the parametric curve
      		this.segments = segments || 10	;
      		
      		// draw style for drawing the parametric curve
      		this.lineStyle = lineStyle || { width: "2", color: "#0000AA" };
              	
       }
       
       ParametricCurve.prototype.draw = function(context) {
       	
       	for (var i = 0; i <= this.segments + 1;  i++) {
       		
       		
       	}
       
       
       
       
       }
       
       
       
       
       
       }
       
       	
));
