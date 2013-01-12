// Traditional frequency bar visualization
define(function () {
  'use strict';

  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      bars = 200,
      frequencyOffset = 100,
      spaceWidth = 2,
      barWidth = (canvasWidth / bars) * 2,
      data = new Uint8Array(2048);

    audioAnalyser.getByteFrequencyData(data);
    // Describes the frequency block size of each individual visual element,
    // in this case a bar.
    var frequencyBlockSize = Math.floor(
      (data.length - frequencyOffset) / bars
    );
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (var i = 0; i < bars; i++) {
      var magnitude = data[i * frequencyBlockSize];
      var scaled_magnitude = (magnitude / 256);
      if (magnitude > 0) {
        var color = Math.floor((1 - scaled_magnitude) * 255);
        ctx.fillStyle = 'rgb(' + color + ',' + 255 + ',' + 0 + ')';
        ctx.fillRect(
          i * barWidth,
          canvasHeight * 0.6,
          barWidth - spaceWidth,
          -magnitude
        );
        ctx.fillStyle = 'rgba(' + color + ',' + 255 +
          ',' + 0 + ',' + 0.3 + ')';
        ctx.fillRect(
          i * barWidth,
          canvasHeight * 0.6,
          barWidth - spaceWidth,
          magnitude / 2
        );
      }
    }
  };

  return { render: render };

});