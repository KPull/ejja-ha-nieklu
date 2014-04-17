'use strict';

angular.module('ikelClientApp').factory('Order', function ($resource, apiPrefix) {

  var resource = $resource(apiPrefix + '/order/:id', {
    id: '@_id'
  });

  return resource;
});
