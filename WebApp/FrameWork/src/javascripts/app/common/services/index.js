define(function (require) {
  'use strict';
  var angular = require('angular');

    var module = angular.module('common.services',
    [
        require('./account'),
        require('./notifications'),
        require('./util'),
        require('./file'),
        require('./box'),
        require('./dropbox'),
        require('./common'),
        require('./dashboard'),
        require('./permission'),
        require('./mock'),
        require('./area'),
        require('./user'),
        require('./tag'),
        require('./potentialCause'),
        require('./symptom'),
        require('./troubleshoot'),
        require('./issue'),
        require('./line'),
        require('./machine'),
        require('./component'),
        require('./step'),
        require('./shooting'),
        require('./signalr'),
        require('./opcgroup'),
        require('./opctag')
  ]);
    return module.name; 
});
