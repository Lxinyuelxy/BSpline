var settingPannel;
var curveDegree = 3;
var controlPointsNum = 6;
var knotsVector = "clamped";
var showPolygon = true;
var splineColor = "#fd4102";
var splineStrokeWeight = 3;

var controlPoints = [];
var ifFinishGenPoints = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  settingPannel = QuickSettings.create(10, 10, "Double click to generate a control point")
                  .addRange("Degree of Curve", 1, 5, curveDegree, 1, function(value) {
                    curveDegree = value})
                  .addRange("Control Points Num", 6, 15, controlPointsNum, 1, function(value) {
                    controlPointsNum = value})
                  .addDropDown("Knots Vector",["clamped", "unclamped"], function(value) {
                    knotsVector = value.value})
                  .addBoolean("Show Control Polygon", true, function(value) {
                    showPolygon = value})
                  .addColor("Stroke Color", splineColor, function(value){
                    splineColor = value
                  })
                  .addRange("Stroke Weight", 1, 5, splineStrokeWeight, 1, function(value){
                    splineStrokeWeight = value
                  })
}

function draw() {
  background(255);
  
  if (showPolygon) drawPolygon();

  if (ifFinishGenPoints) {
    var knots;
    switch(knotsVector) {
      case 'clamped': 
        knots = generateClampedKnots(controlPointsNum, curveDegree);
        break;
      case 'unclamped':
        knots = generateUnclampedKnots(controlPointsNum, curveDegree);
        break;
    }
    var bspline =  new BSpline(controlPoints, curveDegree, knots);
    var points = bspline.getBSplineCurve();
    drawPolyLine(points);
  }
}

function drawPolygon() {
  noFill();
  beginShape();
  for (var i = 0; i < controlPoints.length; i++) {
    var p = controlPoints[i];
    push();
    if (checkIfDragged(p)) {
      fill(120, 120, 120);
      ellipse(p.x, p.y, 25, 25);
    } else {
      fill(60, 60, 60);
      ellipse(p.x, p.y, 15, 15);
    }
    pop();
    vertex(p.x, p.y);
  }
  endShape();
}

function drawPolyLine(points) {
  push();
  beginShape();
  stroke(splineColor);
  strokeWeight(splineStrokeWeight);
    for (var i = 0; i < points.length; i++) {
      vertex(points[i].x, points[i].y);
    }
  endShape();
  pop();
}

function doubleClicked() {
  if (controlPoints.length < controlPointsNum) {
    controlPoints.push(createVector(mouseX, mouseY));
    if(controlPoints.length == controlPointsNum) {
      ifFinishGenPoints = true;
      settingPannel.disableControl("Control Points Num");
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