angular.module('Routes')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('root', {
      url: "/"
    })
    .state('logout', {
      url: "/logout",
      resolve: {
        logout: ['$rootScope', 'User',
          function($rootScope, User){
            User.logOut();
            $rootScope.user = undefined;
            $state.go('root');
          }]
      }
    })
    ;
}]);
