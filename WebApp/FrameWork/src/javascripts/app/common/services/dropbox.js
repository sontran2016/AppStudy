define(function(require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.services.dropBox', []);

  module.factory('dropBoxFactory', [
    'appConstant',
    '$q',
    '$http',
    'storage',
    'utilFactory',
    function(constant,
             $q,
             $http,
             storage,
             utilFactory) {
      var service = {},
        token,
        clientId = constant.dropBoxClientId,
        returnUrl = encodeURIComponent('http://' + window.location.host);

      /**
       * load auth data
       */
      function loadAuthData() {
        var authData = storage.get('DropBoxAuthentication');
        if(authData) {
          token = authData.access_token;
        }
      }

      /**
       * check is auth
       * @returns {boolean}
       */
      service.isAuth = function() {
        loadAuthData();
        return angular.isDefined(token);
      };

      /**
       * revoke
       */
      service.revoke = function() {
        loadAuthData();
        if(token) {
          $http.post('https://api.dropboxapi.com/1/disable_access_token', null, {
            headers: {
              "Authorization": "Bearer " + token
            }
          });
        }
      };

      /**
       * authorize
       * @returns {*}
       */
      service.authorize = function() {
        var deferred = $q.defer();
        loadAuthData();

        if(token) {
          deferred.resolve();
          return deferred.promise;
        }

        /**
         * oauth return
         * @param e
         * @param a
         * @constructor
         */
        function OauthReturn(e, a) {
          window.removeEventListener('OauthReturn', OauthReturn);
          token = e.detail.access_token;
          storage.set('DropBoxAuthentication', {access_token: token});
          deferred.resolve();
        }

        window.open('https://www.dropbox.com/1/oauth2/authorize?response_type=token&client_id=' + clientId + '&redirect_uri=' + returnUrl, 'DropBox Authentication', 'height=500,width=500');
        window.addEventListener('OauthReturn', OauthReturn);
        return deferred.promise;
      };

      /**
       * load data
       * @param path
       * @param take
       * @returns {*}
       */
      service.loadData = function(path, take) {
        var deferred = $q.defer();
        service.authorize()
          .then(function() {
            $http.get(constant.domain + '/api/external/file/dropbox', {
                params: {
                  file_limit: take,
                  path: encodeURIComponent(path),
                  access_token: token
                }
              })
              .success(function(resp) {
                deferred.resolve(resp.data);
              })
              .error(function(err) {
                deferred.reject(err);
              });
          });
        return deferred.promise;
      };

      /**
       * download file
       * @param url
       * @param fileName
       * @returns {HttpPromise}
       */
      service.downloadFile = function(url, fileName) {
        var downloadUrl = url;
        downloadUrl = downloadUrl + '?access_token=' + token;
        return $http.post(constant.domain + '/api/upload/external', {
          uuid: utilFactory.newGuid(),
          fileName: fileName,
          url: downloadUrl
        }, {
          headers: {
            'content-type': 'application/json'
          }
        });
      };

      return service;
    }
  ]);
  return module.name;
});
