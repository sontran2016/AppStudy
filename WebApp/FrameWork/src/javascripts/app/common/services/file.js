define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');

  var module = angular.module('common.services.file', []);

  module.factory('fileFactory', [
    'Upload',
    'appConstant',
    'utilFactory',
    '$http',
    '$sce',
    function (Upload,
              constant,
              utilFactory,
              $http,
              $sce) {

      var service = {};

      /**
       * upload
       * @param file
       * @param type
       * @param ignoreLoadingBar
       * @returns {*}
       */
      function upload(file, type, ignoreLoadingBar) {
        return Upload.upload({
          url: constant.domain + '/api/common/upload/' + type,
          file: file,
          headers: {
            'Authorization': false
          },
          ignoreLoadingBar: ignoreLoadingBar
        });
      }

      /**
       * import libraries file
       * @returns {*}
       */
      function importLibraries(file) {
        return Upload.upload({
          url: constant.domain + '/api/common/data/import',
          file: file,
          headers: {
            'Authorization': false
          }
        });
      }

      /**
       * import troubleshoot file
       * @returns {*}
       */
      function importTroubleshoot(file) {
        return Upload.upload({
          url: constant.domain + '/api/common/import/trouble',
          file: file,
          headers: {
            'Authorization': false
          }
        });
      }

      /**
       * Export file
       * @param data
       * @param headers
       * @param url
       */
      function exportFiles(data, headers, url) {
        var octetStreamMime = 'application/octet-stream';
        var success = false;
        var blob;
        // Get the headers
        headers = headers();
        var filename = headers['content-disposition'].substring(21, headers['content-disposition'].length).replace(/"/g, '');
        // Determine the content type from the header or default to "application/octet-stream"
        var contentType = headers['content-type'] || octetStreamMime;

        try {
          // Try using msSaveBlob if supported
          blob = new Blob([data], {
            type: contentType
          });
          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
          }
          else {
            // Try using other saveBlob implementations, if available
            var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
            if (saveBlob === undefined) {
              throw "Not supported";
            }
            saveBlob(blob, filename);
          }
          success = true;
        } catch (ex) {
        }
        if (!success) {
          // Get the blob url creator
          var urlCreator = window.URL || window.webkitURL || window.mozURL || window.msURL;
          if (urlCreator) {
            // Try to use a download link
            var link = document.createElement('a');
            if ('download' in link) {
              // Try to simulate a click
              try {
                // Prepare a blob URL
                blob = new Blob([data], {
                  type: contentType
                });
                url = urlCreator.createObjectURL(blob);
                link.setAttribute('href', url);

                // Set the download attribute (Supported in Chrome 14+ / Firefox 20+)
                link.setAttribute("download", filename);

                // Simulate clicking the download link
                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
                link.dispatchEvent(event);
                success = true;

              } catch (ex) {
              }
            }

            if (!success) {
              // Fallback to window.location method
              try {
                // Prepare a blob URL
                // Use application/octet-stream when using window.location to force download
                blob = new Blob([data], {
                  type: octetStreamMime
                });
                //url = urlCreator.createObjectURL(blob);
                window.location = url;
                //saveAs(blob, filename);
                success = true;
              } catch (ex) {
              }
            }
          }
        }
      }

      /**
       * download import template file
       * @returns {*}
       */
      function downloadTemplateImport(type) {
        var id = '';
        if(type === 'master') {
          id = 86;
        }
        var url = constant.domain + '/api/common/download/' + id;
        return $http.post(url, {}, {
          responseType: 'arraybuffer'
        }).success(function(data, status, headers) {
          try {
            exportFiles(data, headers, url);
          } catch (ex) {

          }
        });
      }

      /**
       * export issue(s)
       * @param issue Ids
       * @returns {HttpPromise}
       */
      function exportIssue(issueIds) {
        var url = constant.domain + '/api/issues/exports?ids=' + issueIds;
        return $http.get(url, {}, {
          responseType: 'arraybuffer'
        }).success(function(data, status, headers) {
          try {
            exportFiles(data, headers, url);
          } catch (ex) {}
        });
      }

      /**
       * check valid type of file enable to upload
       * @param files
       * @param types
       * @returns {boolean}
       */
      function checkValidFileTypes(files, types) {
        if (files && files.length !== 0) {
          // check if extension of each file exists in list types or not
          return !_.difference(_.map(files, function (f) {
            // get file extension
            return f.name.split('.').pop().toLowerCase();
          }), types).length;
        } else {
          return false;
        }
      }

      /**
       * Get document source
       */
      function getDocumentSrc(url) {
        return $sce.trustAsResourceUrl('https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURI(url));
      }

      /**
       * Get source
       */
      function getSrc(url) {
        return $sce.trustAsResourceUrl(url);
      }

      /**
       * Get file extention form file name
       * @return {string}
       */
      function getFileExtension(fileName) {
        var ext = /^.+\.([^.]+)$/.exec(fileName);
        return ext === null ? "" : ext[1];
      }

      /**
       * Get file type
       */
      function getFileType(extension) {
        var imageType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
        var docType = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        var videoType = ['mp4','mov'];

        if(imageType.indexOf(extension.toLowerCase()) > -1) {
          return "image";
        } else if(videoType.indexOf(extension.toLowerCase()) > -1) {
          return "video";
        } else if (extension.toLowerCase() === 'pdf') {
          return "pdf";
        } else if (extension.toLowerCase() === 'txt') {
          return "txt";
        } else if (docType.indexOf(extension.toLowerCase()) > -1) {
          return "document";
        } else {
          return null;
        }
      }

      service.upload = upload;
      service.importLibraries = importLibraries;
      service.importTroubleshoot = importTroubleshoot;
      service.downloadTemplateImport = downloadTemplateImport;
      service.exportIssue = exportIssue;
      service.exportFiles = exportFiles;
      service.checkValidFileTypes = checkValidFileTypes;
      service.getFileExtension = getFileExtension;
      service.getFileType = getFileType;
      service.getDocumentSrc = getDocumentSrc;
      service.getSrc = getSrc;

      return service;
    }
  ]);
  return module.name;
});
