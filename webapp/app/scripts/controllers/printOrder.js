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
                authors: {},
                subtotal: 0,
                price: item.price
            };
        }
        if (!summary[item.name].authors[item.author]) {
            summary[item.name].authors[item.author] = { paid: true, count: 0 };
        }
        summary[item.name].authors[item.author].count = summary[item.name].authors[item.author].count + 1;
        // A person needs to have paid ALL their like-named items for it to show as paid on the summary
        summary[item.name].authors[item.author].paid = summary[item.name].authors[item.author].paid && item.paid;
        summary[item.name].count = summary[item.name].count + 1;
        summary[item.name].subtotal = summary[item.name].subtotal + item.price;
        summary[item.name].price = item.price;
        return summary;
      }, { });
    });
  });

});
