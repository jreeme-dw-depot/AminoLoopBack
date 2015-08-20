angular.module('loopbackApp')
  .service('BrowserPluginCommsMsg', ['$rootScope', function ($rootScope) {
    this.broadcast = function broadcast() {
      var args = ['browserPluginCommsMsg'];
      Array.prototype.push.apply(args, arguments);
      $rootScope.$broadcast.apply($rootScope, args);
    };
    this.listen = function (callback) {
      $rootScope.$on('browserPluginCommsMsg', callback)
    }
  }]);

