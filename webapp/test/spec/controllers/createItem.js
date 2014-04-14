'use strict';

describe('Controller: CreateitemCtrl', function () {

  // load the controller's module
  beforeEach(module('ikelClientApp'));

  var CreateitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreateitemCtrl = $controller('CreateitemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
