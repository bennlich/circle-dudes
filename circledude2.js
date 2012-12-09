var myCanvas, myCtx;

var listOfCircleDudes = [];

var NUM_CIRCLE_DUDES = 30;
var FISHBOWL_RADIUS = 100;
var WIDTH, HEIGHT;

function init() {
	myCanvas = document.getElementById("myCanvas");
	WIDTH = myCanvas.width = document.width;
	HEIGHT = myCanvas.height = document.height;

	myCtx = myCanvas.getContext("2d");

	for (var i = 0; i < NUM_CIRCLE_DUDES; i++) {
		listOfCircleDudes.push(new CircleDude());
	}

	myCtx.fillStyle = "rgba(0,0,0)";
	myCtx.fillRect(0,0,WIDTH,HEIGHT);

	setInterval(step,50);
}

function step() {
	myCtx.fillStyle = "rgba(0,0,0,0.05)";
	myCtx.fillRect(0,0,WIDTH,HEIGHT);
	for (var i = 0; i < listOfCircleDudes.length; i++) {
		listOfCircleDudes[i].step();
		// listOfCircleDudes[i].draw();
		for (var j = i+1; j < listOfCircleDudes.length; j++) {
			if (j != i) {
				var hotspots = intersection(listOfCircleDudes[i], listOfCircleDudes[j]);
				var circleDudeDistance = listOfCircleDudes[i].pos.distanceFrom(listOfCircleDudes[j].pos);
				var col = Math.round(circleDudeDistance*255/(listOfCircleDudes[i].r+listOfCircleDudes[j].r));
				for (var k = 0; k < hotspots.length; k++) {
					myCtx.beginPath();
					// myCtx.arc(listOfCircleDudes[i].pos.e(1)+hotspots[k][0], listOfCircleDudes[i].pos.e(2)+hotspots[k][1], 1, 0, Math.PI*2, false);
					myCtx.arc(hotspots[k][0], hotspots[k][1], 1, 0, Math.PI*2, false);
					myCtx.closePath();
					myCtx.fillStyle = "rgba(255,255,255,0.5)";
					myCtx.fill();
				}
			}
		}
	}
}

function posOrNeg() {
	return Math.random() > 0.5 ? 1 : -1;
}

function hsv_to_rgb(h, s, v) {  
	var c = v * s;  
	var h1 = h / 60;  
	var x = c * (1 - Math.abs((h1 % 2) - 1));  
	var m = v - c;  
	var rgb;  
	  
	if (typeof h == 'undefined') rgb = [0, 0, 0];  
	else if (h1 < 1) rgb = [c, x, 0];  
	else if (h1 < 2) rgb = [x, c, 0];  
	else if (h1 < 3) rgb = [0, c, x];  
	else if (h1 < 4) rgb = [0, x, c];  
	else if (h1 < 5) rgb = [x, 0, c];  
	else if (h1 <= 6) rgb = [c, 0, x];  
	  
	return [255 * (rgb[0] + m), 255 * (rgb[1] + m), 255 * (rgb[2] + m)];  
}

function CircleDude() {

	this.tail = [];
	this.pos = $V([Math.random()*WIDTH, Math.random()*HEIGHT]);
	this.r = 50+Math.random()*300;
	var maxSpeed = 5;
	this.vel = $V([-maxSpeed/2+Math.random()*maxSpeed,-maxSpeed+Math.random()*maxSpeed]);

	this.angVel = Math.random()*Math.PI*2/100; // velocity of the tater
	this.theta = 0; // position of the tater

	this.step = function() {
		var wallVector = $V([WIDTH/2,HEIGHT/2]).subtract(this.pos).x(1/100);
		console.log(wallVector.modulus());
		this.vel = this.vel.rotate(posOrNeg()*Math.random()*Math.PI*2/16,$V([0,0]));
		
		this.pos = this.pos.add(this.vel).add(wallVector);
		this.theta = (this.theta + this.angVel) % (Math.PI * 2);
	}

	this.draw = function() {
		myCtx.beginPath();
		myCtx.arc(this.pos.e(1), this.pos.e(2), this.r, 0, Math.PI*2, false);
		myCtx.closePath();
		myCtx.stroke(0,0,0);
	}

}

// totally didn't copy from http://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
function intersection(circleDude1, circleDude2) {
	var x0 = circleDude1.pos.e(1);
	var y0 = circleDude1.pos.e(2);
	var r0 = circleDude1.r;
	var x1 = circleDude2.pos.e(1);
	var y1 = circleDude2.pos.e(2);
	var r1 = circleDude2.r;

    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return [];
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return [];
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.  
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a/d);
    y2 = y0 + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0*r0) - (a*a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    // return [[rx, ry]];
    return [[xi, yi], [xi_prime, yi_prime]];
    return [[xi, xi_prime], [yi, yi_prime]];
}