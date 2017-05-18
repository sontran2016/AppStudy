define(function (require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.context.user', []);
  module.factory('userContext', [
    'storage',
    '$q',
    '$rootScope',
    function (storage,
              $q,
              $rootScope) {
      var service = {},
        authentication = {
          isAuth: false,
          token: '',
          refresh_token: '',
          userData: {},
          avatarId: (new Date()).getTime()
        },
        permissions = null;

      $rootScope.currentUserInfo = authentication.userData;

      /**
       * get permission
       * @returns {*}
       */
      service.getPermissions = function () {
        var data = JSON.parse(sessionStorage.getItem('permissionData')) || permissions;
        permissions = data;
        return data;
      };

      /**
       * update permission
       * @param p
       */
      service.updatePermissions = function (p) {
        permissions = p;
        sessionStorage.setItem('permissionData', JSON.stringify(p));
      };

      /**
       * set token
       * @param token
       * @param refresh_token
       * @param rememberMe
       */
      service.setToken = function (token, refresh_token, rememberMe) {
        if (!token) {
          authentication.isAuth = false;
          authentication.token = undefined;
          authentication.refresh_token = undefined;
          this.clearInfo();
        } else {
          authentication.isAuth = true;
          authentication.token = token;
          authentication.refresh_token = refresh_token;
        }
        if (rememberMe) {
          this.saveLocal(authentication);
        }
      };

      /**
       * fill info
       * @param obj
       * @param rememberMe
       */
      service.fillInfo = function (obj, rememberMe) {
        authentication.userData = angular.extend(authentication.userData, obj);
        $rootScope.currentUserInfo = authentication.userData;
        // Save data to local storage
        if (rememberMe) {
          this.saveLocal(authentication);
        }
      };

      /**
       * clear info
       */
      service.clearInfo = function () {
        authentication.userData = {};
        $rootScope.currentUserInfo = {};
        authentication.token = '';
        authentication.refresh_token = '';
        authentication.avatarId = (new Date()).getTime();
        authentication.isAuth = false;
        this.updatePermissions([]);
        this.saveLocal(authentication);
      };

      /**
       * save local
       * @param obj
       */
      service.saveLocal = function (obj) {
        obj = obj || {};
        sessionStorage.setItem('authenticationData', JSON.stringify(obj));
      };

      /**
       * load info from local
       */
      service.loadFromLocal = function () {
        var data = JSON.parse(sessionStorage.getItem('authenticationData'));
        data = data || {};
        authentication = data;
        authentication.avatarId = (new Date()).getTime();
        $rootScope.currentUserInfo = authentication.userData;
        this.setToken(data.token, data.refresh_token, true);
      };

      /**
       * sign out
       * @returns {*}
       */
      service.signOut = function () {
        var deferred = $q.defer();
        this.clearInfo();
        deferred.resolve();
        return deferred.promise;
      };

      /**
       * authentication
       * @returns {{isAuth: boolean, token: string, refresh_token: string, userData: {}, avatarId: number}}
       */
      service.authentication = function () {
        return authentication;
      };

      return service;
    }]);
  return module.name;
});
