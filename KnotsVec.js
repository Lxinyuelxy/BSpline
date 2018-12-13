function generateUnclampedKnots(pointsNum, degree) {
    var knots = [];
    for(var i = 0; i < pointsNum+degree+1; i++) {
      knots[i] = i*0.1;
    }
    return knots;
  }
  
  function generateClampedKnots(pointsNum, degree) {
    var knots = [];
    var delta = 1.0 / (pointsNum+degree);
    for(var i = 0; i < pointsNum+degree+1; i++) {
      if (i < degree+1)
        knots[i] = 0.0;
      else if (i < pointsNum)
        knots[i] = knots[i-1] + delta;
      else
        knots[i] = 1;
    }
    return knots;
  }