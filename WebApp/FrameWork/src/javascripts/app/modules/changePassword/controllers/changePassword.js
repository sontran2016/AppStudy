define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
  'accountFactory',
  function (accountFactory) {
    var vm = this;

    /**
     * change password
     * @param _form
     */
    function changePassword(_form) {
      accountFactory.changePassword(vm.user).success(function(resp) {
        vm.user = {};
      }).finally(function() {
        _form.$setPristine();
      });
    }

    vm.user = {};
    vm.changePassword = changePassword;
  }];
  return controller;
});
