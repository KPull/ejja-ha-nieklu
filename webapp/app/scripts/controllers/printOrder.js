'use strict';

angular.module('ikelClientApp').controller('PrintOrderCtrl', function ($scope, $routeParams, Order, Item) {

  $scope.order = Order.get({ id: $routeParams.orderId }, function(order) {
    order.items = Item.query({ order: order._id }, function(items) {
      order.total = items.reduce(function(sum, item) {
        return sum + parseFloat(item.price || 0);
      }, 0);
      
      // Shrink the order
      order.summary = items.reduce(function(summary, item) {
        if (!summary[item.name]) {
            summary[item.name] = {
                name: item.name,
                count: 0,
                authors: [],
                subtotal: 0,
                price: item.price
            };
        }
        summary[item.name].authors.push(item.author);
        summary[item.name].count = summary[item.name].count + 1;
        summary[item.name].subtotal = summary[item.name].subtotal + item.price;
        summary[item.name].price = item.price;
        return summary;
      }, { });
    });
  });

});
