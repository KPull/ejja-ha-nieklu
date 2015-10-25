'use strict';

angular.module('ikelClientApp').controller('CreateItemCtrl', function ($scope, $routeParams, Item, Order, localStorageService) {

  $scope.orderId = $routeParams.orderId;
  $scope.choices = [];
  $scope.resolved = true;

  Item.query({ order: $scope.orderId }).$promise.then(function(items) {
    // Reduce all the resouces into a single object with the name as
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

  $scope.itemNameChanged = function() {
    var found = $scope.order.items.filter(function(item) {
      return item.name === $scope.item.name;
    });
    if (found.length > 0) {
      $scope.item.price = found[0].price;
    }
  }

  $scope.save = function() {
    $scope.resolved = false;
    var item = angular.extend({}, $scope.item);
    localStorageService.set('assumedAuthor', {author: $scope.item.author});
    Item.save($scope.item, function() {
      $scope.item.name = '';
      $scope.item.price = '';
      $scope.resolved = true;
      $scope.$emit('item_added', item);
    });
  };

});
