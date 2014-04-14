'use strict';

angular.module('ikelClientApp').controller('CreateOrderCtrl', function ($scope, $location, Order) {
    $scope.save = function() {
        Order.save($scope.order, function() {
            $location.path('/');
        });
    };
});
