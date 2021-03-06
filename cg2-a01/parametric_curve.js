/* 
 * JavaScript / Canvas teaching framwork 
 * Karin Lampesberger & Rebecca Ritter
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
       
       
	// A simple parametric curve cannot be dragged
	// Parameters:
	// - xt : given functionX, calculates x - coordinate
	// - yt : given functionY, calculates y - coordinate
	// - tmin: minimum of the domain
	// - tmax: maximum of the domain
	// - segments: number of parts of the curve
	// - lineStyle: object defining width and color attributes for curve drawing
	

       var ParametricCurve =  function (currentXt, currentYt, tmin, tmax, segments, lineStyle) {
	
		this.currentXt = currentXt || "100+(100*Math.sin(t))";
       	this.currentYt = currentYt || "100+(100*Math.cos(t))";
       	
       	// for closure
       	var curve = this;
       	
           	// given function x(t)     
		this.xt = this.xt || function(t) {
		
			var functionX;
		
			try {
				functionX = eval(curve.currentXt);
						
			} catch (err) {
		
				console.log ("Ungültige Eingabe! Bitte t als Variable verwenden!");
			};
		
			return functionX;
		
		};
			
      		// given function y(t)  
		this.yt = this.yt || function (t) { 
			
			var functionY;
		
			try {
				functionY = eval(curve.currentYt);
						
			} catch (err) {
			
				console.log ("Ungültige Eingabe! Bitte t als Variable verwenden!");
			};
		
			return functionY;
		
		};
		
      		// given interval 
      		this.tmin = tmin || 0;
      		this.tmax = tmax || 2*Math.PI;
      		
      		// number of segments of the parametric curve
      		this.segments = segments || 6;
      		
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
       // true: tickmarks will be drawn
       // false: tickmarks won't be drawn
       ParametricCurve.prototype.setCheckedValue = function (value) {
      		this.checkedValue = value;
       }
       
       // sets the current function Xt as a String
       ParametricCurve.prototype.setCurrentXt = function(value) {
       	this.currentXt = value;
       }
       // sets the current function Yt as a String
       ParametricCurve.prototype.setCurrentYt = function(value) {
       	this.currentYt = value;
       }
       
       
       // draw this parametric curve into a 2D rendering context
       ParametricCurve.prototype.draw = function(context) {
	   	
	   	//defines the value to the x will be multiplied with
       	var delta = (this.tmax - this.tmin) / this.segments;
       	
		// calculate all the nodes and save them in an array
             	for (var x = 0; x <= this.segments; x++) {

			var t = x * delta + this.tmin; 
			
       		this.nodes[x] = [this.xt(t),this.yt(t)];	
       		
       	}; 
       	
				  // 1. Version, aber bei isHit auf Grenzen gestossen!
				  // context.beginPath();
				  // context.moveTo(this.nodes[i][0], this.nodes[i][1]);
				  // context.lineTo(this.nodes[i+1][0], this.nodes[i+1][1]);
				  // context.lineWidth = this.lineStyle.width;
				  // context.strokeStyle = this.lineStyle.color;
				  // context.stroke();
                
       	//draw the lines and ticks
       	for (var i = 1; i <=	 this.segments ; i++) {
       	
       		  //line to be drawn
       		  var tempLine = new StraightLine(this.nodes[i-1], this.nodes[i], this.lineStyle);
       		  					 
       		  // save the lines in an array to be able to use it for the itHit-function
       		  this.straightLines[i] = tempLine;
       		  
       		  // draw the line
       		  tempLine.draw(context);
       		  
       		  // when tickmarks (checkedValue) value is true, then draw the ticks
       		  if (this.checkedValue) {
       		  	
       		  	// HIER TO DO TICKS ZEICHNEN! <-----------------------------------------
       		  	// siehe Folien seite 14&15!! 
       		  	// Tangentenvektor berechnen.. davon normale.. dann einen punkt über
       		  	// und einen punkt unterhalb des aktuellen punktes finden und linie 
       		  	// zeichnen!	
				
                        	context.beginPath();
                        	try {
		                     var tangenteX = 0.5 * (this.nodes[i+1][0] - this.nodes[i-1][0]);
		                     var tangenteY = 0.5 * (this.nodes[i+1][1] - this.nodes[i-1][1]);
		                     
					// Tangente vom Punkt p
		                     var tangente = [tangenteX, tangenteY];
					// Normale von der Tangente
		                     var normale = [-tangente[1], tangente[0]];                           
								
					//Normale normalisiert			//Länge des Normalenvektors, Skalarprodukt der beiden Vektoren(siehe vec2)
		            		var normalized = vec2.divide(normale, (vec2.length(normale)));
								
					// Punkt an dem die Tangete gezeichnet werden soll
		                     var getPoint = [this.nodes[i][0], this.nodes[i][1]];
		                     
                            } catch(err) {
					//hier evtl. noch fehlermeldung                            
                            };
                            
                            //draw the tickmark
                            context.moveTo(getPoint[0] + 5 * normalized[0], getPoint[1] + 5 * normalized[1]);
				context.lineTo(getPoint[0] - 5 * normalized[0], getPoint[1] - 5 * normalized[1]);      
                     
						
             		};
            		context.closePath();
			context.stroke();
       	};
	 };
       
   	// tests whether the mouse position is on this curve segment
       ParametricCurve.prototype.isHit = function(context , mousePos) {
		
       	for (var i = 0; i <= this.straightLines.length; i++) {
       	
			var temp = this.straightLines[i];
			
			if (this.straightLines[i] != undefined) {
       			if (temp.isHit(context, mousePos)) {
       				return true;
	
       			};
       		};
       	
       	};
       	return false;
       };
       
       // returns an empty list of draggers
       ParametricCurve.prototype.createDraggers = function() {
       
       	var draggers = [];
       	return draggers;
       
       };
      
      
       return ParametricCurve;
     
       
}));
