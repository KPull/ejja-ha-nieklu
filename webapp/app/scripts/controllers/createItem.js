'use strict';

angular.module('ikelClientApp').controller('CreateItemCtrl', function ($scope, $location, $routeParams, Item, Order, localStorageService) {

  $scope.orderId = $routeParams.orderId;
  $scope.choices = [];

  Item.query({ order: $scope.orderId }).$promise.then(function(items) {
    // Reduce all the resouces into a single object with thne name as
    // the key of the object (using lower case to ignore case).
    // This will automatically remove any duplicates.
    var reducedObject = items.reduce(function(prev, item) {
      prev[item.name.toLowerCase()] = item;
      return prev;
    }, {});

    // Now go over the unique keys and add the them the value to the
    // choices array.
    //
    // Using the whole object so in the future we can prefill the price
    // once the object is select.
    Object.keys(reducedObject).forEach(function(key) {
      $scope.choices.push(reducedObject[key]);
    });
  });

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
