'use strict';

describe('Service: Orders', function () {

  // load the service's module
  beforeEach(module('ikelClientApp'));

  // instantiate service
  var Orders;
  beforeEach(inject(function (_Orders_) {
    Orders = _Orders_;
  }));

  it('should do something', function () {
    expect(!!Orders).toBe(true);
  });

});
