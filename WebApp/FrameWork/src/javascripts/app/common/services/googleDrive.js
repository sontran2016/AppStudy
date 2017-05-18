define(function(require) {
  'use strict';
  var angular = require('angular'),
    gapi = require('gapi');

  var module = angular.module('common.services.googleDrive', []);

  module.factory('googleDriveFactory', [
    'appConstant',
    '$q',
    'storage',
    '$http',
    'utilFactory',
    function(constant,
             $q,
             storage,
             $http,
             utilFactory) {
      var service = {},
        isAuthorized = false,
        isLogged = false,
        token = null;

      /**
       * load auth
       */
      function loadAuth() {
        var authData = storage.get('GoogleDriveAuthentication');
        isAuthorized = authData ? authData.isAuthorized : false;
        token = authData ? authData.token : null;
      }

      /**
       * check is auth
       * @returns {boolean}
       */
      service.isAuth = function() {
        loadAuth();
        return isAuthorized;
      };

      /**
       * clear auth
       */
      service.clearAuth = function() {
        isAuthorized = false;
        isLogged = false;
        token = null;
        storage.set('GoogleDriveAuthentication', null);
      };

      /**
       * validate token
       * @returns {*}
       */
      service.validateToken = function() {
        var deferred = $q.defer();
        loadAuth();

        if(isAuthorized && token) {
          $http.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
              params: {
                access_token: token
              }
            })
            .success(function(resp) {
              if(angular.isDefined(resp.expires_in)) {
                deferred.resolve();
              } else {
                isAuthorized = false;
                isLogged = false;
                token = null;
                deferred.reject();
              }
            })
            .error(function(err) {
              console.log(err);
              isAuthorized = false;
              isLogged = false;
              token = null;
              deferred.reject();
            });
        }
        else {
          isAuthorized = false;
          isLogged = false;
          token = null;
          deferred.reject();
        }
        return deferred.promise;
      };

      /**
       * authorize
       * @returns {*}
       */
      service.authorize = function() {
        var deferred = $q.defer();

        /**
         * handle auth result
         * @param authResult
         */
        function handleAuthResult(authResult) {
          if(authResult && !authResult.error) {
            // Hide auth UI, then load client library.
            isAuthorized = true;
            isLogged = true;
            token = authResult.access_token;
            storage.set('GoogleDriveAuthentication', {
              isAuthorized: isAuthorized,
              token: token
            });
            deferred.resolve();
          } else {
            // Show auth UI, allowing the user to initiate authorization by
            // clicking authorize button.
            deferred.reject();
          }
        }

        if(!isLogged) {
          gapi.auth.authorize(
            {
              client_id: constant.googleDriveClientId,
              scope: constant.googleDriveScope,
              immediate: isAuthorized
            },
            handleAuthResult);
        }
        else {
          deferred.resolve();
        }

        return deferred.promise;
      };

      /**
       * load files
       * @param q
       * @param nextPageToken
       * @returns {*}
       */
      service.loadFiles = function(q, nextPageToken) {
        var deferred = $q.defer();

        /**
         * list files
         */
        function listFiles() {
          var payload = {
            'maxResults': 10
          };

          if(nextPageToken) {
            payload.pageToken = nextPageToken;
          }

          if(q) {
            payload.q = q;
          }

          payload.access_token = token;

          $http.get(constant.domain + '/api/external/file/googledrive', {
              params: payload
            })
            .success(function(resp) {
              deferred.resolve({
                files: resp.data.items,
                isMore: angular.isDefined(resp.data.nextLink),
                nextPageToken: resp.data.nextPageToken
              });
            })
            .error(function(err) {
              deferred.reject(err);
            });

          //var request = gapi.client.drive.files.list(payload);
          //
          //request.execute(function(resp) {
          //  nextPageToken = resp.nextPageToken;
          //  deferred.resolve(resp.items);
          //});
        }
        service.authorize()
          .then(function() {
            gapi.client.load('drive', 'v2', listFiles);
          }, function() {
            isAuthorized = false;
            isLogged = false;
            token = '';
            storage.set('GoogleDriveAuthentication', {
              isAuthorized: isAuthorized,
              token: token
            });
            deferred.reject();
          });
        return deferred.promise;
      };

      /**
       * download files
       * @param url
       * @param fileName
       * @returns {HttpPromise}
       */
      service.downloadFile = function(url, fileName) {
        var downloadUrl = url;
        if(url.indexOf('?') > -1) {
          downloadUrl = downloadUrl + '&access_token=' + token;
        }
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

      /**
       * get root folder id
       * @returns {*}
       */
      service.getRootFolderId = function() {
        var deferred = $q.defer();
        $http.get('https://www.googleapis.com/drive/v2/about', {
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(resp) {
          deferred.resolve(resp.data);
        }, function(error) {
          if(error.status === 401) {
            // Clear authorized status
            service.clearAuth();

            // Re-Authorize
            service.authorize()
              .then(function() {
                // Try to get root folder id again
                service.getRootFolderId()
                  .then(function(rr) {
                    deferred.resolve(rr);
                  }, function(err) {
                    console.log(err);
                    // Clear authorized status
                    service.clearAuth();
                    deferred.reject();
                  });
              });
          }
        });
        return deferred.promise;
      };

      /**
       * get file details
       * @param fileId
       * @returns {HttpPromise}
       */
      service.getFileDetails = function(fileId) {
        loadAuth();
        return $http.get('https://www.googleapis.com/drive/v2/files/' + fileId, {
          params: {
            'access_token': token
          }
        });
      };

      return service;
    }
  ]);
  return module.name;
});
