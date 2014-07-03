'use strict';

angular.module('ikelClientApp').factory('Plea', function ($resource, apiPrefix) {

  var resource = $resource(apiPrefix + '/pleas');

  return resource;
});
