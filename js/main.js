require.config({
  paths: {
    'jquery': '//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min'
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