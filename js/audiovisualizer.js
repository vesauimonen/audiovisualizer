/*
Audio visualizer using Web Audio API and HTML5 canvas element.
(https://dvcs.w3.org/hg/audio/raw-file/tip/webaudio/specification.html)
By: Vesa Uimonen and Lari Marsalo 2012-
*/

define([
  'jquery',
  'requestanimframe',
  'dnd',
  'visualizations/wave',
  'visualizations/circlebar',
  'visualizations/starfield',
  'visualizations/bar'
], function ($, animator, dnd,
  waveVis, circleBarVis, starfieldVis, barVis) {
  'use strict';


  // Array of visualizations in use. Add any new visualization modules here.
  var visualizations = [
    waveVis,
    circleBarVis,
    starfieldVis,
    barVis
  ];

  var canvas = document.getElementById('canvas'),
    dropArea = document.getElementById('drop-area'),
    loadSample = $('#load-sample'),
    dndText = $('#drop-text'),
    nextText = $('#next'),
    prevText = $('#prev'),
    navigation = $('#navigation'),
    playLog = $('#play-log'),
    audioContext = new webkitAudioContext(),
    audioSource = audioContext.createBufferSource(),
    audioAnalyser = audioContext.createAnalyser(),
    ctx = canvas.getContext('2d'),
    animationRequest,
    sampleAudioUrl = 'sample/zifi_-_bubbatrone.mp3',
    currentVisualization = 0;


  var initialize = function () {
    addResizeListener();
    addDragAndDropListeners();
    addClickListeners();
    addKeydownListeners();
  };

  var addResizeListener = function() {
    onResize();
    $(window).resize(function () {
      onResize();
    });
  };

  var addDragAndDropListeners = function() {
    dropArea.addEventListener('dragover', dnd.fileOver, false);
    dropArea.addEventListener('drop', function (e) {
      stopAudio();
      playAudio(dnd.fileDropped(e));
    }, false);
  };

  var addClickListeners = function() {
    loadSample.click(function () {
      playAudio(sampleAudioUrl);
    });
    nextText.click(nextVisualization);
    prevText.click(prevVisualization);
  };

  var addKeydownListeners = function() {
    var leftArrow = 37,
      rightArrow = 39;
    $(document).keydown(function (e) {
      if (e.keyCode === leftArrow) {
        prevVisualization();
      } else if (e.keyCode === rightArrow) {
        nextVisualization();
      }
    });
  };

  var playAudio = function(audio) {
    dndText.fadeOut('slow');
    playLog.append('Loading audio...<br>');
    if (typeof(audio) === 'string') {
      // Sample audio decoder
      var request = new XMLHttpRequest();
      request.open('GET', audio, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        audioContext.decodeAudioData(request.response, function (audioBuffer) {
          playBuffer(audioBuffer);
        });
      };
      request.send();
    } else {
      // Dropped audio decoder
      var reader = new FileReader();
      reader.readAsArrayBuffer(audio);
      reader.onload = (function (e) {
        audioContext.decodeAudioData(e.target.result, function (audioBuffer) {
            playBuffer(audioBuffer);
        });
      });
    }
  };

  var playBuffer = function(audioBuffer) {
    audioSource.buffer = audioBuffer;
    audioSource.loop = true;
    audioAnalyser.fftSize = 2048;
    audioAnalyser.smoothingTimeConstant = 0.75;
    audioSource.connect(audioAnalyser);
    audioAnalyser.connect(audioContext.destination);
    playLog.append('playing audio...<br>');
    audioSource.noteOn(0.0);
    playLog.append('visualizing.<br>');
    visualize();
    navigation.fadeIn('slow');
    $(canvas).fadeIn('slow');
  };

  var stopAudio = function() {
    if (audioSource) {
      playLog.empty();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      window.cancelAnimationFrame(animationRequest);
      audioSource.disconnect();
    }
  };

  var visualize = function() {
    animationRequest = window.requestAnimationFrame(visualize);
    visualizations[currentVisualization].render(canvas, ctx, audioAnalyser);
  };

  var nextVisualization = function() {
    if (currentVisualization === visualizations.length - 1) {
      currentVisualization = 0;
    } else {
      currentVisualization++;
    }
  };

  var prevVisualization = function() {
    if (currentVisualization === 0) {
      currentVisualization = visualizations.length - 1;
    } else {
      currentVisualization--;
    }
  };

  var onResize = function() {
    // Resizing canvas & drag n drop zone
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    $(dropArea).css('height', $(window).height());
  };

  return { initialize: initialize };
});