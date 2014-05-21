'use strict';

describe('General', function () {
  var $rootScope;

  beforeEach(module('Helpers'));
  beforeEach(inject(function (_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('assignVars', function () {
    var User, assignVars;

    beforeEach(inject(function (_User_, _assignVars_) {
      User = _User_;
      assignVars = _assignVars_;
    }));

    it('should assign a user with the current logged user function', function () {
      spyOn(User, 'current').andReturn('theUser');
      assignVars();
      expect($rootScope.user).toEqual('theUser');
    });
  });

});
