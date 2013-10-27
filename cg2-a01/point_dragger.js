/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 * Module: point_dragger
 *
 * A PointDragger is a drawable object than can react to 
 * events from a SceneController. It will typically control
 * the position of one vertex/point of a scene obejct.
 *
 */


/* requireJS module definition */
define(["util", "scene"], 
       (function(Util,Scene) {

    "use strict";

    /*
     * A dragger is a visible handle to move a 2D point around
     * using the 2D rendering features of the HTML5 canvas element. 
     * Parameters:
     *
     * - getPos [ function() --> [x,y] ]
     *
     *   callback function that will return the position of the dragger 
     *   as an array [x,y]
     *
     * - setPos [ function(dragEvent) ]
     *
     *        a callback function that repositions the dragger according to a 
     *        drag event generated by SceneController. The drag event is of the form 
     *        { position: [x,y], delta: [x,y] }, where pos is the absolute position
     *        of the mouse, and delta is the difference vector pointing from 
     *        the last known dragging position to the current mouse position.
     *
     * - drawStyle [ {radius: 5, width: 2, color: "#FF00FF", fill: false} ] 
     *
     *        specification object for the drawing style, example see above 
     * 
     */

    var PointDragger = function(getPos, setPos, drawStyle) {

        // remember the callbacks
        this.getPos = getPos;
        this.setPos = setPos;
        
        // default draw style for the dragger
        drawStyle = drawStyle || {};
        this.drawStyle = {};
        this.drawStyle.radius = drawStyle.radius || 5;
        this.drawStyle.width = drawStyle.width || 2;
        this.drawStyle.color = drawStyle.color || "#ff0000";
        this.drawStyle.fill = drawStyle.fill || false;
        
        // attribute queried by SceneController to recognize draggers
        this.isDragger = true; 
                                        
    };


    /*
     * draw the dragger as a small circle
     */
    PointDragger.prototype.draw = function (context) {

        // what is my current position?
        var pos = this.getPos();

        // what shape to draw
        context.beginPath();
        context.arc(pos[0], pos[1], // position
                    this.drawStyle.radius,    // radius
                    0.0, Math.PI*2,           // start and end angle
                    true);                    // clockwise
        context.closePath();
        
        // draw style
        context.lineWidth   = this.drawStyle.width;
        context.strokeStyle = this.drawStyle.color;
        context.fillStyle   = this.drawStyle.color;
        
        // trigger the actual drawing
        if(this.drawStyle.fill) {
            context.fill();
        };
        context.stroke();
    };

    /* 
     * test whether the specified mouse position "hits" this dragger
     */
    PointDragger.prototype.isHit = function (context,mousePos) {
    
        // what is my current position?
        var pos = this.getPos();
    
        // check whether distance between mouse and dragger's center
        // is less or equal ( radius + (line width)/2 )
        var dx = mousePos[0] - pos[0];
        var dy = mousePos[1] - pos[1];
        var r = this.drawStyle.radius+this.drawStyle.width/2;
        return (dx*dx + dy*dy) <= (r*r);           

    };
        
    /*
     * Event handler triggered by a SceneController when mouse
     * is being dragged
     */
    PointDragger.prototype.mouseDrag = function (dragEvent) {
    
        // change position of the associated original (!) object
        this.setPos(dragEvent);
            
    };

    // this module exposes only the constructor for Dragger objects
    return PointDragger;

})); // define
