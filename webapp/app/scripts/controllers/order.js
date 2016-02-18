'use strict';
angular.module('ikelClientApp').controller('OrderCtrl', function($scope,
  $location, $routeParams, $q, Order, Item) {

  $scope.resolved = false;

  var calculateTotals = function() {
    $scope.order.total = $scope.order.items.reduce(function(sum, item) {
      return sum + parseFloat(item.price || 0);
    }, 0);
    $scope.order.paid = $scope.order.items.reduce(function(sum, item) {
      return sum + (item.paid ? parseFloat(item.price || 0) : 0);
    }, 0);
  }

  var refreshOrder = function() {
    // Fetch both the order and its items at the same time
    $scope.order = Order.get({
      id: $routeParams.orderId
    });
    var items = Item.query({
      order: $routeParams.orderId
    });

    // Promise fires after both promises resolve
    $q.all({
      order: $scope.order.$promise,
      items: items.$promise
    }).then(function(result) {
      $scope.order.items = result.items;
      calculateTotals();
      $scope.resolved = true;
    });
  }

  refreshOrder();

  $scope.itemChanged = function(item, order) {
    // Save the item on the server
    Item.save(item);
    calculateTotals();
  };

  $scope.deleteItem = function(item, index) {
    item.$delete(function() {
      $scope.order.items.splice(index, 1);
      calculateTotals();
    });
  };

  // Register for added items
  $scope.$on('item_added', function(event, item) {
    if (item._order === $scope.order._id) {
      $scope.order.items.push(item);
      calculateTotals();
      refreshOrder();
    }
  });

});
