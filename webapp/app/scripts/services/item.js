'use strict';

angular.module('ikelClientApp').factory('Item', function ($resource, apiPrefix) {

  var resource = $resource(apiPrefix + '/item/:id', {
    id: '@_id'
  });

  return resource;

});
