define(function () {
  'use strict';

  var fileDropped = function (e) {
    e.stopPropagation();
    e.preventDefault();
    return e.dataTransfer.files[0];
  };
  var fileOver = function (e) {
    e.stopPropagation();
    e.preventDefault();
  };

  return {
    fileDropped: fileDropped,
    fileOver: fileOver
  };

});