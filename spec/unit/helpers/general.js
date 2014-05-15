'use strict';

describe('General', function () {
  var $rootScope, global;

  beforeEach(module('Helpers'));
  beforeEach(inject(function (_$rootScope_, $window) {
    $rootScope = _$rootScope_;
    global = $window;
  }));

  it('should be equal', function() {
    expect(1).toEqual(1);
  });

});
