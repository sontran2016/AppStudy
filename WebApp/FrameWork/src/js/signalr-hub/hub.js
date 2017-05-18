/*!
 * ASP.NET SignalR JavaScript Library v2.2.1
 * http://signalr.net/
 *
 * Copyright (c) .NET Foundation. All rights reserved.
 * Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.
 *
 */

/// <reference path="..\..\SignalR.Client.JS\Scripts\jquery-1.6.4.js" />
/// <reference path="jquery.signalR.js" />
(function ($, window, undefined) {
    /// <param name="$" type="jQuery" />
    "use strict";

    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }

    var signalR = $.signalR;

    function makeProxyCallback(hub, callback) {
        return function () {
            // Call the client hub method
            callback.apply(hub, $.makeArray(arguments));
        };
    }

    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;

        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];

                if (!(hub.hubName)) {
                    // Not a client hub
                    continue;
                }

                if (shouldSubscribe) {
                    // We want to subscribe to the hub events
                    subscriptionMethod = hub.on;
                } else {
                    // We want to unsubscribe from the hub events
                    subscriptionMethod = hub.off;
                }

                // Loop through all members on the hub and find client hub functions to subscribe/unsubscribe
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];

                        if (!$.isFunction(memberValue)) {
                            // Not a client hub function
                            continue;
                        }

                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }

    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            // Register the hub proxies as subscribed
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, true);

            this._registerSubscribedHubs();
        }).disconnected(function () {
            // Unsubscribe all hub proxies when we "disconnect".  This is to ensure that we do not re-add functional call backs.
            // (instance, shouldSubscribe)
            registerHubProxies(proxies, false);
        });

        proxies['baseHub'] = this.createHubProxy('baseHub'); 
        proxies['baseHub'].client = { };
        proxies['baseHub'].server = {
        };

        proxies['issueHub'] = this.createHubProxy('issueHub'); 
        proxies['issueHub'].client = { };
        proxies['issueHub'].server = {
            addNewIssue: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["AddNewIssue"], $.makeArray(arguments)));
             },

            addNewIssueHub: function (request, user, admin) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["AddNewIssueHub"], $.makeArray(arguments)));
             },

            approveMessage: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["ApproveMessage"], $.makeArray(arguments)));
             },

            approveMessageHub: function (request, user) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["ApproveMessageHub"], $.makeArray(arguments)));
             },

            closeMessage: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["CloseMessage"], $.makeArray(arguments)));
             },

            closeMessageHub: function (request, user) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["CloseMessageHub"], $.makeArray(arguments)));
             },

            deleteIssue: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["DeleteIssue"], $.makeArray(arguments)));
             },

            proccessMessage: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["ProccessMessage"], $.makeArray(arguments)));
             },

            proccessMessageHub: function (notification, user) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["ProccessMessageHub"], $.makeArray(arguments)));
             },

            rejectMessage: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["RejectMessage"], $.makeArray(arguments)));
             },

            rejectMessageHub: function (request, user) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["RejectMessageHub"], $.makeArray(arguments)));
             },

            requestToApproveMessage: function (request) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["RequestToApproveMessage"], $.makeArray(arguments)));
             },

            requestToApproveMessageHub: function (request, user, adminId) {
                return proxies['issueHub'].invoke.apply(proxies['issueHub'], $.merge(["RequestToApproveMessageHub"], $.makeArray(arguments)));
             }
        };

        proxies['libraryHub'] = this.createHubProxy('libraryHub'); 
        proxies['libraryHub'].client = { };
        proxies['libraryHub'].server = {
            delete: function (request) {
                return proxies['libraryHub'].invoke.apply(proxies['libraryHub'], $.merge(["Delete"], $.makeArray(arguments)));
             },

            import: function (request) {
                return proxies['libraryHub'].invoke.apply(proxies['libraryHub'], $.merge(["Import"], $.makeArray(arguments)));
             },

            proccessMessage: function (request) {
                return proxies['libraryHub'].invoke.apply(proxies['libraryHub'], $.merge(["ProccessMessage"], $.makeArray(arguments)));
             }
        };

        proxies['shootingHub'] = this.createHubProxy('shootingHub'); 
        proxies['shootingHub'].client = { };
        proxies['shootingHub'].server = {
            addCommentMessage: function (request) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["AddCommentMessage"], $.makeArray(arguments)));
             },

            approveMessage: function (request) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["ApproveMessage"], $.makeArray(arguments)));
             },

            approveMessageHub: function (request, user) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["ApproveMessageHub"], $.makeArray(arguments)));
             },

            commentMessageHub: function (request, user, receiverId) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["CommentMessageHub"], $.makeArray(arguments)));
             },

            proccessMessage: function (request) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["ProccessMessage"], $.makeArray(arguments)));
             },

            proccessMessageHub: function (notification, user) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["ProccessMessageHub"], $.makeArray(arguments)));
             },

            rejectMessage: function (request) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["RejectMessage"], $.makeArray(arguments)));
             },

            rejectMessageHub: function (request, user) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["RejectMessageHub"], $.makeArray(arguments)));
             },

            requestToApproveMessage: function (request) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["RequestToApproveMessage"], $.makeArray(arguments)));
             },

            requestToApproveMessageHub: function (request, user, adminId) {
                return proxies['shootingHub'].invoke.apply(proxies['shootingHub'], $.merge(["RequestToApproveMessageHub"], $.makeArray(arguments)));
             }
        };

        proxies['troubleHub'] = this.createHubProxy('troubleHub'); 
        proxies['troubleHub'].client = { };
        proxies['troubleHub'].server = {
            deleteTrouble: function () {
                return proxies['troubleHub'].invoke.apply(proxies['troubleHub'], $.merge(["DeleteTrouble"], $.makeArray(arguments)));
             }
        };

        return proxies;
    };

    signalR.hub = $.hubConnection("/signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());

}(window.jQuery, window));