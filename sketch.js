var gui_curveDegree = 3;
var gui_controlPointsNum = 6;
var gui_knotsVector = ['clamped', 'unclamped'];
var gui_showPolygon = true;
var gui_strokeColor = '#46b9b0';
var gui_strokeWidth = 3;
var gui;

var controlPoints = [];
var ifFinishGenPoints = false;
var bspline;

function setup() {
  createCanvas(windowWidth, windowHeight);

  gui = createGui("Let's draw bspline");
  sliderRange(1, 5, 1);
  gui.addGlobals('gui_curveDegree');

  sliderRange(6, 12, 1);
  gui.addGlobals('gui_controlPointsNum');

  gui.addGlobals('gui_knotsVector', 'gui_showPolygon', 'gui_strokeColor');

  sliderRange(1, 5, 1);
  gui.addGlobals('gui_strokeWidth');
}

function draw() {
  background(255);
  
  if (gui_showPolygon) drawPolygon();

  if (ifFinishGenPoints) {
    var knots;
    switch(gui_knotsVector) {
      case 'clamped': 
        knots = generateClampedKnots(gui_controlPointsNum, gui_curveDegree);
        break;
      case 'unclamped':
        knots = generateUnclampedKnots(gui_controlPointsNum, gui_curveDegree);
        break;
    }
    var bspline =  new BSpline(controlPoints, gui_curveDegree, knots);
    var points = bspline.getBSplineCurve();
    drawPolyLine(points);
  }
}

function generateUnclampedKnots(pointsNum, degree) {
  var knots = [];
  for(var i = 0; i < pointsNum+degree+1; i++) {
    knots[i] = i*0.1;
  }
  return knots;
}

function generateClampedKnots(pointsNum, degree) {
  var knots = [];
  for(var i = 0; i < pointsNum+degree+1; i++) {
    if (i < degree+1)
      knots[i] = 0.0;
    else if (i < pointsNum)
      knots[i] = i * 0.1;
    else
      knots[i] = 1;
  }
  return knots;
}

function drawPolygon() {
  noFill();
  beginShape();
  for (var i = 0; i < controlPoints.length; i++) {
    var p = controlPoints[i];
    push();
    if (checkIfDragged(p)) {
      fill(color(255, 0, 0));
      ellipse(p.x, p.y, 15, 15);
    } else {
      // fill(p.c);
      ellipse(p.x, p.y, 20, 20);
    }
    pop();
    vertex(p.x, p.y);
  }
  endShape();
}

function drawPolyLine(points) {
  beginShape();
    for (var i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y);
    }
  endShape();
}

function doubleClicked() {
  if (controlPoints.length < gui_controlPointsNum) {
    controlPoints.push(createVector(mouseX, mouseY));
    if(controlPoints.length == gui_controlPointsNum) {
      ifFinishGenPoints = true;
    }
  }
}

function mouseDragged() {
  if (ifFinishGenPoints) 
    for (var i = 0; i < controlPoints.length; i++) 
      if (checkIfDragged(controlPoints[i])) {
        controlPoints[i].x = mouseX;
        controlPoints[i].y = mouseY;
        break;
      }
}

function checkIfDragged(point) {
  if (dist(mouseX, mouseY, point.x, point.y) < 20) 
    return true;
  else
    return false;
}