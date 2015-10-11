'use strict';
angular.module('ikelClientApp').controller('MainCtrl', function($scope, Order, Item, Plea, localStorageService) {

  var updateTotals = function(order, items) {
    order.totals = {
      subtotal: items.reduce(function(sum, item) {
        return sum + parseFloat(item.price || 0);
      }, 0),
      paid: items.reduce(function(sum, item) {
        return sum + (item.paid ? parseFloat(item.price || 0) : 0);
      }, 0)
    };
  }

  $scope.orders = Order.query({}, function(orders) {
    orders.forEach(function(order) {
      order.items = Item.query({
        order: order._id
        }, function(items) {
          updateTotals(order, items);
        });
    });
  });

  $scope.deleteItem = function(item, order, index) {
    item.$delete(function() {
      order.items.splice(index, 1);
      updateTotals(order, order.items);
    });
  };

  $scope.addPleas = function() {
    console.log('adding pls');
  };

  $scope.itemChanged = function(item, order) {
    // Save the item on the server
    Item.save(item);
    updateTotals(order, order.items);
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
