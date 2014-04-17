'use strict';

angular.module('ikelClientApp').controller('CreateItemCtrl', function ($scope, $location, $routeParams, Item, localStorageService) {

  $scope.orderId = $routeParams.orderId;
  $scope.item = {
    _order: $routeParams.orderId
  };

  var assumedAuthor = localStorageService.get('assumedAuthor');
  if (assumedAuthor) {
    /**
     * Here we won't extend the assumed author with the item not to
     * pollute the item object with unnecessary fields (like email).
     */
    $scope.item.author = assumedAuthor.author;
  }

  $scope.save = function() {
    Item.save($scope.item, function() {
      $location.path('/');
    });
  };

  $scope.saveAndAdd = function() {
    Item.save($scope.item, function() {
      $scope.item = {
        _order: $routeParams.orderId,
        author: $scope.item.author
      };
    });
  };
});
