(function(global) {

  'use strict';
  angular.module('Helpers')

  .run(['$rootScope', '$window', 'User', function ($rootScope, $window, User) {
    var user = User.current();
    $rootScope.user = user;
  }]);

}(window));
