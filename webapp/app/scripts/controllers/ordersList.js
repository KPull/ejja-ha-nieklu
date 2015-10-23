'use strict';

angular.module('ikelClientApp').controller('OrdersListCtrl', function($scope, Order) {

  $scope.orders = Order.query({});
  $scope.orders.$promise.catch(function() {
    $scope.orders.error = true;
  });

});
