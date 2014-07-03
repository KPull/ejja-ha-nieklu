'use strict';
angular.module('ikelClientApp').controller('MainCtrl', function($scope, Order, Item, Plea, localStorageService) {
  $scope.orders = Order.query({}, function(orders) {
    orders.forEach(function(order) {
      order.items = Item.query({
        order: order._id
      }, function(items) {
        order.total = items.reduce(function(sum, item) {
          return sum + parseFloat(item.price || 0);
        }, 0);
      });
    });
  });

  $scope.deleteItem = function(item, order, index) {
    item.$delete(function() {
      order.items.splice(index, 1);
      order.total = order.items.reduce(function(sum, item) {
        return sum + parseFloat(item.price || 0);
      }, 0);
    });
  };

  $scope.addPleas = function() {
    console.log('adding pls');
  };

  var assumedAuthor = localStorageService.get('assumedAuthor');
  if (assumedAuthor) {
    $scope.hungryName = assumedAuthor.author;
  }

  function isTimeToday(time) {
    if (!time) {
      return false;
    }

    var timeDate = new Date(time);
    var today = new Date();

    return (today.getMonth() === timeDate.getMonth()) &&
            (today.getDate() === timeDate.getDate());
  }

  $scope.hungryList = Plea.query();
  $scope.hungryToday = isTimeToday(parseInt(localStorageService.get('hungryToday'), 10));

  $scope.iAmHungry = function() {

    new Plea({
        name: $scope.hungryName
      }).$save(function() {
        $scope.hungryList.push({name: $scope.hungryName});
        localStorageService.set('hungryToday', new Date().getTime());
        $scope.hungryToday = true;
    });
  };



});
