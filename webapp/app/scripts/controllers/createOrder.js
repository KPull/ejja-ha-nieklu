'use strict';

angular.module('ikelClientApp').controller('CreateOrderCtrl', function(
  $rootScope, $scope, $location, Order, localStorageService) {

  var assumedAuthor = localStorageService.get('assumedAuthor');
  if (assumedAuthor) {
    $scope.order = {};
    angular.extend($scope.order, assumedAuthor);
  }

  $scope.save = function() {
    var order = Order.save($scope.order, function(order) {
      var currentAuthor = {
        author: $scope.order.author,
        email: $scope.order.email
      };

      localStorageService.add('assumedAuthor', currentAuthor);

      $location.path('/order/' + order._id);
      $rootScope.$broadcast('order_added', order);
    });
  };

});
