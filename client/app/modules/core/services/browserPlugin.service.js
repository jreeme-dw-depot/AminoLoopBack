'use strict';
var app = angular.module('com.module.core');
app.service('BrowserPluginService', ['ENV', '$window', 'BrowserPluginCommsMsg',
  function (ENV, $window, BrowserPluginCommsMsg) {
    var me = this;
    me.env = ENV;
    me.pluginOrigin = '';
    BrowserPluginCommsMsg.listen(function (_event, event) {
      try {
        var msg = event.data;
        //var msg = angular.fromJson(event.data);
        if (msg.type == 'handshake') {
          me.pluginOrigin = event.origin;
          //$window.alert('Web Page has handshake req from: ' + me.pluginOrigin);
          var msg = {
            type: 'handshake-ack'
          }
          $window.postMessage(msg, event.origin);
        }
      }
      catch (ex) {
        $window.alert('Could not parse message: ' + event.data);
      }
    });
    me.notifyPluginOfLoginSuccess = function (user) {
      //$window.alert('Ready to send Login Success message to ' + this.pluginOrigin);
      var msg = {
        type: 'login-success-target-content-script',
        user: user
      }
      $window.postMessage(msg, me.pluginOrigin);
    }
    $window.addEventListener('message', function (event) {
      BrowserPluginCommsMsg.broadcast(event);
    });
  }]);


