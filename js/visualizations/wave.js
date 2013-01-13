// Traditional time domain wave visualization
define(function () {
  'use strict';

  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      bars = canvasWidth,
      spaceWidth = 0,
      barWidth = 1,
      data = new Uint8Array(2048),
      timeBlockSize,
      magnitude,
      scaledMagnitude;

    audioAnalyser.getByteTimeDomainData(data);
    // Describes the time block size of each individual visual element
    timeBlockSize = Math.floor((data.length) / bars);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < bars; i++) {
      magnitude = data[i * timeBlockSize];
      // Scaling to a range of -1...1
      scaledMagnitude = (magnitude - 128) / 128;
      ctx.fillStyle = 'rgb(' + 25 + ',' + 25 + ',' + 25 + ')';
      ctx.fillRect(
        i * barWidth,
        canvasHeight / 2 - 75 + scaledMagnitude * 150,
        barWidth - spaceWidth,
        150
      );
      ctx.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
      ctx.fillRect(
        i * barWidth,
        canvasHeight / 2 - 50 + scaledMagnitude * 100,
        barWidth - spaceWidth,
        100
      );
    }
  };

  return { render: render };

});