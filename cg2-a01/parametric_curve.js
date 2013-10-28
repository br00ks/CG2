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

       var ParametricCurve =  function (xt, yt, tmin, tmax, segments, lineStyle, tickmarks) {
	   
	   
       
             	// given function x(t)     
      		//this.xt = xt || function(t){return -2*t +t*t};
			//in Aufgabenstellung:
				//eval() gibt wenn übergebendes Argument als Rechenoperation interpretiert werden kann, dessen Ergebnis zurück
				//Beispiel: http://de.selfhtml.org/javascript/objekte/unabhaengig.htm#eval
			this.xt = eval(this.xt) || function(t){return -2*t +t*t};
			console.log("start drawing" + this.xt);

      		// given function y(t)  
      		//this.yt = yt || function (t) {return t};
			this.yt = eval(this.yt) || function (t) {return t};			//Wo finden das Abfangen der Fehleingabe statt? http://www.peterkropff.de/site/javascript/fehlerbehandlung.htm
																		//try {} catch(e) {if()  alert();}
      		
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

       		//var t = this.tmin + x/this.segments * (this.tmin + this.tmax); //in seiner formel steht t.max-t.min???
			var t = this.tmin + x/this.segments * (this.tmax - this.tmin); 
       		console.log(t);
       		this.nodes[x] = [eval(this.xt(t)), eval(this.yt(t))];	//eval??? Wieder muss die Prüfung stattfinden?
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
	   // test whether the mouse position is on this curve segment
       ParametricCurve.prototype.isHit = function(context , mousePos) {
	   
			for (var i = 1; i < this.nodes.length - 1; i++) {
			
				if( (this.nodes[i]).isHit == true ) {
					return true;
					}
			}
	   
       	return false;
       };
       
       ParametricCurve.prototype.createDraggers = function() {
       
       	var draggers = [];
       	return draggers;
       
       };
       
      
       
       return ParametricCurve;
       
       
       
       
       
}));
