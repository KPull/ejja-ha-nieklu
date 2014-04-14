'use strict';

describe('Controller: PrintorderCtrl', function () {

  // load the controller's module
  beforeEach(module('ikelClientApp'));

  var PrintorderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrintorderCtrl = $controller('PrintorderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
