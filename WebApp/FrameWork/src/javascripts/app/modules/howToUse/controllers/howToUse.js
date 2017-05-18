define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var controller = [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      var vm = this;

      if($state.includes('app.howToUseForgotPassword')) {
        vm.module = 'forgotPassword';
      } else if($state.includes('app.howToUseArea')) {
        vm.module = 'area';
      } else if($state.includes('app.howToUseLine')) {
        vm.module = 'line';
      } else if($state.includes('app.howToUseMachine')) {
        vm.module = 'machine';
      } else if($state.includes('app.howToUseComponent')) {
        vm.module = 'component';
      } else if($state.includes('app.howToUseSymptom')) {
        vm.module = 'symptom';
      } else if($state.includes('app.howToUsePotentialCause')) {
        vm.module = 'potentialCause';
      } else if($state.includes('app.howToUseTroubleshoot')) {
        vm.module = 'troubleshoot';
      } else if($state.includes('app.howToUseIssue')) {
        vm.module = 'issue';
      } else if($state.includes('app.howToUseUser')) {
        vm.module = 'user';
      } else if($state.includes('app.howToUseTag')) {
        vm.module = 'tag';
      }

    }];
  return controller;
});
