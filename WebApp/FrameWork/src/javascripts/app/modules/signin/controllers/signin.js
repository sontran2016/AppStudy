define(function () {
  'use strict';
  var controller = [
    'accountFactory',
    '$state',
    '$rootScope',
    'userContext',
    'signalRFactory',
    'appConstant',
    function (accountFactory,
              $state,
              $rootScope,
              userContext,
              signalRFactory,
              appConstant) {

      var vm = this;
      /**
       * signin
       * @param username
       * @param password
       */
      function signin(username, password) {
        username = username + '@pg.com';
        accountFactory.login(username, password, true).then(function () {
          //connect to signal r
          var authentication = userContext.authentication();
          if(authentication.token){
            signalRFactory.setOptions({
              url: appConstant.domain + '/signalr',
              header: { Authorization: "Bearer " + authentication.token }
            });
            signalRFactory.start();
          }

          if ($rootScope.saveState) {
            $state.transitionTo($rootScope.saveState.state.name, $rootScope.saveState.params);
          } else {
            $state.transitionTo('app.home');
          }
        }, function (err) {
          vm.frm.$setPristine();
        });
      }

      vm.sigin = signin;

    }];
  return controller;
});
