define(function (require){
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.validators.httpUrl', []);
  module.directive('ngHttpUrl', function (){
    return {
      require: 'ngModel',
      restrict: 'A',
      /**
       * link function
       * @param scope
       * @param elem
       * @param attrs
       * @param ngModel
       */
      link: function (scope, elem, attrs, ngModel){

        /**
         * validate http url
         * @param value
         * @returns {boolean}
         */
        ngModel.$validators.httpUrl = function (value){
          return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(value);
        };
      }
    };
  });
  return module.name;
});
