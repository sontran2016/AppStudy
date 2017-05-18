define(function (require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('app.config', []);

  module.run([
    '$rootScope',
    'userContext',
    '$location',
    'accountFactory',
    function ($rootScope,
              userContext,
              $location,
              accountFactory) {
      // Validate Authorization Page
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {


        if (toState.permission && !accountFactory.checkRole(toState.permission)) {
          // user have no permission to access
          userContext.clearInfo();
          $location.path('/page/signin');
        }

        if (userContext.authentication().isAuth || toState.authorization === false) {

        } else {
          userContext.clearInfo();
          $location.path('/page/signin');
        }
      });
    }]);

  module.constant('appConstant', {
    //domain: 'http://192.168.1.224:58746',
    //domain: 'http://nois.newoceaninfosys.com:1236',
    //domain: 'http://localhost:4379',
    domain: 'http://nois.newoceaninfosys.com:8088',
    version: '1.0.7', // DO NOT DELETE THIS
    encryptKey: "xeWnYqz0ihOe-L36Qxwf5W0FBMcW0Lp6rlxjIEMAA3SZ4El6Hy9Wx-ZofzfdizqQtW_66uqf-3Fg4RuqXzF0ssmkSPLstXurlMn-lV5djKwbCqtMq93ttTwUoR49M4d6p5aRcTuMTI6R-Zx6ESM52idxQv-Bb06RmYTeEXAZABe0XAJ8P0pyTVONFTpU7KFdO5UU9y42DHytI5b4RcBGQootl4BImrq4hRZJfdlptc6nz3djQqN5HkgSTt69jWWTXLkgB0hAFuIkMX43QMpvMQkiKwbDYrMZnIZXuCXSdAC_zmYvHz1rqvo9CJMJYLrZMbSpez1kHUnhHeZudzj-IVpT3VzNdI3DOAaDB6IziHBdnJSkx6LfXVccsLpGJxvq2_DWZmDUzrVHif8G9veRK_e5qlp7A5WPmFY7CqYE1Ne_LhZNXXNQeZWDwgxA6_1qPBDeiIW8uIn0ZPi9VMjv6heX_teO64ZJ4TPlRAq8iF4KSNfnrSS0eWzvkKNbNjGAkBuA71OyEj8LbLe-DNHs9w",
    azureBlob: 'https://amssystem.blob.core.windows.net/avatar/{userId}/1',
    googleDriveClientId: '859146111921-2u4b2phe6ballqlaf8i0ttfqhftclvmh.apps.googleusercontent.com',
    googleDriveScope: ['https://www.googleapis.com/auth/drive'],
    boxClientId: 't5sfo0x515refc4tx9e13xy7p9n48v7q',
    boxClientSecret: 'mnIGltu4VmpzAHSYNaPQCNt2ZpEMmG5Z',
    dropBoxClientId: 'qmrfotonkpkkwh8',
    numberRegex: /^\d+$/,
    app: {
      dateFormat: 'dd/MM/yyyy',
      fullDateFormat: 'MM-DD-YYYY hh:mm:ss A',
      client_id: "f1c37899-1997-47e9-91d4-493e9dd286e8",
      client_secret: "cfb846bd-8220-4172-8663-af7faff95d6a",
      basicode: "ZjFjMzc4OTktMTk5Ny00N2U5LTkxZDQtNDkzZTlkZDI4NmU4OmNmYjg0NmJkLTgyMjAtNDE3Mi04NjYzLWFmN2ZhZmY5NWQ2YQ==",
      dateTimeFormat: 'DD-MM-YYYY HH:mm'
    },
    allowAvatarFileSize: 1048576,
    allowAvatarFileType: 'image/jpeg,image/pjpeg,image/png',
    timeOut: 600000
  });

  return module.name;
});
