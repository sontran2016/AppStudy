define(function (require) {
  'use strict';
  var angular = require('angular'),
    module;
  module = angular.module('common.directives.userAvatar', []);
  module.directive('userAvatar', [
    '$timeout',
    'notifications',
    '$document',
    'appConstant',
    'userContext',
    function ($timeout,
              notifications,
              $document,
              constant,
              userContext) {

      /**
       * link fn
       * @param scope
       * @param elem
       * @param attrs
       * @param ngModel
       */
      function linkFn(scope, elem, attrs, ngModel) {

        /**
         * reload image
         * @param url
         */
        function reloadImage(url) {
          var img = $document[0].createElement('img');

          /**
           * on load image
           */
          img.onload = function () {
            var $this = this;
            elem.attr("src", $this.src);
          };

          /**
           * load image error
           */
          img.onerror = function () {
            elem.attr("src", 'img/avatars/default-avatar.png');
          };

          img.src = url;
        }

        reloadImage(scope.userAvatar);

        notifications.onImageAvatarChanged(scope, function (args) {
          reloadImage(args.url);
        });
      }

      return {
        restrict: 'A',
        link: linkFn,
        scope: {
          userId: '@',
          userAvatar: '@'
        }
      };
    }]);
  return module.name;
});
