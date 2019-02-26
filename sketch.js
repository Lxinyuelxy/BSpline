var settingPannel;
var curveDegree = 3;
var changeOfDegree = 0;
var controlPointsNum = 6;
var knotsVector = "clamped, uniform";
var showPolygon = true;
var splineColor = "#fd4102";
var splineStrokeWeight = 3;

var controlPoints = [];
var ifFinishGenPoints = false;

function setup() {
  for (var i = 0; i < 25; i++) {
    var num = Math.random();
    while(num == 0) num = Math.random();
    randomNumber[i] = num;
  }
  randomNumber.sort();

  createCanvas(windowWidth, windowHeight);
  settingPannel = QuickSettings.create(10, 10, "Double click to generate a control point");
  settingPannel.addRange("Degree of Curve", 1, 5, curveDegree, 1, function(value) {
    changeOfDegree = value - curveDegree; 
    curveDegree = value});
  settingPannel.addRange("Control Points Num", 6, 15, controlPointsNum, 1, function(value) {controlPointsNum = value})
  settingPannel.addDropDown("Knots Vector",["clamped, uniform", "clamped, nonuniform", "unclamped, uniform", "unclamped, nonuniform", "customize"], function(value) {
    knotsVector = value.value});
  
  for(var i = 0; i < 25; i++) {
    settingPannel.addNumber('knot '+str(i), 1, 25, i*0.1, 0.1);
    settingPannel.hideTitle('knot '+str(i));
    settingPannel.hideControl('knot '+str(i));
  }
    
  settingPannel.addBoolean("Show Control Polygon", true, function(value) {showPolygon = value});
  settingPannel.addColor("Stroke Color", splineColor, function(value){splineColor = value});
  settingPannel.addRange("Stroke Weight", 1, 5, splineStrokeWeight, 1, function(value){splineStrokeWeight = value});
}

function draw() {
  background(255);
  
  if (showPolygon) drawPolygon();

  if (ifFinishGenPoints) {
    var knots;
    switch(knotsVector) {
      case 'clamped, uniform': 
        knots = clampedUniformKnots(controlPointsNum, curveDegree);
        hideKnotsInputSettings();
        break;
      case 'clamped, nonuniform':
        knots = clampedNonuniformKnots(controlPointsNum, curveDegree);
        hideKnotsInputSettings();
        break;
      case 'unclamped, uniform':
        knots = unclampedUniformKnots(controlPointsNum, curveDegree);
        hideKnotsInputSettings();
        break;
      case 'unclamped, nonuniform':
        knots = unclampedNonuniformKnots(controlPointsNum, curveDegree);
        hideKnotsInputSettings();
        break;
      case 'customize':
        knots = []
        for(var i = 0; i < controlPointsNum+curveDegree+1; i++) {
          settingPannel.showControl('knot '+str(i));
          knots[i] = settingPannel.getValue('knot '+str(i));
        }
        if(changeOfDegree < 0) {
          for(var i = controlPointsNum+curveDegree-changeOfDegree; i > controlPointsNum+curveDegree; i--) {
            settingPannel.hideControl('knot '+str(i));
            knots.pop();
          }
          changeOfDegree = 0;
        }
        knots.sort();
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

function hideKnotsInputSettings() {
  for(var i = 0; i < controlPointsNum+curveDegree+1; i++) 
    settingPannel.hideControl('knot '+str(i));
}

function doubleClicked() {
  if (controlPoints.length < controlPointsNum) {
    controlPoints.push(createVector(mouseX, mouseY));
    if(controlPoints.length == controlPointsNum) {
      ifFinishGenPoints = true;
      settingPannel.disableControl("Control Points Num");

      // knots = clampedUniformKnots(controlPointsNum, curveDegree);
      // console.log("clamped, uniform", knots);
      // knots = clampedNonuniformKnots(controlPointsNum, curveDegree);
      // console.log("clamped, nonuniform", knots);
      // knots = unclampedUniformKnots(controlPointsNum, curveDegree);
      // console.log("unclamped, uniform", knots);
      // knots = unclampedNonuniformKnots(controlPointsNum, curveDegree);
      // console.log("unclamped, nonuniform", knots);

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