// Starfield-grid kinda visualization
define(function () {
  'use strict';

  var render = function (canvas, ctx, audioAnalyser) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      lines = 15,
      dots = 180,
      frequencyOffset = 1200,
      startHeight = canvasHeight * 0.3,
      data = new Uint8Array(2048),
      frequencyBlockSize,
      magnitude,
      scaledMagnitude,
      color,
      widthHelp,
      space,
      dotWidth;

    audioAnalyser.getByteFrequencyData(data);
    // Describes the frequency block size of each individual visual element
    frequencyBlockSize = Math.floor(
      (data.length - frequencyOffset) / dots
    );
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Drawing the grid with nested loops
    for (var i = 0; i < dots; i++) {
      magnitude = data[i * frequencyBlockSize];
      scaledMagnitude = (magnitude / 256);
      color = 255 - Math.floor(scaledMagnitude * 255);
      for (var j = 0; j < lines; j++) {
        // Todo: needs some heavy refactoring
        widthHelp = 0.4 + j * (0.6 / lines);
        space = (canvasWidth * widthHelp) / dots;
        dotWidth = j / 2;
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