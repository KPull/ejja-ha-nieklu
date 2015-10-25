'use strict';

angular.module('ikelClientApp').controller('DeleteOrderCtrl', function ($rootScope, $scope, $routeParams, $location, Order) {

  $scope.order = Order.get({ id: $routeParams.orderId });
  $scope.confirm = function() {
    $scope.order.$delete(function() {
      $rootScope.$broadcast('order_deleted', $scope.order);
      $location.path('/');
    });
  };

});
