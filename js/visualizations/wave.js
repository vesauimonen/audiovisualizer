// Traditional time domain wave visualization
define(function () {
  'use strict';

  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      bars = canvasWidth,
      offset = 10,
      spaceWidth = 0,
      barWidth = 1,
      data = new Uint8Array(2048);

    // Retrieve time domain data
    audioAnalyser.getByteTimeDomainData(data);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var piece = Math.floor((data.length - offset) / bars);

    // Drawing each bar
    for (var i = 0; i < bars; i++) {
      var magnitude = data[i * piece];
      var scaled_magnitude = (magnitude - 128) / 128;
      ctx.fillStyle = 'rgb(' + 25 + ',' + 25 + ',' + 25 + ')';
      ctx.fillRect(
        i * barWidth,
        canvasHeight / 2 - 75 + scaled_magnitude * 150,
        barWidth - spaceWidth,
        150
      );
      ctx.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
      ctx.fillRect(
        i * barWidth,
        canvasHeight / 2 - 50 + scaled_magnitude * 100,
        barWidth - spaceWidth,
        100
      );
    }
  };

  return { render: render };

});