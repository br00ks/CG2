/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: control_polygon_dragger
 *
 * A ControlPolygonDragger is a drawable object than can react to 
 * events from a SceneController.
 *
 */


/* requireJS module definition */
define(["util", "scene", "straight_line"], 
       (function(Util,Scene, StraightLine) {
       
       // TO DO - COMMENT!!!!!!!!!!!!!!!!!!!!!
       var ControlPolygonDragger = function(getPos0, getPos1, getPos2, getPos3, color) {
       
       	// remember the callbacks
              this.getPos0 = getPos0;
              this.getPos1 = getPos1;
              this.getPos2 = getPos2;
              this.getPos3 = getPos3;
                
              // default draw style
              this.drawStyle = {
                      width : 1,
                      color : color,
                      fill : false
              };

              // attribute queried by SceneController to recognize draggers
              this.isDragger = true;
       
       
       };
       
       
       // draw the controlpolygondragger as straightlines
       ControlPolygonDragger.prototype.draw = function (context) {
       
       	// draw actual line
       	context.beginPath();
       	
       	// set points to be drawn
        	context.moveTo(this.getPos0()[0],this.getPos0()[1]);
        	context.lineTo(this.getPos1()[0],this.getPos1()[1]);
        	
        	context.moveTo(this.getPos1()[0],this.getPos1()[1]);
        	context.lineTo(this.getPos2()[0],this.getPos2()[1]);
        	
        	context.moveTo(this.getPos2()[0],this.getPos2()[1]);
        	context.lineTo(this.getPos3()[0],this.getPos3()[1]);
        	
        	// set drawing style
       	 context.lineWidth = this.drawStyle.width;
        	context.strokeStyle = this.drawStyle.color;
        
       	// actually start drawing
       	context.stroke(); 
 
       
       };
       
       
       
       // test whether the specified mouse position hits this dragger
       ControlPolygonDragger.prototype.isHit = function(context, mousePos) {
       	return false;
       };
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
	return ControlPolygonDragger;       
})); // define
