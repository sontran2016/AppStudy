define(function(require) {
    'use strict';
    var angular = require('angular'),
        jQuery = require('jquery'),
        module = angular.module('common.directives.numericOnly', []);

    module.directive('numericOnly', [
        function() {

            /**
             * only accept numeric character in text box
             * @param scope
             * @param elem
             * @param attrs
             * @param ngModelCtrl
             */
            function numericOnlyFn(scope, elem, attrs, ngModelCtrl) {
                var keyCode = [8, 9, 37, 39, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
                elem.bind("keydown", function(event) {
                    if (jQuery.inArray(event.which, keyCode) === -1) {
                        scope.$apply(function() {
                            scope.$eval(attrs.numericOnly);
                            event.preventDefault();
                        });
                        event.preventDefault();
                    }

                });
            }

            return {
                restrict: "A",
                link: numericOnlyFn
            };
        }]);

    return module.name;
});