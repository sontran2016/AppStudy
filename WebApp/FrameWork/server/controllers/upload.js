var express = require('express');
var path = require('path');
var fs = require("fs");
var _ = require('lodash');
var utilService = require('./../services/util');
var rootPath = GLOBAL.ROOTPATH;

function _generateNewFileName(filePath, files) {
  var fileName = path.basename(filePath);
  var fileExt = path.extname(fileName);
  var fileNameWithoutExt = path.basename(filePath, fileExt);
  var newName = fileName;
  if(fs.existsSync(filePath)) {
    var reg = new RegExp(fileNameWithoutExt + ' \\(\\d+\\)' + fileExt + '$');
    var duplicates = _.filter(files, function(file) {
      return reg.test(file);
    });
    if(duplicates.length <= 0) {
      newName = fileNameWithoutExt + ' (1)' + fileExt;
    } else {
      var lastDuplicateNumber = _.sortBy(duplicates).reverse()[0];
      var duplicateNumber = /.*\s+\((\d+)\)\./.exec(lastDuplicateNumber)[1];
      if(duplicateNumber) {
        newName = fileNameWithoutExt + ' (' + (parseInt(duplicateNumber) + 1) + ')' + fileExt;
      }
    }
  }
  return newName;
}

function uploadFile(req, res) {
  var fileInputName = 'file',
    fileName = '',
    file = req.files[fileInputName],
    responseData = {
      success: false
    };

  fileName = req.body.fileName
    .replace(/[^a-z0-9-_\.]/gi, '-');

  file.name = fileName;

  function success(url) {
    responseData.success = true;
    responseData.url = string.join('/', 'upload', fileName);
    responseData.name = fileName;
    responseData.type = string.path(fileName).mimeType;
    responseData.size = file.size;
    res.send(responseData);
  }

  function failure(msg) {
    res.status(400);
    res.send(msg);
  }

  function upload(file) {
    var sourceStream = fs.createReadStream(file.path);
    var uploadFolder = path.join(rootPath, 'upload');
    utilService.ensureFolderExist(uploadFolder);
    var files = fs.readdirSync(uploadFolder);
    fileName = _generateNewFileName(path.join(uploadFolder, fileName), files);
    var url = string.join('/', 'upload', fileName);

    var destStream = fs.createWriteStream(path.join(rootPath, url));
    sourceStream
      .on("error", function(error) {
        console.error("Problem copying file: " + error.stack);
        failure();
      })
      .on("end", success)
      .pipe(destStream);
  }

  upload(file);
}

function isValid(size) {
  return size < config.maxFileSize;
}

module.exports = {
  upload: uploadFile
};