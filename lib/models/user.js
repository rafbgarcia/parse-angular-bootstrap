(function() {
  'use strict';

  angular.module('Models')

  .factory('User', ['wrapParse', '$window', function (wrapParse, $window) {
    var User = wrapParse($window.Parse.User, {

    });

    return User;
  }]);
}());
