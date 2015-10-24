'use strict';

angular.module('ikelClientApp').controller('OrdersListCtrl', function($scope, Order) {

  $scope.orders = Order.query({});
  $scope.orders.$promise.catch(function() {
    $scope.orders.error = true;
  });

  $scope.$on('order_added', function(event, order) {
    $scope.orders.push(order);
  });

  $scope.$on('$routeChangeSuccess', function(event, current) {
    // Look at the new route. If it's an order form, mark that order as currently viewing
    $scope.orders.forEach(function(order) {
      order.viewing = current.originalPath === '/order/:orderId' && current.params.orderId === order._id;
    });
  })

});
