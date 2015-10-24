'use strict';
angular.module('ikelClientApp').controller('OrderCtrl', function ($scope, $location, $routeParams, $q, Order, Item) {

  $scope.resolved = false;

  // Fetch both the order and its items at the same time
  $scope.order = Order.get({ id: $routeParams.orderId });
  var items = Item.query({ order: $routeParams.orderId });

  var calculateTotals = function() {
    $scope.order.total = $scope.order.items.reduce(function(sum, item) {
      return sum + parseFloat(item.price || 0);
    }, 0);
  }

  // Promise fires after both promises resolve
  $q.all({
    order: $scope.order.$promise,
    items: items.$promise
  }).then(function(result) {
    $scope.order.items = result.items;
    calculateTotals();
    $scope.resolved = true;
  });

  // Register for added items
  $scope.$on('item_added', function(event, item) {
    if (item._order === $scope.order._id) {
      $scope.order.items.push(item);
      calculateTotals();
    }
  });

});
