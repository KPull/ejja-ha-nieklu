'use strict';

angular.module('ikelClientApp').controller('DeleteOrderCtrl', function ($scope, $routeParams, $location, Order) {
    $scope.order = Order.get({ id: $routeParams.orderId });
    $scope.confirm = function() {
        $scope.order.$delete(function() {
            $location.path('/');
        });
    };
});
