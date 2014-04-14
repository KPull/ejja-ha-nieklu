'use strict';

angular.module('ikelClientApp').controller('CreateItemCtrl', function ($scope, $location, $routeParams, Item) {
    $scope.orderId = $routeParams.orderId;
    $scope.item = {
        _order: $routeParams.orderId
    };
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
