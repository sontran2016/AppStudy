define(function(require) {
  'use strict';
  var angular = require('angular');

  var module = angular.module('common.directives',
    [
      require('./autoFocus'),
      require('./autoGrow'),
      require('./noBreak'),
      require('./uiToggleClass'),
      require('./validFile'),
      require('./pageBodyClass'),
      require('./ajaxLoading/ajaxLoading'),
      require('./malihuScrollBar'),
      require('./updateTitle'),
      require('./kendo/cKendoDatepicker'),
      require('./uploadBox/uploadBox'),
      require('./spinner'),
      require('./kendo/cKendoMultiSelect'),
      require('./kendo/cKendoChart'),
      require('./kendo/cKendoEditor'),
      require('./customRating/customRating'),
      require('./userAvatar'),
      require('./stopLoader'),
      require('./iCheck'),
      require('./permission'),
      require('./fileUrl/fileUrl'),
      require('./fileImage/fileImage'),
      require('./confirmDelete'),
      require('./numericOnly'),
      require('./editor/editor'),
      require('./ngTable/cNgTable'),
      require('./previewTemplate/previewTemplate')
    ]);

  return module.name;
});
