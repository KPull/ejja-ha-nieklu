'use strict';

angular.module('ikelClientApp').controller('OrdersListCtrl', function($scope,
  Order) {

  $scope.orders = Order.query({});
  $scope.orders.$promise.catch(function() {
    $scope.orders.error = true;
  });

  var haveOrder = function(order) {
    return $scope.orders.some(function(element) {
      return element._id === order._id;
    });
  }

  $scope.$on('order_added', function(event, order) {
    if (!haveOrder(order)) {
      $scope.orders.push(order);
    }
  });

  $scope.$on('REMOTE_ORDER_ADDED', function(event, order) {
    if (!haveOrder(order)) {
      $scope.orders.push(order);
    }
  });

  $scope.$on('order_deleted', function(event, order) {
    $scope.orders = $scope.orders.filter(function(element) {
      return element._id !== order._id;
    });
    $scope.orders.$resolved = true;
  });

  $scope.$on('$routeChangeSuccess', function(event, current) {
    // Look at the new route. If it's an order form, mark that order as currently viewing
    $scope.orders.forEach(function(order) {
      order.viewing = (current.originalPath === '/order/:orderId' ||
          current.originalPath === '/deleteOrder/:orderId' ||
          current.originalPath === '/printOrder/:orderId') &&
        current.params.orderId === order._id;
    });
  });

});
