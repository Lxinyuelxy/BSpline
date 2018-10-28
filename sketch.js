var controlPoints = [];
var knots1 = [];
var knots2 = [];
var pointsNum = 6;
var degree = 3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i <= pointsNum+degree+1-1; i++) {
    knots1[i] = i;
  }
  for (var i = 0; i <= pointsNum+degree+1-1; i++) {
    if(i < degree+1) 
      knots2[i] = 0.0;
    else if (i < pointsNum) 
    knots2[i] = 0.6;
    else 
    knots2[i] = 1.0;
  }
}

function draw() {
  background(255);

  noFill();
  beginShape();
  for (var i = 0; i < controlPoints.length; i++) {
    var p = controlPoints[i];
    push();
    if (checkIfDragged(p)) {
      fill(color(255, 0, 0));
      ellipse(p.pos.x, p.pos.y, p.radius+5, p.radius+5);
    } else {
      fill(p.c);
      ellipse(p.pos.x, p.pos.y, p.radius, p.radius);
    }
    pop();
    vertex(p.pos.x, p.pos.y);
  }
  endShape();

  if (controlPoints.length >= pointsNum) {
    var bspline =  new BSpline(controlPoints, degree, knots2);
    var points = bspline.getBSplineCurve();
    beginShape();
    for (var i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y);
    }
    endShape();
  }
}

function mouseClicked() {
  if (controlPoints.length < pointsNum) {
    controlPoints.push(new Point(createVector(mouseX, mouseY), 20, color(255,100,100)));
  }
}

function mouseDragged() {
  if (controlPoints.length >= pointsNum) 
    for (var i = 0; i < controlPoints.length; i++) 
      if (checkIfDragged(controlPoints[i])) {
        controlPoints[i].pos.x = mouseX;
        controlPoints[i].pos.y = mouseY;
        break;
      }
}

function checkIfDragged(point) {
  if (dist(mouseX, mouseY, point.pos.x, point.pos.y) < 1.5*point.radius) 
    return true;
  else
    return false;
}