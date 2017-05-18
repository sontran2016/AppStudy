define(function(require) {
  'use strict';
  var angular = require('angular'),
    template = require('text!./templates/aside.html'),
    controller = require('./controllers/aside'),
    expandMenuDirective = require('./directives/expandMenu'),
    menuToggleDirective = require('./directives/menuToggle');

  var module = angular.module('app.aside', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      // Language
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/aside');
    }]);

  module.run([
    '$templateCache',
    function($templateCache) {
      $templateCache.put('aside/templates/aside.html', template);
    }]);

  module.controller('AsideController', controller);
  module.directive('expandMenu', expandMenuDirective);
  module.directive('menuToggle', menuToggleDirective);

  return module.name;
});
