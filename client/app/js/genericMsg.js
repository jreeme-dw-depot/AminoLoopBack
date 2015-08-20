angular.module('loopbackApp')
  .service('genericMsg', ['$rootScope', function ($rootScope) {
    this.broadcast = function broadcast() {
      var args = ['genericMsg'];
      Array.prototype.push.apply(args, arguments);
      $rootScope.$broadcast.apply($rootScope, args);
    };
    this.listen = function (callback) {
      $rootScope.$on('genericMsg', callback)
    }
  }]);

