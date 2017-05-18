'use strict';
require.config({
  preserveLicenseComments: false,
  generateSourceMaps: false,
  // runtime paths and shims
  paths: {
    // Reference, below libraries wont be combined
    'jquery': '../bower_components/jquery/dist/jquery',
    'angular': '../bower_components/angular/angular',

    // Include
    'kendo.core': '../js/kendo-ui/kendo.core',
    'kendo.editor': '../js/kendo-ui/kendo.editor',
    'kendo.angular': '../js/kendo-ui/kendo.angular',
    'kendo.datetimepicker': '../js/kendo-ui/kendo.datetimepicker',
    'kendo.multiselect': '../js/kendo-ui/kendo.multiselect',
    'kendo.splitter': '../js/kendo-ui/kendo.splitter',
    'kendo.numerictextbox': '../js/kendo-ui/kendo.numerictextbox',
    'kendo.treeview': '../js/kendo-ui/kendo.treeview',
    'kendo.datepicker': '../js/kendo-ui/kendo.datepicker',
    'kendo.timepicker': '../js/kendo-ui/kendo.timepicker',
    'kendo.grid': '../js/kendo-ui/kendo.grid',
    'kendo.resizable': '../js/kendo-ui/kendo.resizable',
    'kendo.list': '../js/kendo-ui/kendo.list',
    'kendo.mobile.scroller': '../js/kendo-ui/kendo.mobile.scroller',
    'kendo.data': '../js/kendo-ui/kendo.data',
    'kendo.treeview.draganddrop': '../js/kendo-ui/kendo.treeview.draganddrop',
    'kendo.columnsorter': '../js/kendo-ui/kendo.columnsorter',
    'kendo.editable': '../js/kendo-ui/kendo.editable',
    'kendo.window': '../js/kendo-ui/kendo.window',
    'kendo.filtermenu': '../js/kendo-ui/kendo.filtermenu',
    'kendo.columnmenu': '../js/kendo-ui/kendo.columnmenu',
    'kendo.groupable': '../js/kendo-ui/kendo.groupable',
    'kendo.pager': '../js/kendo-ui/kendo.pager',
    'kendo.selectable': '../js/kendo-ui/kendo.selectable',
    'kendo.combobox': '../js/kendo-ui/kendo.combobox',
    'kendo.dropdownlist': '../js/kendo-ui/kendo.dropdownlist',
    'kendo.colorpicker': '../js/kendo-ui/kendo.colorpicker',
    'kendo.imagebrowser': '../js/kendo-ui/kendo.imagebrowser',
    'kendo.filebrowser': '../js/kendo-ui/kendo.filebrowser',
    'kendo.calendar': '../js/kendo-ui/kendo.calendar',
    'kendo.popup': '../js/kendo-ui/kendo.popup',
    'kendo.sortable': '../js/kendo-ui/kendo.sortable',
    'kendo.reorderable': '../js/kendo-ui/kendo.reorderable',
    'kendo.mobile.actionsheet': '../js/kendo-ui/kendo.mobile.actionsheet',
    'kendo.mobile.pane': '../js/kendo-ui/kendo.mobile.pane',
    'kendo.ooxml': '../js/kendo-ui/kendo.ooxml',
    'kendo.excel': '../js/kendo-ui/kendo.excel',
    'kendo.progressbar': '../js/kendo-ui/kendo.progressbar',
    'kendo.pdf': '../js/kendo-ui/kendo.pdf',
    'kendo.color': '../js/kendo-ui/kendo.color',
    'kendo.dataviz.core': '../js/kendo-ui/kendo.dataviz.core',
    'kendo.dataviz.themes': '../js/kendo-ui/kendo.dataviz.themes',
    'kendo.drawing': '../js/kendo-ui/kendo.drawing',
    'kendo.userevents': '../js/kendo-ui/kendo.userevents',
    'kendo.draganddrop': '../js/kendo-ui/kendo.draganddrop',
    'kendo.fx': '../js/kendo-ui/kendo.fx',
    'kendo.data.odata': '../js/kendo-ui/kendo.data.odata',
    'kendo.binder': '../js/kendo-ui/kendo.binder',
    'kendo.data.xml': '../js/kendo-ui/kendo.data.xml',
    'kendo.validator': '../js/kendo-ui/kendo.validator',
    'kendo.mobile.loader': '../js/kendo-ui/kendo.mobile.loader',
    'kendo.mobile.view': '../js/kendo-ui/kendo.mobile.view',
    'kendo.mobile.popover': '../js/kendo-ui/kendo.mobile.popover',
    'kendo.mobile.shim': '../js/kendo-ui/kendo.mobile.shim',
    'kendo.menu': '../js/kendo-ui/kendo.menu',
    'kendo.slider': '../js/kendo-ui/kendo.slider',
    'kendo.listview': '../js/kendo-ui/kendo.listview',
    'kendo.view': '../js/kendo-ui/kendo.view',
    'kendo.upload': '../js/kendo-ui/kendo.upload',
    'kendo.dataviz.chart': '../js/kendo-ui/kendo.dataviz.chart'
  },

  shim: {
    'kendo.core': {
      deps: ['jquery', 'angular']
    },
    'kendo.editor': {
      deps: ['kendo.core']
    },
    'kendo.treeview': {
      deps: ['kendo.core']
    },
    'kendo.angular': {
      deps: ['kendo.core', 'angular']
    },
    'kendo.datepicker': {
      deps: ['kendo.core']
    },
    'kendo.timepicker': {
      deps: ['kendo.core']
    },
    'kendo.datetimepicker': {
      deps: ['kendo.datepicker', 'kendo.timepicker']
    },
    'kendo.draganddrop': {
      deps: ['kendo.core']
    },
    'kendo.multiselect': {
      deps: ['kendo.core']
    },
    'kendo.mobile.view': {
      deps: ['kendo.core']
    },
    'kendo.view': {
      deps: ['kendo.core']
    },
    'kendo.splitter': {
      deps: ['kendo.core']
    },
    'kendo.numerictextbox': {
      deps: ['kendo.core']
    },
    'kendo.grid': {
      deps: ['kendo.core']
    },
    'kendo.dataviz.chart': {
      deps: ['kendo.core']
    },
    'kendo.resizable': {
      deps: ['kendo.core']
    },
    'kendo.list': {
      deps: ['kendo.core']
    },
    'kendo.mobile.scroller': {
      deps: ['kendo.core']
    },
    'kendo.data': {
      deps: ['kendo.core']
    },
    'kendo.treeview.draganddrop': {
      deps: ['kendo.core']
    },
    'kendo.columnsorter': {
      deps: ['kendo.core']
    },
    'kendo.editable': {
      deps: ['kendo.core']
    },
    'kendo.window': {
      deps: ['kendo.core']
    },
    'kendo.filtermenu': {
      deps: ['kendo.core']
    },
    'kendo.columnmenu': {
      deps: ['kendo.core']
    },
    'kendo.groupable': {
      deps: ['kendo.core']
    },
    'kendo.pager': {
      deps: ['kendo.core']
    },
    'kendo.selectable': {
      deps: ['kendo.core']
    },
    'kendo.combobox': {
      deps: ['kendo.core']
    },
    'kendo.dropdownlist': {
      deps: ['kendo.core']
    },
    'kendo.colorpicker': {
      deps: ['kendo.core']
    },
    'kendo.imagebrowser': {
      deps: ['kendo.core']
    },
    'kendo.filebrowser': {
      deps: ['kendo.core']
    },
    'kendo.calendar': {
      deps: ['kendo.core']
    },
    'kendo.popup': {
      deps: ['kendo.core']
    },
    'kendo.sortable': {
      deps: ['kendo.core']
    },
    'kendo.reorderable': {
      deps: ['kendo.core']
    },
    'kendo.mobile.actionsheet': {
      deps: ['kendo.core']
    },
    'kendo.mobile.pane': {
      deps: ['kendo.core']
    },
    'kendo.ooxml': {
      deps: ['kendo.core']
    },
    'kendo.excel': {
      deps: ['kendo.core']
    },
    'kendo.progressbar': {
      deps: ['kendo.core']
    },
    'kendo.pdf': {
      deps: ['kendo.core']
    },
    'kendo.color': {
      deps: ['kendo.core']
    },
    'kendo.dataviz.core': {
      deps: ['kendo.core']
    },
    'kendo.dataviz.themes': {
      deps: ['kendo.core']
    },
    'kendo.drawing': {
      deps: ['kendo.core']
    },
    'kendo.userevents': {
      deps: ['kendo.core']
    },
    'kendo.fx': {
      deps: ['kendo.core']
    },
    'kendo.data.odata': {
      deps: ['kendo.core']
    },
    'kendo.binder': {
      deps: ['kendo.core']
    },
    'kendo.data.xml': {
      deps: ['kendo.core']
    },
    'kendo.validator': {
      deps: ['kendo.core']
    },
    'kendo.mobile.loader': {
      deps: ['kendo.core']
    },
    'kendo.mobile.popover': {
      deps: ['kendo.core']
    },
    'kendo.mobile.shim': {
      deps: ['kendo.core']
    },
    'kendo.menu': {
      deps: ['kendo.core']
    },
    'kendo.slider': {
      deps: ['kendo.core']
    },
    'kendo.listview': {
      deps: ['kendo.core']
    },
    'kendo.upload': {
      deps: ['kendo.core']
    }
  },
  include: [
    // 'kendo.core',
    'kendo.editor',
    'kendo.angular',
    'kendo.datetimepicker',
    'kendo.multiselect',
    'kendo.splitter',
    'kendo.numerictextbox',
    'kendo.grid',
    'kendo.dataviz.chart'
  ],
  exclude: [
    'jquery',
    'angular'
  ]
});
