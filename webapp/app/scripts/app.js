'use strict';
angular.module('ikelClientApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ui.bootstrap.tabs',
  'LocalStorageModule'
]).config(function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  }).when('/createOrder', {
    templateUrl: 'views/createOrder.html',
    controller: 'CreateOrderCtrl'
  }).when('/createItem/:orderId', {
    templateUrl: 'views/createItem.html',
    controller: 'CreateItemCtrl'
  }).when('/printOrder/:orderId', {
    templateUrl: 'views/printOrder.html',
    controller: 'PrintOrderCtrl'
  }).when('/deleteOrder/:orderId', {
    templateUrl: 'views/deleteOrder.html',
    controller: 'DeleteOrderCtrl'
  }).otherwise({
    redirectTo: '/'
  });
}).config(['localStorageServiceProvider', function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('EHN');
}]);
