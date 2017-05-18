define(function (require) {
  'use strict';
  var angular = require('angular');
  return angular.module('common.services.notifications', [])
    .factory('notifications', [
      '$rootScope',
      function ($rootScope) {
        // private notification messages
        // If you make a new notification you will add it here
        // we should use this service only for notifications
        var _START_REQUEST_ = '_START_REQUEST_',
          _END_REQUEST_ = '_END_REQUEST_',
          _LOGIN_SUCCESS_ = '_LOGIN_SUCCESS_',
          _LOGOUT_SUCCESS_ = '_LOGOUT_SUCCESS_',
          _CLOSE_WINDOW_ = '_CLOSE_WINDOW_',
          _RADIAL_SEARCH_ = '_RADIAL_SEARCH_',
          _END_DOCK_ = '_END_DOCK_',
          _MESSAGE_CREATED = '_MESSAGE_CREATED',
          _IMAGE_AVATAR_CHANGED = '_IMAGE_AVATAR_CHANGED',
          _OPEN_ITEM_ = '_OPEN_ITEM_',
          _MAP_PREVIEW_ = '_MAP_PREVIEW_',
          _LIBRARY_CHANGED_ = '_LIBRARY_CHANGED_',
          _MESSAGE_FOCUS_ = '_MESSAGE_FOCUS_',
          _ISSUE_COUNT_CHANGE_ = '_ISSUE_COUNT_CHANGE_',
          _TROUBLESHOOT_COUNT_CHANGE_ = '_TROUBLESHOOT_COUNT_CHANGE_',
          _TROUBLE_COUNT_CHANGE_ = '_TROUBLE_COUNT_CHANGE_',


          /**
           * request started
           */
          requestStarted = function () {
            $rootScope.$broadcast(_START_REQUEST_);
          },
          /**
           * request ended
           */
          requestEnded = function () {
            $rootScope.$broadcast(_END_REQUEST_);
          },
          /**
           * login success
           * @param args
           */
          loginSuccess = function (args) {
            $rootScope.$broadcast(_LOGIN_SUCCESS_, args);
          },
          /**
           * logout success
           * @param args
           */
          logoutSuccess = function (args) {
            $rootScope.$broadcast(_LOGOUT_SUCCESS_, args);
          },
          /**
           * on request started
           * @param $scope
           * @param handler
           */
          onRequestStarted = function ($scope, handler) {
            $scope.$on(_START_REQUEST_, function (event) {
              handler();
            });
          },
          /**
           * on login success
           * @param $scope
           * @param handler
           */
          onLoginSuccess = function ($scope, handler) {
            $scope.$on(_LOGIN_SUCCESS_, function (event, args) {
              handler(args);
            });
          },
          /**
           * on logout success
           * @param handler
           */
          onLogoutSuccess = function (handler) {
            $rootScope.$on(_LOGOUT_SUCCESS_, function (event, args) {
              handler(args);
            });
          },
          /**
           * on request ended
           * @param $scope
           * @param handler
           */
          onRequestEnded = function ($scope, handler) {
            $scope.$on(_END_REQUEST_, function (event) {
              handler();
            });
          },

          /**
           * close window
           * @param args
           */
          closeWindow = function (args) {
            $rootScope.$broadcast(_CLOSE_WINDOW_, args);
          },
          /**
           * on close window
           * @param $scope
           * @param handler
           */
          onCloseWindow = function ($scope, handler) {
            $scope.$on(_CLOSE_WINDOW_, function (event) {
              handler();
            });
          },
          /**
           * radial search
           * @param args
           */
          radialSearch = function (args) {
            $rootScope.$broadcast(_RADIAL_SEARCH_, args);
          },
          /**
           * on radial search
           * @param $scope
           * @param handler
           */
          onRadialSearch = function ($scope, handler) {
            $scope.$on(_RADIAL_SEARCH_, function (event, args) {
              handler(args);
            });
          },
          /**
           * end dock window
           * @param args
           */
          endDockWindow = function (args) {
            $rootScope.$broadcast(_END_DOCK_, args);
          },
          /**
           * on end dock window
           * @param $scope
           * @param handler
           */
          onEndDockWindow = function ($scope, handler) {
            $scope.$on(_END_DOCK_, function (event) {
              handler();
            });
          },
          /**
           * message created
           * @param args
           */
          messageCreated = function (args) {
            $rootScope.$broadcast(_MESSAGE_CREATED, args);
          },
          /**
           * on message created
           * @param $scope
           * @param handler
           */
          onMessageCreated = function ($scope, handler) {
            $scope.$on(_MESSAGE_CREATED, function (event, args) {
              handler(args);
            });
          },
          /**
           * 
           * @param args
           */
          imageAvatarChanged = function (args) {
            $rootScope.$broadcast(_IMAGE_AVATAR_CHANGED, args);
          },
          /**
           * on image avatar changed
           * @param $scope
           * @param handler
           */
          onImageAvatarChanged = function ($scope, handler) {
            $scope.$on(_IMAGE_AVATAR_CHANGED, function (event, args) {
              handler(args);
            });
          },
          /**
           * open item
           * @param args
           */
          openItem = function (args) {
            $rootScope.$broadcast(_OPEN_ITEM_, args);
          },
          /**
           * on open item
           * @param $scope
           * @param handler
           */
          onOpenItem = function ($scope, handler) {
            $scope.$on(_OPEN_ITEM_, function (event, args) {
              handler(args);
            });
          },
          /**
           * map preview
           * @param args
           */
          mapPreview = function (args) {
            $rootScope.$broadcast(_MAP_PREVIEW_, args);
          },
          /**
           * on map preview
           * @param $scope
           * @param handler
           */
          onMapPreview = function ($scope, handler) {
            $scope.$on(_MAP_PREVIEW_, function (event, args) {
              handler(args);
            });
          },
          /**
           * library changed
           * @param args
           */
          libraryChanged = function (args) {
            $rootScope.$broadcast(_LIBRARY_CHANGED_, args);
          },
          /**
           * on library changed
           * @param $scope
           * @param handler
           */
          onLibraryChanged = function ($scope, handler) {
            $scope.$on(_LIBRARY_CHANGED_, function (event, args) {
              handler(args);
            });
          },
          /**
           * issue count change
           * @param args
           */
          issueCountChanged = function (args) {
            $rootScope.$broadcast(_ISSUE_COUNT_CHANGE_, args);
          },
          /**
           * on issue count changed
           * @param $scope
           * @param handler
           */
          onIssueCountChanged = function ($scope, handler) {
            $scope.$on(_ISSUE_COUNT_CHANGE_, function (event, args) {
              handler(args);
            });
          },
          /**
           * issue count change
           * @param args
           */
          troubleshootCountChanged = function (args) {
            $rootScope.$broadcast(_TROUBLESHOOT_COUNT_CHANGE_, args);
          },
          /**
           * on issue count changed
           * @param $scope
           * @param handler
           */
          onTroubleshootCountChanged = function ($scope, handler) {
            $scope.$on(_TROUBLESHOOT_COUNT_CHANGE_, function (event, args) {
              handler(args);
            });
          },
          /**
           * trouble count change
           * @param args
           */
          troubleCountChanged = function (args) {
            $rootScope.$broadcast(_TROUBLE_COUNT_CHANGE_, args);
          },
          /**
           * on trouble count changed
           * @param $scope
           * @param handler
           */
          onTroubleCountChanged = function ($scope, handler) {
            $scope.$on(_TROUBLE_COUNT_CHANGE_, function (event, args) {
              handler(args);
            });
          };

        return {
          requestStarted: requestStarted,
          requestEnded: requestEnded,
          loginSuccess: loginSuccess,
          onRequestStarted: onRequestStarted,
          onRequestEnded: onRequestEnded,
          onLoginSuccess: onLoginSuccess,
          logoutSuccess: logoutSuccess,
          onLogoutSuccess: onLogoutSuccess,
          closeWindow: closeWindow,
          onCloseWindow: onCloseWindow,
          radialSearch: radialSearch,
          onRadialSearch: onRadialSearch,
          endDockWindow: endDockWindow,
          onEndDockWindow: onEndDockWindow,
          messageCreated: messageCreated,
          onMessageCreated: onMessageCreated,
          imageAvatarChanged: imageAvatarChanged,
          onImageAvatarChanged: onImageAvatarChanged,
          openItem: openItem,
          onOpenItem: onOpenItem,
          mapPreview: mapPreview,
          onMapPreview: onMapPreview,
          libraryChanged: libraryChanged,
          onLibraryChanged: onLibraryChanged,
          issueCountChanged: issueCountChanged,
          onIssueCountChanged: onIssueCountChanged,
          troubleshootCountChanged: troubleshootCountChanged,
          onTroubleshootCountChanged: onTroubleshootCountChanged,
          troubleCountChanged: troubleCountChanged,
          onTroubleCountChanged: onTroubleCountChanged
        };
      }])
    .name;
});
