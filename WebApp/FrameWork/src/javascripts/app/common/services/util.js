define(function (require){
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.services.util', []);
  module.factory('utilFactory', ['appConstant',
    function (appConstant){
    var services = {};

    /**
     * get parent with class
     * @param e
     * @param className
     * @param depth
     * @returns {*}
     */
    services.getParentWithClass = function (e, className, depth){
      depth = depth || 10;
      while (e.parentNode && depth--) {
        if (e.parentNode.classList && e.parentNode.classList.contains(className)) {
          return e.parentNode;
        }
        e = e.parentNode;
      }
      return null;
    };

    /**
     * get parent of self with class
     * @param e
     * @param className
     * @param depth
     * @returns {*}
     */
    services.getParentOrSelfWithClass = function (e, className, depth){
      depth = depth || 10;
      while (e && depth--) {
        if (e.classList && e.classList.contains(className)) {
          return e;
        }
        e = e.parentNode;
      }
      return null;
    };

    /**
     * new guid
     * @returns {*}
     */
    services.newGuid = function (){

      /**
       * guid
       * @returns {string}
       */
      function guid(){

        /**
         * s4
         * @returns {string}
         */
        function s4(){
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      return guid();
    };

    /**
     * make id
     * @param l
     * @returns {string}
     */
    services.makeId = function (l){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

      for (var i = 0; i < l; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }

      return text;
    };

    /**
     * Generate color for chart
     * @param count
     * @returns {Array}
     */
    services.generateColor = function (count) {
      var res = [];
      for (var i = 0; i < count; i++) {
        var r = Math.floor((255 * i) / count),
          g = (r + i * count ) % 255,
          b = (r + g + i * count) % 255;
        res.push("rgb(" + r + "," + g + "," + b + ")");
      }
      return res;
    };

    /**
     *  get full image url
     * @param fileUrl
     * @returns {string}
     */
    services.getImageUrl = function (fileUrl) {
      return appConstant.domain + fileUrl;
    };

    services.scrollTop = function () {
      $('html, body').animate({ scrollTop: 0 }, 'fast');
    };

    return services;
  }]);
  return module.name;
});
