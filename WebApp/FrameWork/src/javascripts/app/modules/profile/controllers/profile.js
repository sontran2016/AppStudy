define(function (require) {
  'use strict';
  var angular = require('angular');
  var _ = require('lodash');
  var typeFile = angular.fromJson(require('text!app/common/resources/common/fileType.json'));
  var controller = [
    'accountFactory',
    '$rootScope',
    'userContext',
    'toaster',
    'notifications',
    'appConstant',
    function (accountFactory,
              $rootScope,
              userContext,
              toaster,
              notifications,
              appConstant) {
      var vm = this;

      var authentication = userContext.authentication();

      /**
       * get profile info
       */
      function getProfileInfo() {
        accountFactory.getUserInfo().then(function (resp) {
          vm.profileModel = resp.data;
        });
      }

      /**
       * update profile
       * @param model
       */
      function updateProfile(model) {
        var form = vm.formProfile;
        model.areaIds = vm.profileModel.areas ? _.map(vm.profileModel.areas,'id').join(',') : '';
        accountFactory.updateProfile(model).then(function (resp) {
          authentication.userData = resp.data;
          userContext.saveLocal(authentication);
          form.$setPristine();
        });
      }

      /**
       * Upload file
       * @param file
       */
      function uploadFile(file) {
        if (!file) {
          return;
        }

        if (file.size > appConstant.allowAvatarFileSize) {
          toaster.pop('error', 'Error', 'Please choose a file < 1MB');
          return;
        }

        if (appConstant.allowAvatarFileType.indexOf(file.type) === -1) {
          toaster.pop('error', 'Error', 'Please choose a file png, jpg or jpeg');
          return;
        }
        accountFactory.updateAvatar(file, typeFile.USER).then(function (resp) {
          vm.profileModel.avatarUrl = resp.data;
          authentication.userData.avatarUrl = resp.data;
          userContext.saveLocal(authentication);
          authentication.avatarId = (new Date()).getTime();
          notifications.imageAvatarChanged({
            url: resp.data.fileUrl
          });
          $rootScope.currentUserInfo.avatarUrl.fileUrl = vm.profileModel.avatarUrl.fileUrl;
        });
      }

      /**
       * updatePassword
       * @param model
       */
      function updatePassword(model){
        accountFactory.changePassword(model).then(function(resp){

        });
      }

      vm.updateProfile = updateProfile;
      vm.uploadFile = uploadFile;
      vm.updatePassword = updatePassword;

      getProfileInfo();

    }];
  return controller;
});
