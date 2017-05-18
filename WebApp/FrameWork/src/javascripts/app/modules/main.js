define(function (require) {
  'use strict';

  var angular = require('angular');

  return angular
    .module('app.modules', [
      require('./page/page'),
      require('./main/main'),
      require('./navbar/navbar'),
      require('./aside/aside'),
      require('./signin/signin'),
      require('./home/home'),
      require('./profile/profile'),
      require('./forgotPassword/forgotPassword'),
      require('./resetPassword/resetPassword'),
      require('./changePassword/changePassword'),
      require('./area/area'),
      require('./user/user'),
      require('./tag/tag'),
      require('./potentialCause/potentialCause'),
      require('./symptom/symptom'),
      require('./troubleshoot/troubleshoot'),
      require('./issue/issue'),
      require('./line/line'),
      require('./machine/machine'),
      require('./component/component'),
      require('./favorite/favorite'),
      require('./notification/notification'),
      require('./treeView/treeView'),
      require('./howToUse/howToUse')
    ])
    .name;
});
