"use strict";angular.module("ikelClientApp",["ngCookies","ngResource","ngSanitize","ngRoute","ui.bootstrap","ui.bootstrap.tabs","LocalStorageModule"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/createOrder",{templateUrl:"views/createOrder.html",controller:"CreateOrderCtrl"}).when("/createItem/:orderId",{templateUrl:"views/createItem.html",controller:"CreateItemCtrl"}).when("/printOrder/:orderId",{templateUrl:"views/printOrder.html",controller:"PrintOrderCtrl"}).when("/deleteOrder/:orderId",{templateUrl:"views/deleteOrder.html",controller:"DeleteOrderCtrl"}).otherwise({redirectTo:"/"})}]).config(["localStorageServiceProvider",function(a){a.setPrefix("EHN")}]),angular.module("ikelClientApp").controller("MainCtrl",["$scope","Order","Item","Plea","localStorageService",function(a,b,c,d,e){function f(a){if(!a)return!1;var b=new Date(a),c=new Date;return c.getMonth()===b.getMonth()&&c.getDate()===b.getDate()}a.orders=b.query({},function(a){a.forEach(function(a){a.items=c.query({order:a._id},function(b){a.total=b.reduce(function(a,b){return a+parseFloat(b.price||0)},0)})})}),a.deleteItem=function(a,b,c){a.$delete(function(){b.items.splice(c,1),b.total=b.items.reduce(function(a,b){return a+parseFloat(b.price||0)},0)})},a.addPleas=function(){console.log("adding pls")};var g=e.get("assumedAuthor");g&&(a.hungryName=g.author),a.hungryList=d.query(),a.hungryToday=f(parseInt(e.get("hungryToday"),10)),a.iAmHungry=function(){new d({name:a.hungryName}).$save(function(){a.hungryList.push({name:a.hungryName}),e.set("hungryToday",(new Date).getTime()),a.hungryToday=!0})}}]),angular.module("ikelClientApp").factory("Order",["$resource","apiPrefix",function(a,b){var c=a(b+"/order/:id",{id:"@_id"});return c}]),angular.module("ikelClientApp").constant("apiPrefix","http://ejja-ha-nieklu.herokuapp.com"),angular.module("ikelClientApp").factory("Item",["$resource","apiPrefix",function(a,b){var c=a(b+"/item/:id",{id:"@_id"});return c}]),angular.module("ikelClientApp").factory("Plea",["$resource","apiPrefix",function(a,b){var c=a(b+"/pleas");return c}]),angular.module("ikelClientApp").controller("CreateOrderCtrl",["$scope","$location","Order","localStorageService",function(a,b,c,d){var e=d.get("assumedAuthor");e&&(a.order={},angular.extend(a.order,e)),a.save=function(){c.save(a.order,function(){b.path("/");var c={author:a.order.author,email:a.order.email};d.add("assumedAuthor",c)})}}]),angular.module("ikelClientApp").controller("CreateItemCtrl",["$scope","$location","$routeParams","Item","Order","localStorageService",function(a,b,c,d,e,f){a.orderId=c.orderId,a.choices=[],d.query({order:a.orderId}).$promise.then(function(b){var c=b.reduce(function(a,b){return a[b.name.toLowerCase()]=b,a},{});Object.keys(c).forEach(function(b){a.choices.push(c[b])})}),a.item={_order:c.orderId};var g=f.get("assumedAuthor");g&&(a.item.author=g.author),a.save=function(){d.save(a.item,function(){b.path("/")})},a.saveAndAdd=function(){d.save(a.item,function(){a.item={_order:c.orderId,author:a.item.author}})}}]),angular.module("ikelClientApp").controller("PrintOrderCtrl",["$scope","$routeParams","Order","Item",function(a,b,c,d){a.order=c.get({id:b.orderId},function(a){a.items=d.query({order:a._id},function(b){a.total=b.reduce(function(a,b){return a+parseFloat(b.price||0)},0)})})}]),angular.module("ikelClientApp").controller("DeleteOrderCtrl",["$scope","$routeParams","$location","Order",function(a,b,c,d){a.order=d.get({id:b.orderId}),a.confirm=function(){a.order.$delete(function(){c.path("/")})}}]);