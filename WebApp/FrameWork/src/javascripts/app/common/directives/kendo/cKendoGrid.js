define(function (require) {
  'use strict';
  var angular = require('angular'),
    _ = require('lodash'),
    jQuery = require("jquery"),
    module;
  module = angular.module('common.directives.cKendoGrid', []);
  module.directive('cKendoGrid', [
    'appConstant',
    'userContext',
    'toaster',
    '$timeout',
    function (constant,
              userContext,
              toaster,
              $timeout) {

      /**
       * link function
       * @param scope
       * @param elem
       * @param attrs
       */
      function linkFn(scope, elem, attrs) {

        // Origin data source
        // Add some default here if need
        var dataSource = {
          transport: {},
          batch: true,
          data: []
        };
        // Grid options
        // Add some default here if need
        // It will be overridden if declared
        var options = {
          pageable: {
            pageSizes: [10, 25, 50, 100]
          },
          sortable: true
        };

        /**
         * on click custom command button
         */
        var onClickCustomCommandBtn = function(){

        };

        // Normalize url function
        if (scope.vm.dataSourceConfig) {
          _.forOwn(scope.vm.dataSourceConfig, function (config, configName) {
            if (config.authorization) {
              config.headers = config.headers || {};
              var authData = userContext.authentication();
              if (authData.isAuth) {
                var token = authData.token;
                config.headers.Authorization = 'Bearer ' + token;
              }
            }
          });

          if (scope.vm.dataSourceConfig.data && scope.vm.dataSourceConfig.data.length) {
            dataSource.data = scope.vm.dataSourceConfig.data;
            delete dataSource.transport;
          } else {
            // Get data reader config
            dataSource.transport.read = scope.vm.dataSourceConfig.fetchingDataConfig;
            dataSource.transport.create = scope.vm.dataSourceConfig.creatingDataConfig;
            dataSource.transport.update = scope.vm.dataSourceConfig.updatingDataConfig;
            dataSource.transport.destroy = scope.vm.dataSourceConfig.deletingDataConfig;
            dataSource.transport.parameterMap = scope.vm.dataSourceConfig.parameterMap;
            dataSource.schema = scope.vm.dataSourceConfig.schema; // for error handling
            dataSource.serverPaging = scope.vm.dataSourceConfig.serverPaging || false; // for error handling
            /**
             * data source error handler
             * @param e
             */
            dataSource.error = function (e) {
              var errorMessage;
              if (e.xhr.responseJSON) {
                if (e.xhr.responseJSON.errorMessage) {
                  errorMessage = e.xhr.responseJSON.errorMessage;
                }
                if (e.xhr.responseJSON.message) {
                  errorMessage = e.xhr.responseJSON.message;
                }
                if (e.xhr.responseJSON.length) {
                  errorMessage = _.reduce(e.xhr.responseJSON, function (memo, msg) {
                    memo += msg + '<br>';
                    return memo;
                  }, '');
                }
              }
              if (errorMessage) {
                $timeout(function () {
                  toaster.pop({
                    type: 'error',
                    title: 'Error',
                    body: errorMessage,
                    bodyOutputType: 'trustedHtml'
                  });
                });
              }

            };
          }

          // Page size and schema
          dataSource.pageSize = scope.vm.dataSourceConfig.pageSize;

          var declaredOpts = scope.vm.dataSourceConfig.options;

          /**
           * efix popup modal when edit row
           * @param e
           */
          declaredOpts.edit = function (e) {
            var notAllowCols = [];
            if (e.model.isNew()) {
              var update = jQuery(e.container).parent().find(".k-grid-update");
              $(update).html('<span class="k-icon k-update"></span>Add');

              e.container.kendoWindow("title", declaredOpts.popupAddHeader || "Add new customer");
              notAllowCols = _.filter(declaredOpts.columns, function (col) {
                return !col.allowOnAdd;
              });
              _.each(notAllowCols, function (col) {
                var colField = col.field;
                e.container.find('input[name *= "' + colField + '"]').attr('disabled', true);
              });

            } else {
              e.container.kendoWindow("title", declaredOpts.popupEditHeader || "Edit customer");
              notAllowCols = _.filter(declaredOpts.columns, function (col) {
                return !col.allowOnEdit;
              });
              _.each(notAllowCols, function (col) {
                var colField = col.field;
                e.container.find('input[name *= "' + colField + '"]').attr('disabled', true);
              });
            }
            var validator = e.container.data("kendoValidator");
            e.container.find('input.k-input').focusout(function (e) {
              validator.validateInput(e.target);
            });
          };


          // Confirm modal selector for display
          var confirmModalSelector = '#' + declaredOpts.modalConfirmId;

          // Button confirm yes/no
          var confirmYesId = '#' + (declaredOpts.confirmModalYesButtonId || 'yes');
          var confirmNoId = '#' + (declaredOpts.confirmModalNoButtonId || 'no');

          // Create instance confirm window
          var confirmWindow = jQuery(confirmModalSelector).kendoWindow({
            title: "Confirm Delete",
            visible: false, //the window will not appear before its .open method is called
            resizable: false,
            width: "400px",
            height: declaredOpts.confirmModalHeight + 'px',
            modal: true,
            template: '<input type="button" value="click me!" id="btnClickMe" />'
          }).data("kendoWindow");


          // For handle custom command
          // If command name is "Delete" -> Create button with confirm Yes/No
          if (declaredOpts.columns) {
            // Get command column
            var columnCommands = _.filter(declaredOpts.columns, function (col) {
              return col.command;
            });
            _.each(columnCommands, function (col) {
              _.each(col.command, function (command, idx) {
                if (command === 'Delete') {
                  col.command[idx] = {
                    name: "Delete",
                    /**
                     * click fn
                     * @param e
                     */
                    click: function (e) { //add a click event listener on the delete button
                      e.preventDefault();
                      var grid = this;
                      var tr = jQuery(e.target).closest("tr"); //get the row for deletion
                      var data = this.dataItem(tr); //get the row data so it can be referred later
                      if (confirmWindow) {
                        confirmWindow.open().center();
                      }

                      /**
                       * on click yes
                       * @param d
                       */
                      function onClickYes(d) {
                        d.preventDefault();
                        /*jQuery(document).off('click', confirmYesId, onClickYes);
                        jQuery(document).off('click', confirmNoId, onClickNo);*/
                        grid.removeRow(tr);
                        confirmWindow.close();
                      }

                      /**
                       * on click no
                       * @param d
                       */
                      function onClickNo(d) {
                        /*jQuery(document).off('click', confirmYesId, onClickYes);
                        jQuery(document).off('click', confirmNoId, onClickNo);*/
                        d.preventDefault();
                        confirmWindow.close();
                      }

                      jQuery(document).on('click', confirmYesId, onClickYes);
                      jQuery(document).on('click', confirmNoId, onClickNo);
                    }
                  };
                }
              });
            });
          }

          // Extend options
          options = angular.extend(options, declaredOpts);

          // Set datasource
          options.dataSource = dataSource;
        }


        /**
         * register click select
         * @param selectConfig
         * @returns {*|jQuery}
         */
        function registerClickSelect(selectConfig) {
          if (selectConfig && selectConfig.enabled > 0) {
            return $(elem).delegate('tbody>tr', 'mousedown', function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (e.which === selectConfig.enabled) {
                selectConfig.onSelect($(elem).data('kendoGrid').dataItem(this));
              }
            });
          }
        }


        registerClickSelect(options.selection);
        elem.kendoGrid(options);

        /**
         * resize grid
         */
        function resizeGrid() {
          var gridElement = elem.parent(),
            dataArea = gridElement.find(".k-grid-content"),
            gridHeight = gridElement.innerHeight() || 0,
            gridHeaderHeight = gridElement.find(".k-grid-header").outerHeight() || 0,
            gridToolbarHeight = gridElement.find(".k-grid-toolbar").outerHeight() || 0,
            paggerHeight = gridElement.find(".k-grid-pager").outerHeight() || 0;


          var height = gridHeight - gridHeaderHeight - paggerHeight - gridToolbarHeight;
          // if(height<150){
          //   height = 150;
          // }
          dataArea.height(height);
        }

        $timeout(function () {
          resizeGrid();
        }, 100);
      }

      /**
       * cotroller fn
       */
      function controllerFn() {

      }

      return {
        restrict: 'E',
        link: linkFn,
        controller: controllerFn,
        bindToController: true,
        controllerAs: 'vm',
        scope: {
          dataSourceConfig: '=cKGridOptions'
        }
      };
    }
  ]);
  return module.name;
});
