'use strict';

describe('Service: Item', function () {

  // load the service's module
  beforeEach(module('ikelClientApp'));

  // instantiate service
  var Item;
  beforeEach(inject(function (_Item_) {
    Item = _Item_;
  }));

  it('should do something', function () {
    expect(!!Item).toBe(true);
  });

});
