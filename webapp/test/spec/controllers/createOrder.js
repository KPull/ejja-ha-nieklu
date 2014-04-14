'use strict';

describe('Controller: CreateorderCtrl', function () {

  // load the controller's module
  beforeEach(module('ikelClientApp'));

  var CreateorderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateorderCtrl = $controller('CreateorderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
