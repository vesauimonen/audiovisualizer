window.AudioContext = window.AudioContext || window.webkitAudioContext; // In case you actually run Chrome 10

require.config({
  paths: {
    'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min'
  }
});

require([
  'domready',
  'audiovisualizer'
], function (domReady, audioVisualizer) {
  'use strict';

  domReady(function () {
    // Firing the visualizer
    audioVisualizer.initialize();
  });

});