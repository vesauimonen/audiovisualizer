// Starfield-grid kinda visualization
define(function () {
  'use strict';

  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      lines = 15,
      dots = 180,
      freqOffset = 1200,
      startHeight = canvasHeight*0.3,
      data = new Uint8Array(2048);

    // Retrieving frequency data
    audioAnalyser.getByteFrequencyData(data);
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var piece = Math.floor((data.length - freqOffset) / dots);

    // Drawing the grid with nested loops
    for (var i = 0; i < dots; i++) {
      var magnitude = data[i * piece];
      var scaled_magnitude = (magnitude / 256);
      var color = 255 - Math.floor(scaled_magnitude * 255);
      for (var j = 0; j < lines; j++) {
        var widthHelp = 0.4 + j*(0.6/lines);
        var space = (canvasWidth*widthHelp)/dots;
        var dotWidth = j/2;
        ctx.fillStyle = 'rgb(' + color + ',' + color + ',' + 255 + ')';
        ctx.fillRect(
          i * space + (canvasWidth * ((1 - widthHelp) / 2)),
          -magnitude * 0.5 + startHeight * (1 + (j * j * 0.008)),
          dotWidth,
          1
        );
      }
    }
  };

  return { render: render };

});