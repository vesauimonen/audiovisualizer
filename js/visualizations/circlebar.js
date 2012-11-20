// Frequency bars in a rotating circle shape
define(function () {
  'use strict';

  var rotation = 0;
  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      bars = 100,
      freqOffset = 1100,
      data = new Uint8Array(2048),
      sin = Math.sin(Math.PI/50),
      cos = Math.cos(Math.PI/50);

    // Retrieving frequency data
    audioAnalyser.getByteFrequencyData(data);
    var piece = Math.floor((data.length - freqOffset) / bars);

    // 'Beat detection' using average magnitude
    var average_magnitude = 0;
    for (var j=0; j < data.length; j++) {
        average_magnitude += data[j];
    }
    average_magnitude = (average_magnitude / data.length) / 256;
    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // Handling rotation of the canvas
    if (rotation > Math.PI*2) {
      rotation = Math.PI/360;
    } else {
      rotation += Math.PI/360;
    }
    ctx.rotate(rotation);

    // Drawing 'beat circles'
    ctx.fillStyle = "rgb(" + 255 + "," + 255 + "," + 255 + ")";
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      average_magnitude * average_magnitude * 900,
      0,
      2 * Math.PI, false
    );
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      average_magnitude * average_magnitude * 300,
      0,
      2 * Math.PI, false
    );
    ctx.closePath();
    ctx.fill();

    // Drawing bars
    for (var i=0; i <= 99; i++) {
        average_magnitude += data[i];
        var magnitude = data[i * piece];
        var scaled_magnitude = magnitude / 256;
        var color = Math.floor((1 - scaled_magnitude) * 255);
        ctx.fillStyle = "rgb(" + 255 + "," + 0 + "," + color + ")";
        ctx.fillRect(-100, 0, scaled_magnitude * 30, 3);
        ctx.fillStyle = "rgb(" + 255 + "," + color + ", 0)";
        ctx.fillRect(140, 0,  scaled_magnitude * 80, 5);
        ctx.fillStyle = "rgb(" + color + "," + 0 + "," + 255 + ")";
        ctx.fillRect(-350, 0, scaled_magnitude * 100, 6);
        ctx.fillStyle = "rgb(" + color + "," + 200 + "," + 0 + ")";
        ctx.fillRect(400, 150, scaled_magnitude * 120, 7);
        ctx.transform(cos, sin, -sin, cos, 0, 0);
    }
    ctx.restore();
  };

  return { render: render };

});