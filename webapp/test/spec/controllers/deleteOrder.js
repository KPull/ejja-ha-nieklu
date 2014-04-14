'use strict';

describe('Controller: DeleteorderCtrl', function () {

  // load the controller's module
  beforeEach(module('ikelClientApp'));

  var DeleteorderCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DeleteorderCtrl = $controller('DeleteorderCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
