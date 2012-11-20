// Traditional frequency bar visualization
define(function () {
  'use strict';

  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      bars = 200,
      freqOffset = 100,
      spaceWidth = 2,
      barWidth = (canvasWidth / bars) * 2,
      data = new Uint8Array(2048);

    // Retrieving frequency data
    audioAnalyser.getByteFrequencyData(data);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var piece = Math.floor((data.length - freqOffset) / bars);

    // Drawing bars
    for (var i = 0; i < bars; i++) {
      var magnitude = data[i * piece];
      var scaled_magnitude = (magnitude / 256);
      if (magnitude > 0) {
        var color = Math.floor((1 - scaled_magnitude) * 255);
        ctx.fillStyle = 'rgb(' + 255 + ',' + color + ',' + 0 + ')';
        ctx.fillRect(i * barWidth, canvasHeight,
          barWidth - spaceWidth, -magnitude);
      }
    }
  };

  return { render: render };

});