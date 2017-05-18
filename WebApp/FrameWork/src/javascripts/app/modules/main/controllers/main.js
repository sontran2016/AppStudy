define(function (require) {
  'use strict';

  var $ = require('jquery');

  var controller = [
    '$scope',
    'accountFactory',
    'userContext',
    '$window',
    function ($scope,
              accountFactory,
              userContext,
              $window) {
      var vm = this;

      /**
       * purchase
       */
      function purchase() {
        accountFactory.purchase(userContext.authentication().userData.id, userContext.getUserLibrary().id)
          .success(function (resp) {
            $window.location.href = resp.data.redirectUrl;
          });
      }

      vm.purchase = purchase;

    }];
  return controller;
});
