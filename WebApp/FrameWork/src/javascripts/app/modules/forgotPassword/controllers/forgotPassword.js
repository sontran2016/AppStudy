define(function() {
  'use strict';
  var controller = [
    'accountFactory',
    '$state',
    'toaster',
    function(accountFactory,
             $state,
             toaster) {
      var vm = this;

      /**
       * forgot password
       * @param _form
       */
      function forgotPassword(_form) {
        accountFactory.forgotPassword(vm.email)
        .success(function(resp) {
          vm.forgetPasswordSuccess = true;
        })
        .finally(function() {
          _form.$setPristine();
        });
      }

      vm.forgotPassword = forgotPassword;
    }];
  return controller;
});
