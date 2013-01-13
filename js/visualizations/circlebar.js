// Frequency bars in a rotating circle shape
define(function () {
  'use strict';

  var rotation = 0;
  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      bars = 100,
      frequencyOffset = 1100,
      data = new Uint8Array(2048),
      sin = Math.sin(Math.PI/50),
      cos = Math.cos(Math.PI/50),
      frequencyBlockSize,
      magnitude,
      scaledMagnitude,
      color,
      scaledAverageMagnitude;

    audioAnalyser.getByteFrequencyData(data);
    // Describes the frequency block size of each individual visual element
    frequencyBlockSize = Math.floor(
      (data.length - frequencyOffset) / bars
    );
    ctx.save();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    if (rotation > Math.PI * 2) {
      rotation = Math.PI / 360;
    } else {
      rotation += Math.PI / 360;
    }
    ctx.rotate(rotation);

    // Beat detection using average magnitude
    scaledAverageMagnitude = 0;
    for (var j = 0; j < data.length; j++) {
        scaledAverageMagnitude += data[j];
    }
    scaledAverageMagnitude = (scaledAverageMagnitude / data.length) / 256;
    ctx.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      scaledAverageMagnitude * scaledAverageMagnitude * 900,
      0,
      2 * Math.PI, false
    );
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      scaledAverageMagnitude * scaledAverageMagnitude * 300,
      0,
      2 * Math.PI, false
    );
    ctx.closePath();
    ctx.fill();

    for (var i = 0; i <= 99; i++) {
        scaledAverageMagnitude += data[i];
        magnitude = data[i * frequencyBlockSize];
        scaledMagnitude = magnitude / 256;
        color = Math.floor((1 - scaledMagnitude) * 255);
        ctx.fillStyle = 'rgb(' + 255 + ',' + 0 + ',' + color + ')';
        ctx.fillRect(-100, 0, scaledMagnitude * 30, 3);
        ctx.fillStyle = 'rgb(' + 255 + ',' + color + ', 0)';
        ctx.fillRect(140, 0,  scaledMagnitude * 80, 5);
        ctx.fillStyle = 'rgb(' + color + ',' + 0 + ',' + 255 + ')';
        ctx.fillRect(-350, 0, scaledMagnitude * 100, 6);
        ctx.fillStyle = 'rgb(' + color + ',' + 200 + ',' + 0 + ')';
        ctx.fillRect(400, 150, scaledMagnitude * 120, 7);
        ctx.transform(cos, sin, -sin, cos, 0, 0);
    }
    ctx.restore();
  };

  return { render: render };

});