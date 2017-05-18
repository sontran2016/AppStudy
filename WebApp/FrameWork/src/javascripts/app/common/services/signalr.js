define(function (require) {
  'use strict';
  var angular = require('angular');
  var module = angular.module('common.services.signalRFactory', []);

  module.factory('signalRFactory', ['notifications',
    function (notifications) {

    var services = {
      shootingHub: {},
      issueHub: {},
      troubleHub: {},
      libraryHub: {}
    };

    var shootingHub = $.connection.shootingHub;
    var issueHub = $.connection.issueHub;
    var troubleHub = $.connection.troubleHub;
    var libraryHub = $.connection.libraryHub;

    services.start = function(){
      $.connection.hub.logging = true;
      $.connection.hub.start().done(function () {
        console.log('signalR start done');
        services.shootingHub.rejectMessage = function(param){
          shootingHub.server.rejectMessage(param);
        };

        services.shootingHub.approveMessage = function(param){
          shootingHub.server.approveMessage(param);
        };

        services.shootingHub.requestToApproveMessage = function(param){
          shootingHub.server.requestToApproveMessage(param);
        };

        services.shootingHub.approveMessage = function(param){
          shootingHub.server.approveMessage(param);
        };

        services.shootingHub.proccessMessage = function(param){
          shootingHub.server.proccessMessage(param);
        };

        services.shootingHub.addCommentMessage = function(param){
          shootingHub.server.addCommentMessage(param);
        };

        services.issueHub.rejectMessage = function(param){
          issueHub.server.rejectMessage(param);
        };

        services.issueHub.approveMessage = function(param){
          issueHub.server.approveMessage(param);
        };

        services.issueHub.requestToApproveMessage = function(param){
          issueHub.server.requestToApproveMessage(param);
        };

        services.issueHub.proccessMessage = function(param){
          issueHub.server.proccessMessage(param);
        };

        services.issueHub.addNewIssue = function(param){
          issueHub.server.addNewIssue(param);
        };

        services.issueHub.deleteIssue = function(param){
          issueHub.server.deleteIssue(param);
        };

        services.issueHub.closeMessage = function(param){
          issueHub.server.closeMessage(param);
        };

        services.troubleHub.deleteTrouble = function(param){
          troubleHub.server.deleteTrouble(param);
        };

        services.libraryHub.import = function(param){
          libraryHub.server.import(param);
        };

        services.libraryHub.proccessMessage = function(param){
          libraryHub.server.proccessMessage(param);
        };

        services.libraryHub.delete = function (param) {
          libraryHub.server.delete(param);
        };
      });

      $.connection.hub.disconnected(function() {
         console.log('signalR disconnected');
         setTimeout(function() {
             $.connection.hub.start();
         }, 5000);
      });
    };

    services.stop = function(){
      $.connection.hub.stop();
        console.log('signalR stop');
    };

    services.setOptions = function(opt){
      $.connection.hub.url = opt.url;
      $.signalR.ajaxDefaults.headers = opt.header;
    };

    shootingHub.client.addNewRejectMessageToPage = function (resp) {
      notifications.troubleshootCountChanged({
        data: resp
      });
    };

    shootingHub.client.addNewApproveMessageToPage = function (resp) {
      notifications.troubleshootCountChanged({
        data: resp
      });
    };

    shootingHub.client.addNewRequestToApproveMessageToPage = function (resp) {
      notifications.troubleshootCountChanged({
        data: resp
      });
    };

    shootingHub.client.addNewProccessMessageToPage = function (resp) {
      notifications.troubleshootCountChanged({
        data: resp
      });
    };

    shootingHub.client.addNewCommentMessageToPage = function (resp) {
      notifications.troubleshootCountChanged({
        data: resp
      });
    };

    issueHub.client.addNewRejectMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });
    };

    issueHub.client.addNewApproveMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });
    };

    issueHub.client.addNewRequestToApproveMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });

      var paramProcess = {
        targetId: resp.TargetId,
        type: 7
      };
      services.issueHub.proccessMessage(paramProcess);
    };

    issueHub.client.addNewAddIssueMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });
    };

    issueHub.client.addNewProccessMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });
    };

    issueHub.client.addNewDeleteIssueMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });
    };

    issueHub.client.addNewCloseMessageToPage = function (resp) {
      notifications.issueCountChanged({
        data: resp
      });

      var paramProcess = {
        targetId: resp.TargetId,
        type: 7
      };
      services.issueHub.proccessMessage(paramProcess);
    };

    troubleHub.client.addNewDeleteTroubleMessageToPage = function (resp) {
      notifications.troubleCountChanged({
       data: resp
     });
    };

    libraryHub.client.addNewImportLibraryMessageToPage = function (resp) {
      notifications.libraryChanged({
        data: resp
      });
    };

    libraryHub.client.addNewProccessMessageToPage = function (resp) {
      notifications.libraryChanged({
        data: resp
      });
    };

    libraryHub.client.addNewDeleteMessageToPage = function (resp) {
      notifications.libraryChanged({
        data: resp
      });
    };

    return services;
  }]);

  return module.name;
});
