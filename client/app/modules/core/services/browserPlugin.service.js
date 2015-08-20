'use strict';
var app = angular.module('com.module.core');
app.service('BrowserPluginService', ['ENV', '$window', 'BrowserPluginCommsMsg',
  function (ENV, $window, BrowserPluginCommsMsg) {
    var me = this;
    me.env = ENV;
    me.pluginOrigin = '';
    BrowserPluginCommsMsg.listen(function (_event, event) {
      try {
        var msg = angular.fromJson(event.data);
        if (msg.type == 'handshake') {
          me.pluginOrigin = event.origin;
          $window.alert(me.pluginOrigin);
          var msg = {
            type: 'handshake-ack'
          }
          $window.postMessage(angular.toJson(msg), event.origin);
        }
      }
      catch (ex) {
        $window.alert('Could not parse message: ' + event.data);
      }
    });
    me.notifyPluginOfLoginSuccess = function (user) {
      $window.alert(this.pluginOrigin);
    }
    $window.addEventListener('message', function (event) {
      BrowserPluginCommsMsg.broadcast(event);
    });
  }]);


