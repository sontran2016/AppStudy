define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$translate',
    'troubleshootFactory',
    'favoriteData',
    function ($scope,
              $translate,
              troubleshootFactory,
              favoriteData) {

      var vm = this;

      /**
       * remove a troubleshoot from favorite list
       * @param id
       */
      function removeFavorite(id) {
        troubleshootFactory.removeFavorite(id).then(function () {
          _.remove(vm.favoriteList, function (item) {
            return item.id === id;
          });
        });
      }

      /**
       * set rating for a troubleshoot
       * @param trouble
       */
      function setRating(trouble) {
        var model = {
          numRate: trouble.rate
        };
        troubleshootFactory.setRating(trouble.id, model).then(function (resp) {
          trouble.rate = resp.data.rate;
          trouble.isRated = true;
        });
      }

      vm.favoriteList = angular.copy(favoriteData);

      vm.removeFavorite = removeFavorite;
      vm.setRating = setRating;

    }];
  return controller;
});
