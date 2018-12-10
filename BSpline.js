function BSpline(controlPoints, degree, knots) {
    this. controlPoints = controlPoints;
    this.n = controlPoints.length;
    this.degree = degree;
    this.knots = knots;
}

BSpline.prototype.BSplineDeBoorCox = function(t, j) {
    var V = [];
    for (var i = 0; i < this.controlPoints.length; i++) {
      V[i] = controlPoints[i].copy();
    }

    var i = j;
    for (var r = 1; r <= this.degree+1; r++) {
      for (i = j; i > j-this.degree-1+r; i--) {
        var alpha = (t - this.knots[i]) / (this.knots[i+this.degree+1-r] - this.knots[i]);
        
        V[i] = p5.Vector.add(p5.Vector.mult(V[i], alpha), p5.Vector.mult(V[i-1], (1-alpha)));
      }
    }
    return V[i];
}

BSpline.prototype.getBSplineCurve = function() {
    var points = [];
    
    var low = this.knots[this.degree];
    var high = this.knots[this.n];
    var deltat = (high - low) / 200.0;
    
    var j = this.degree;
    for (var t = low; t < high; t += deltat) {
      while (t > this.knots[j+1]) 
        j++;
      var p = this.BSplineDeBoorCox(t, j);
      points.push(p);
    }  
    return points;
}

