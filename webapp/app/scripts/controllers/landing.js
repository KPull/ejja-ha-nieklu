'use strict';

angular.module('ikelClientApp').controller('LandingCtrl', function($scope, $location, Order) {
  // The landing controller simply redirects the user to a better page
  Order.query({}, function(orders) {
    if (orders.length > 0) {
      $location.path('order/' + orders[0]._id);
    } else {
      $location.path('createOrder');
    }
  });
});
