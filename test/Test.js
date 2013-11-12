var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.moveTo(65 , 0);
ctx.lineTo(65 , 400);
ctx.stroke();

ctx.beginPath();
ctx.arc(30,50,20,0,2*Math.PI);
ctx.fillStyle = "#0000ff";
ctx.fill();
ctx.closePath();
ctx.stroke();

var mouseDown = false;
var currentColor;

function ev_mousemove (ev) {
  var x, y;

  // Get the mouse position relative to the canvas element.
  if (ev.layerX || ev.layerX == 0) { // Firefox
    x = ev.layerX;
    y = ev.layerY;

  if(!mouseDown) {
	ctx.moveTo(x,y);
	mouseDown = true;
  }
  else {
	ctx.lineTo(x,y);
	ctx.stroke();
  }
 }


}
