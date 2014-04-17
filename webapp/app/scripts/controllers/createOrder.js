'use strict';

angular.module('ikelClientApp').controller('CreateOrderCtrl', function ($scope, $location, Order, localStorageService) {


  var assumedAuthor = localStorageService.get('assumedAuthor');
  if (assumedAuthor) {
    $scope.order = {};
    angular.extend($scope.order, assumedAuthor);
  }

  $scope.save = function() {
    Order.save($scope.order, function() {
      $location.path('/');

      var currentAuthor = {
        author : $scope.order.author,
        email : $scope.order.email
      };

      localStorageService.add('assumedAuthor', currentAuthor);

    });
  };

});
