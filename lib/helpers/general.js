(function () {
  'use strict';

  angular.module('Helpers')

  .run(['assignVars',
    function (assignVars) {
      assignVars();
    }
  ])

  .factory('assignVars', ['$rootScope', 'User',
    function ($rootScope, User) {
      return function () {
        $rootScope.user = User.current();
      };
    }
  ]);

}(window));
