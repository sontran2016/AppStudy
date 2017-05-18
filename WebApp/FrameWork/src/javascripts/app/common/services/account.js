define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash');

  var module = angular.module('common.services.account', [
    require('app/common/context/user')
  ]);

  module.factory('accountFactory', [
    '$http',
    'appConstant',
    'userContext',
    '$q',
    '$rootScope',
    '$translate',
    'Upload',
    function ($http,
              constant,
              userContext,
              $q,
              $rootScope,
              $translate,
              Upload) {
      var services = {};
      var headerAuth = {
        Authorization: 'Basic ' + constant.encryptKey
      };

      /**
       * login
       * @param userName
       * @param password
       * @param isRemembered
       * @returns {*}
       */
      services.login = function (userName, password, isRemembered) {
        var $this = this;
        var deferred = $q.defer();
        var requestPayload = {
          username: userName,
          password: password,
          grant_type: "password",
          client_id: constant.app.client_id,
          client_secret: constant.app.client_secret
        };

        /**
         * transform request handler
         * @param obj
         * @returns {string}
         */
        function transformRequestHandler(obj) {
          var str = [];
          _.each(_.keys(obj), function (p) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          });
          return str.join("&");
        }

        $http({
          method: 'POST',
          url: constant.domain + '/token',
          headers: {
            //'Authorization': 'Basic ' + constant.app.basicode,
            "Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
          },
          transformRequest: transformRequestHandler,
          data: requestPayload
        }).then(function (resp) {
            if (resp.data) {
              // Save access token and refresh token
              userContext.setToken(resp.data.access_token, resp.data.refresh_token, isRemembered);

              $this.updateUserInfo().then(function () {
                  deferred.resolve();
              }, function (err) {
                  deferred.reject();
              });

              // deferred.resolve();
            } else {
              deferred.reject();
            }
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
      };

      /**
       * logout
       * @returns {*}
       */
      services.logout = function () {
        var deferred = $q.defer();
        $http.post(constant.domain + '/api/accounts/logout').then(function () {
            userContext.clearInfo();
            sessionStorage.removeItem('currentFilter');
            deferred.resolve();
        }, function () {
            userContext.clearInfo();
            deferred.resolve();
        });
        return deferred.promise;
      };

      /**
       * update user info
       * @param forceUpdate
       * @returns {*}
       */
      services.updateUserInfo = function (forceUpdate) {
        var deferred = $q.defer();
        this.getUserInfo().success(function (userInfo) {
            var permissions = userInfo.role || null;

            // Seperate permission from user info
            delete userInfo.role;

            // Seperate user library from user info
            delete userInfo.library;

            // Seperate user organization from user info
            delete userInfo.ownerOrganization;

            // save user info to localstorage
            userContext.fillInfo(userInfo, true);

            userContext.updatePermissions(permissions);

            deferred.resolve();
          }).error(function (err) {
            deferred.reject();
        });

        return deferred.promise;
      };

      /**
       * update profile
       * @param model
       * @returns {HttpPromise}
       */
      services.updateProfile = function (model) {
        var putModel = angular.copy(model);
        putModel.avatarUrl = model.avatarUrl ? angular.copy(model.avatarUrl.fileUrl) : null;

        return $http.put(constant.domain + '/api/accounts/profile', putModel, {
          message: "MESSAGES.UPDATED_SUCCESSFUL"
        });
      };

      /**
       * update avatar
       * @param file
       * @param userId
       * @returns {*}
       */
      services.updateAvatar = function (file, userId) {
        var data = {
          file: file
        };

        if (userId) {
          angular.extend(data, {
            userId: userId
          });
        }

        // type of upload user avatar = 0
        return Upload.upload({
          url: constant.domain + '/api/common/upload/1',
          data: data,
          message: "MESSAGES.UPDATED_AVATAR_SUCCESSFUL"
        });
      };

      /**
       * get user info
       * @returns {HttpPromise}
       */
      services.getUserInfo = function () {
        return $http.get(constant.domain + '/api/accounts/profile', {
          hideErrorMessage: true
        });
      };

      /**
       * forgot password
       * @param email
       * @returns {HttpPromise}
       */
      services.forgotPassword = function (email) {
        var model = {
          email: email
        };
        return $http.post(constant.domain + '/api/accounts/forgotpassword', model, {
          headers: {
            'Authorization': 'Basic ' + constant.app.basicode
          },
          "disableAuthorization": true,
          hideErrorMessage: true
        });
      };

      /**
       * check reset password link
       * @param userId
       * @param code
       * @returns {HttpPromise}
       */
      services.checkResetPasswordLink = function (userId, code) {
        return $http.get(constant.domain + '/api/accounts/resetpassword', {
          params: {
            userId: userId,
            code: code
          },
          headers: {
            'Authorization': 'Basic ' + constant.app.basicode
          },
          "disableAuthorization": true,
          hideErrorMessage: true
        });
      };

      /**
       * reset password
       * @param model
       * @returns {HttpPromise}
       */
      services.resetPassword = function (model) {
        return $http.post(constant.domain + '/api/accounts/resetpassword', model, {
          headers: {
            'Authorization': 'Basic ' + constant.app.basicode
          },
          "disableAuthorization": true,
          "autoAlert": false
        });
      };

      /**
       * change password
       * @param model
       * @returns {HttpPromise}
       */
      services.changePassword = function (model) {
        var putModel = {
          "currentPassword": "",
          "newPassword": "",
          "confirmPassword": ""
        };
        putModel.currentPassword = angular.copy(model.oldPassword);
        putModel.newPassword = angular.copy(model.newPassword);
        putModel.confirmPassword = angular.copy(model.confirmPassword);

        return $http.put(constant.domain + '/api/accounts/password', putModel, {
          message: "PROFILE.UPDATE_PW_SUCCESS"
        });
      };

      /**
       * check user role
       * @param roles
       * @returns {number}
       */
      services.checkRole = function (roles) {
        var role = userContext.getPermissions();
        return _.intersection([role], roles).length;
      };

      return services;
    }
  ]);
  return module.name;
});
