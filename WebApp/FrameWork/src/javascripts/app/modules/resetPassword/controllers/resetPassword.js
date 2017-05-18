define(function() {
  'use strict';
  var controller = [
    'accountFactory',
    '$state',
    'toaster',
    'validLink',
    '$stateParams',
    function(accountFactory,
             $state,
             toaster,
             validLink,
             $stateParams) {

      var vm = this;

      /**
       * reset password
       */
      function resetPassword() {
        var model = {
          "userId": $stateParams.userId,
          "password": vm.user.password,
          "confirmPassword": vm.user.confirmPassword,
          "code": $stateParams.code
        };

        accountFactory.resetPassword(model).success(function(resp) {
          vm.resetSuccessed = true;
        });
      }

      vm.validLink = validLink;
      vm.resetSuccessed = false;

      vm.resetPassword = resetPassword;

    }];
  return controller;
});
