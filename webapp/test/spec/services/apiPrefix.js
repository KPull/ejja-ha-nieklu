'use strict';

describe('Service: Apiprefix', function () {

  // load the service's module
  beforeEach(module('ikelClientApp'));

  // instantiate service
  var Apiprefix;
  beforeEach(inject(function (_Apiprefix_) {
    Apiprefix = _Apiprefix_;
  }));

  it('should do something', function () {
    expect(!!Apiprefix).toBe(true);
  });

});
