define(function (require) {
  'use strict';
  var angular = require('angular'),
    navbarTemplate = require('text!./templates/navbar.html'),
    importTemplate = require('text!./templates/modal/import.html'),
    navbarController = require('./controllers/navbar'),
    importController = require('./controllers/modal/import');

  var module = angular.module('app.navbar', []);

  module.config([
    '$translatePartialLoaderProvider',
    function ($translatePartialLoaderProvider) {
      $translatePartialLoaderProvider.addPart('javascripts/app/modules/navbar');
    }]);

  module.run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('navbar/templates/navbar.html', navbarTemplate);
      $templateCache.put('navbar/templates/modal/import.html', importTemplate);
    }]);

  module.controller('NavbarController', navbarController);
  module.controller('ImportController', importController);

  return module.name;
});
