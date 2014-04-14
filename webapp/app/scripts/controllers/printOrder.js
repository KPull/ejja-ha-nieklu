'use strict';

angular.module('ikelClientApp').controller('PrintOrderCtrl', function ($scope, $routeParams, Order, Item) {
    $scope.order = Order.get({ id: $routeParams.orderId }, function(order) {
        order.items = Item.query({ order: order._id }, function(items) {
            order.total = items.reduce(function(sum, item) {
                return sum + parseFloat(item.price || 0);
            }, 0);
        });
    });
});
