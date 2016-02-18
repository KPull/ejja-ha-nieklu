"use strict";angular.module("ikelClientApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngAnimate","ui.bootstrap","ui.bootstrap.tabs","LocalStorageModule","btford.socket-io","angular-web-notification"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/landing.html",controller:"LandingCtrl"}).when("/createOrder",{templateUrl:"views/createOrder.html",controller:"CreateOrderCtrl"}).when("/order/:orderId",{templateUrl:"views/order.html",controller:"OrderCtrl"}).when("/createItem/:orderId",{templateUrl:"views/createItem.html",controller:"CreateItemCtrl"}).when("/printOrder/:orderId",{templateUrl:"views/printOrder.html",controller:"PrintOrderCtrl"}).when("/deleteOrder/:orderId",{templateUrl:"views/deleteOrder.html",controller:"DeleteOrderCtrl"}).otherwise({redirectTo:"/"})}]).config(["localStorageServiceProvider",function(a){a.setPrefix("EHN")}]).factory("ehnSocket",["socketFactory","apiPrefix",function(a,b){var c=a({ioSocket:io.connect(b)});return c}]).run(["ehnSocket","$rootScope","webNotification",function(a,b,c){Notification&&Notification.requestPermission(),a.on("new_order",function(a){c.showNotification("New Food Order",{body:a.author+" has opened a new food order for "+a.from.name+" on Ejja Ħa Nieklu.",icon:"images/burger.png",autoClose:24e3},function(){}),b.$broadcast("REMOTE_ORDER_ADDED",a)}),a.on("closed_order",function(a){c.showNotification("Food Order Closed",{body:"The food order for "+a.from.name+" by "+a.author+" has been closed.",icon:"images/burger.png",autoClose:24e3},function(){}),b.$broadcast("REMOTE_ORDER_REMOVED",a)})}]),angular.module("ikelClientApp").factory("Order",["$resource","apiPrefix",function(a,b){var c=a(b+"/order/:id",{id:"@_id"});return c}]),angular.module("ikelClientApp").constant("apiPrefix","//ejja-ha-nieklu.herokuapp.com"),angular.module("ikelClientApp").factory("Item",["$resource","apiPrefix",function(a,b){var c=a(b+"/item/:id",{id:"@_id"});return c}]),angular.module("ikelClientApp").factory("Plea",["$resource","apiPrefix",function(a,b){var c=a(b+"/pleas");return c}]),angular.module("ikelClientApp").controller("LandingCtrl",["$scope","$location","Order",function(a,b,c){c.query({},function(a){a.length>0?b.path("order/"+a[0]._id):b.path("createOrder")})}]),angular.module("ikelClientApp").controller("OrderCtrl",["$scope","$location","$routeParams","$q","Order","Item",function(a,b,c,d,e,f){a.resolved=!1;var g=function(){a.order.total=a.order.items.reduce(function(a,b){return a+parseFloat(b.price||0)},0),a.order.paid=a.order.items.reduce(function(a,b){return a+(b.paid?parseFloat(b.price||0):0)},0)},h=function(){a.order=e.get({id:c.orderId});var b=f.query({order:c.orderId});d.all({order:a.order.$promise,items:b.$promise}).then(function(b){a.order.items=b.items,g(),a.resolved=!0})};h(),a.itemChanged=function(a,b){f.save(a),g()},a.deleteItem=function(b,c){b.$delete(function(){a.order.items.splice(c,1),g()})},a.$on("item_added",function(b,c){c._order===a.order._id&&(a.order.items.push(c),g(),h())})}]),angular.module("ikelClientApp").controller("OrdersListCtrl",["$scope","Order",function(a,b){a.orders=b.query({}),a.orders.$promise["catch"](function(){a.orders.error=!0});var c=function(b){return a.orders.some(function(a){return a._id===b._id})};a.$on("order_added",function(b,d){c(d)||a.orders.push(d)}),a.$on("REMOTE_ORDER_ADDED",function(b,d){c(d)||a.orders.push(d)}),a.$on("order_deleted",function(b,c){a.orders=a.orders.filter(function(a){return a._id!==c._id}),a.orders.$resolved=!0}),a.$on("$routeChangeSuccess",function(b,c){a.orders.forEach(function(a){a.viewing=("/order/:orderId"===c.originalPath||"/deleteOrder/:orderId"===c.originalPath||"/printOrder/:orderId"===c.originalPath)&&c.params.orderId===a._id})})}]),angular.module("ikelClientApp").controller("CreateOrderCtrl",["$rootScope","$scope","$location","Order","localStorageService",function(a,b,c,d,e){var f=e.get("assumedAuthor");f&&(b.order={},angular.extend(b.order,f)),b.save=function(){d.save(b.order,function(d){var f={author:b.order.author,email:b.order.email};e.add("assumedAuthor",f),c.path("/order/"+d._id),a.$broadcast("order_added",d)})}}]),angular.module("ikelClientApp").controller("CreateItemCtrl",["$scope","$routeParams","Item","Order","localStorageService",function(a,b,c,d,e){a.orderId=b.orderId,a.choices=[],a.resolved=!0,c.query({order:a.orderId}).$promise.then(function(b){var c=b.reduce(function(a,b){return a[b.name.toLowerCase()]=b,a},{});Object.keys(c).forEach(function(b){a.choices.push(c[b])})}),a.item={_order:b.orderId};var f=e.get("assumedAuthor");f&&(a.item.author=f.author),a.itemNameChanged=function(){var b=a.order.items.filter(function(b){return b.name===a.item.name});b.length>0&&(a.item.price=b[0].price)},a.save=function(){a.resolved=!1,a.item.paid=!1;var b=angular.extend({},a.item);b.price=parseFloat(b.price),e.set("assumedAuthor",{author:a.item.author}),c.save(a.item,function(b){a.item.name="",a.item.price="",a.resolved=!0,a.$emit("item_added",b)})}}]),angular.module("ikelClientApp").controller("PrintOrderCtrl",["$scope","$routeParams","Order","Item",function(a,b,c,d){a.order=c.get({id:b.orderId},function(a){a.items=d.query({order:a._id},function(b){a.total=b.reduce(function(a,b){return a+parseFloat(b.price||0)},0),a.paid=b.reduce(function(a,b){return a+(b.paid?parseFloat(b.price||0):0)},0),a.summary=b.reduce(function(a,b){return a[b.name]||(a[b.name]={name:b.name,count:0,authors:{},subtotal:0,price:b.price}),a[b.name].authors[b.author]||(a[b.name].authors[b.author]={paid:!0,count:0}),a[b.name].authors[b.author].count=a[b.name].authors[b.author].count+1,a[b.name].authors[b.author].paid=a[b.name].authors[b.author].paid&&b.paid,a[b.name].count=a[b.name].count+1,a[b.name].subtotal=a[b.name].subtotal+parseFloat(b.price),a[b.name].price=b.price,a},{})})})}]),angular.module("ikelClientApp").controller("DeleteOrderCtrl",["$rootScope","$scope","$routeParams","$location","Order",function(a,b,c,d,e){b.order=e.get({id:c.orderId}),b.confirm=function(){b.order.$delete(function(){a.$broadcast("order_deleted",b.order),d.path("/")})}}]);