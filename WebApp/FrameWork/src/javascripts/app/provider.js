define(function (require) {
  'use strict';

  var angular = require('angular'),
    _ = require('lodash');

  var module = angular.module('app.provider', []);

  module.config([
    '$locationProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$breadcrumbProvider',
    'cfpLoadingBarProvider',
    '$stateProvider',
    '$provide',
    '$translateProvider',
    '$translatePartialLoaderProvider',
    'appSettingsProvider',
    function ($locationProvider,
              $urlRouterProvider,
              $httpProvider,
              $breadcrumbProvider,
              cfpLoadingBarProvider,
              $stateProvider,
              $provide,
              $translateProvider,
              $translatePartialLoaderProvider,
              appSettingsProvider) {

      //Enable cross domain calls
      $httpProvider.defaults.useXDomain = true;
      //httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*templates.*/, /ajaxLoadingTemplate/, /editorAttachmentTpl/, /editorTpl/, /uploadBoxTpl/, /uploadBoxModalTpl/, /collaborationTpl/, /messageItemTpl/, /mapWindowDirectiveTpl/, /.*html/, /token/]);
      //$httpProvider.defaults.headers.Origin = 'null';


      ///////////////////////////////////////////////////////////
      ///////////////// BREADCRUMB CONFIGURATION ///////////////
      //////////////////////////////////////////////////////////

      $breadcrumbProvider.setOptions({
        prefixStateName: 'app.home',
        templateUrl: 'javascripts/app/common/templates/breadcrumbs.html'
      });

      ///////////////////////////////////////////////////////////
      /////////////// END BREADCRUMB CONFIGURATION //////////////
      //////////////////////////////////////////////////////////


      ///////////////////////////////////////////////////////////
      //////////////// LOADING BAR CONFIGURATION ///////////////
      //////////////////////////////////////////////////////////

      // Loading bar
      cfpLoadingBarProvider.includeSpinner = false;
      cfpLoadingBarProvider.includeBar = false;

      ///////////////////////////////////////////////////////////
      ////////////// END LOADING BAR CONFIGURATION /////////////
      //////////////////////////////////////////////////////////


      ///////////////////////////////////////////////////////////
      //////////////// DECORATE $STATE SERVICE ////////////////
      //////////////////////////////////////////////////////////

      // Custom $stateProvider method
      $provide.decorator('$state', [
        '$delegate',
        '$rootScope',
        function ($delegate,
                  $rootScope) {
          $rootScope.$on('$stateChangeStart', function (event, state, params, fromState, fromParams) {
            $delegate.next = state;
            $delegate.toParams = params;
            $delegate.previous = fromState;
            $delegate.fromParams = fromParams;
            if (!fromState.name && (!angular.isDefined(state.authorization) || state.authorization) && !$rootScope.saveState) {
              $rootScope.saveState = {
                state: state,
                params: params
              };
            }
          });
          return $delegate;
        }]);

      $stateProvider.$state = function (name, options) {
        options.resolve = options.resolve || {};

        options.resolve.permission = [
          'userContext',
          '$q',
          'accountFactory',
          '$state',
          '$rootScope',
          '$location',
          function (userContext,
                    $q,
                    accountFactory,
                    $state,
                    $rootScope,
                    $location) {
            //
            // var auth = userContext.authentication();
            // var user = auth.userData;

            var deferred = $q.defer();
            if (options.permission && !accountFactory.checkRole(options.permission)) {
              // user have no permission to access
              userContext.clearInfo();
              $location.path('/page/signin');
            } else {
              deferred.resolve();
            }
            return deferred.promise;
          }
        ];
        return $stateProvider.state(name, options);
      };

      ///////////////////////////////////////////////////////////
      /////////////// END DECORATE $STATE SERVICE ///////////////
      //////////////////////////////////////////////////////////


      ///////////////////////////////////////////////////////////
      ////////////// MULTI-LANGUAGE CONFIGURATION //////////////
      //////////////////////////////////////////////////////////

      $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/il8n/{lang}.json'
      });

      $translatePartialLoaderProvider.addPart('javascripts/app');

      // make sure all values used in translate are sanitized for security
      $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

      // cache translation files to save load on server
      $translateProvider.useLoaderCache(true);

      // setup available languages in translate
      var languageKeys = [],
        APP_LANGUAGES = [{
          name: 'LANGUAGES.ENGLISH',
          key: 'en'
        }];


      _.each(APP_LANGUAGES, function (lang) {
        languageKeys.push(lang.key);
      });

      /**
       *  try to detect the users language by checking the following
       *      navigator.language
       *      navigator.browserLanguage
       *      navigator.systemLanguage
       *      navigator.userLanguage
       */
      $translateProvider
        .registerAvailableLanguageKeys(languageKeys, {
          'en_US': 'en',
          'en_UK': 'en'
        })
        .use('en');

      // Default settings
      // set app name & logo (used in loader, sidemenu, login pages, etc)
      appSettingsProvider.setName('Etroubleshooting');
      appSettingsProvider.setLogo('img/logo.png');
      // set current version of app (shown in footer)
      appSettingsProvider.setVersion('1.0.1');

      // setup available languages
      _.each(APP_LANGUAGES, function (lang) {
        appSettingsProvider.addLanguage({
          name: lang.name,
          key: lang.key
        });
      });

      ///////////////////////////////////////////////////////////
      //////////// END MULTI-LANGUAGE CONFIGURATION ////////////
      //////////////////////////////////////////////////////////


      ///////////////////////////////////////////////////////////
      ///////////////////// INTERCEPTORS ///////////////////////
      //////////////////////////////////////////////////////////

      // Authorization header
      $httpProvider.interceptors.push([
        'userContext',
        '$rootScope',
        function (userContext,
                  $rootScope) {
          return {
            request: function (config) {
              if (config.url && /\/token$/.test(config.url)) {
                return config;
              }

              if (!angular.isDefined(config.disableAuthorization) || config.disableAuthorization === false) {
                config.headers["Authorization"] = 'Bearer ' + userContext.authentication().token;
              }
              return config;
            }
          }
        }]);

      $httpProvider.interceptors.push([
        '$q',
        'toaster',
        'appConstant',
        'userContext',
        '$injector',
        function ($q,
                  toaster,
                  constant,
                  userContext,
                  $injector) {
          return {
            request: function (config) {
              var excludeUrls = [
                'ajaxLoadingTemplate',
                'editorAttachmentTpl',
                'messageItemTpl',
                'uploadBoxTpl'
              ];

              // Convert all exclude urls to lowercase
              excludeUrls = _.map(excludeUrls, function (el) {
                return el.toLowerCase();
              });

              if (!/\.(json|html|js)$/.test(config.url) // Exclude json, html and js file
                && !config.ignoreCacheBuster // Force exclude
                && excludeUrls.indexOf(config.url.toLowerCase()) === -1 // Exclude special urls
              ) {
                if (config.url.indexOf('?') > -1) {
                  config.url += '&';
                } else {
                  config.url += '?';
                }
                config.url += '_v=' + constant.version;
              }
              return config;
            },
            response: function (response) {
              var $translate = $injector.get('$translate');
              if (response.config.message) {
                toaster.pop('success', $translate.instant(response.config.message));
              }
              return $q.resolve(response);
            },
            responseError: function (response) {
              var inflightAuthRequest = null;
              if (angular.isObject(response) && response.config && (response.config.url.indexOf(constant.domain) > -1)) {
                if (response.status === 400 && response.data != null) {
                  var errorMsg = null;
                  if (angular.isString(response.data))
                    errorMsg = response.data;
                  else if (angular.isString(response.data.error_description))
                    errorMsg = response.data.error_description;
                  else if (angular.isString(response.data.errorMessage))
                    errorMsg = response.data.errorMessage;
                  else if (angular.isObject(response.data.errorMessages)) {
                    errorMsg = '';
                    var key,
                      i,
                      prefix = '',
                      count = 0,
                      modelState = response.data.errorMessages;
                    for (key in modelState) {
                      if (modelState.hasOwnProperty(key)) {
                        if (angular.isString(modelState[key])) {
                          count++;
                        } else if (angular.isArray(modelState[key])) {
                          for (i = 0; i < modelState[key].length; i++) {
                            if (angular.isString(modelState[key][i])) {
                              count++;
                              if (count >= 2) break;
                            }
                          }
                        }
                        if (count >= 2) {
                          prefix = '- ';
                          break;
                        }
                      }
                    }
                    for (key in modelState) {
                      if (modelState.hasOwnProperty(key)) {
                        if (angular.isString(modelState[key])) {
                          errorMsg += prefix + modelState[key] + ' </br>';
                        } else if (angular.isArray(modelState[key])) {
                          for (i = 0; i < modelState[key].length; i++) {
                            if (angular.isString(modelState[key][i])) {
                              errorMsg += prefix + modelState[key][i] + ' </br>';
                            }
                          }
                        }
                      }
                    }
                    //if (errorMsg.indexOf('\n') > 0) {
                    //    errorMsg = prefix + errorMsg;
                    //    errorMsg.replace(/\n/g, '\n' + prefix);
                    //}
                  }
                  else if (angular.isString(response.data.message))
                    errorMsg = response.data.message;
                  else if (angular.isString(response.data.Message))
                    errorMsg = response.data.Message;
                  else if (angular.isString(response.data.error))
                    errorMsg = response.data.error;

                  if (errorMsg != null && errorMsg !== '') {
                    if (!response.config.hideErrorMessage) {
                      toaster.pop({
                        type: 'error',
                        title: 'Error',
                        body: errorMsg,
                        bodyOutputType: 'trustedHtml'
                      });
                    }
                    response.config.diplayedErrorMessage = true;
                  }

                  return $q.reject(response);

                }
                if (response.status === 401) {
                  ////toaster.pop('error', "Permission denied", "You have no permission to access this. Please contact your administrator");
                  //var deferred = $q.defer();
                  //if (!inflightAuthRequest) {
                  //  inflightAuthRequest = $injector.get("$http").post(constant.domain + '/token', "grant_type=refresh_token&refresh_token=" + userContext.authentication().refresh_token, {
                  //    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                  //  });
                  //}
                  //inflightAuthRequest.then(function (r){
                  //  console.log(r);
                  //  inflightAuthRequest = null;
                  //  if (r.data && r.data.access_token && r.data.refresh_token && r.data.expires_in) {
                  //    userContext.setToken(r.data.access_token, r.data.refresh_token, true);
                  //    $injector.get("$http")(response.config).then(function (resp){
                  //      deferred.resolve(resp);
                  //    }, function (err){
                  //      deferred.reject();
                  //    });
                  //  } else {
                  //    deferred.reject();
                  //  }
                  //}, function (er){
                  //  inflightAuthRequest = null;
                  //  deferred.reject();
                  //  userContext.clearInfo();
                  //  $injector.get("$state").go('page.signin');
                  //});
                  //return deferred.promise;
                  userContext.clearInfo();
                  $injector.get("$state").go('page.signin');
                }
              }

              return $q.reject(response);
            }
          }
        }]);


      ///////////////////////////////////////////////////////////
      /////////////////// END INTERCEPTORS //////////////////////
      //////////////////////////////////////////////////////////


      //Remove the header used to identify ajax call  that would prevent CORS from working
      delete $httpProvider.defaults.headers.common['X-Requested-With'];

      // Default route configuration
      $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
      });

      // Default route
      $urlRouterProvider.otherwise("/app/home");
    }
  ]);

  return module.name;
});
