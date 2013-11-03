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
	

       var ParametricCurve =  function (xt, yt, tmin, tmax, segments, lineStyle) {
	      
       
           	// given function x(t)     
		this.xt = this.xt || function(t) {
		
			var functionX;
		
			try {
				functionX = eval(this.currentXt);
						
			} catch (err) {
			
				console.log ("Ungültige Eingabe! Bitte t als Variable verwenden!");
			};
		
			return functionX;
		
			};
		
		this.currentXt = "100+(100*Math.sin(t))";
		
      		// given function y(t)  
		this.yt = this.yt || function (t) {
			
			var functionY;
		
			try {
				functionY = eval(this.currentYt);
						
			} catch (err) {
			
				console.log ("Ungültige Eingabe! Bitte t als Variable verwenden!");
			};
		
			return functionY;
		
			};
		
		this.currentYt = "100+(100*Math.cos(t))";

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
       
       	var delta = (this.tmax - this.tmin) / this.segments;
       	
		// 
             	for (var x = 0; x <= this.segments; x++) {

			var t = x * delta + this.tmin; 
       		this.nodes[x] = [this.xt(t),this.yt(t)];	
       		
       	}; 
       	console.log(this.nodes.length);
       	
       	  // 1. Version, aber bei isHit auf Grenzen gestossen!
                // context.beginPath();
                // context.moveTo(this.nodes[i][0], this.nodes[i][1]);
                // context.lineTo(this.nodes[i+1][0], this.nodes[i+1][1]);
                // context.lineWidth = this.lineStyle.width;
                // context.strokeStyle = this.lineStyle.color;
                // context.stroke();
                
       	//draw the lines
       	for (var i = 1; i <= this.segments; i++) {
       		  //console.log(this.nodes[i]);
       		  var tempLine = new StraightLine(this.nodes[i-1], this.nodes[i], this.lineStyle);
       		  					 
       		  // save the lines in an array to be able to use it for the draw-function
       		  this.straightLines[i] = tempLine;
       		  tempLine.draw(context);
       		  
       		  // when tickmarks (checkedValue) value is true, then draw the ticks
       		  
       		  if ( this.checkedValue == true ) {
       		  	console.log ("TRUEEEE");
       		  	// HIER TO DO TICKS ZEICHNEN! <-----------------------------------------
       		  	// siehe Folien seite 14&15!! 
       		  	// Tangentenvektor berechnen.. davon normale.. dann einen punkt über
       		  	// und einen punkt unterhalb des aktuellen punktes finden und linie 
       		  	// zeichnen!	
				
				// draw
                   /* context.beginPath();
                    context.arc(this.nodes[i][0], this.nodes[i][1], 3, 0.0, Math.PI * 2, true);
                    context.fill();
                    context.closePath();
                    context.stroke(); */
				
						//Punkt wo die Tangente gezeichnet werden soll
                        var temp = 	this.nodes[i];
							console.log (temp);
										
						//Tangente anlegen
						var tangente = null;
						 var laenge = 3;
						 
						 //beginning to draw the tickmarks mit for-Schleife über die Segmente gehen
						 context.beginPath();
						 
						 for (var i = 1; i <= this.segments; i++) {
							
						//temp = [this.nodes[i][0], this.nodes[i][1]];
						
						//var tangenteX = 0.5 * (this.nodes[i+1][0] - this.nodes[i-1][0]); //siehe Formel Folie
						var tangenteX = 0.5 * (this.nodes[i+1][0] - this.nodes[i-1][0]);
						var tangenteY = 0.5 * (this.nodes[i+1][1] - this.nodes[i-1][1]);
						tangente = [tangenteX, tangenteY];
						console.log (tangente);
						
						var tangentenNormale =  [-tangente[1], tangente[0]];
						
						//var tangente_betrag = Math.sqrt(tangentenNormale[0] * tangentenNormale[0] + tangentenNormale[1] * tangentenNormale[1] );
                        //var tangente_normalized = [tangentenNormale[0] / tangente_betrag, tangentenNormale[1] / tangente_betrag];
						
						 context.moveTo(temp[0] + laenge * tangente_normalized[0], temp[1] + laenge * tangente_normalized[1]);
						context.lineTo(temp[0] + -laenge * tangente_normalized[0], temp[1] + -laenge * tangente_normalized[1]);
						
						//draw tickmarks
						//context.moveTo(temp[0], temp[1]);
						//context.lineTo(temp[0], temp[1]);
				
						} context.closePath();
						
                        
              
			  
                        
				
				
       		  };
       		  
       		
                       
                   
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
