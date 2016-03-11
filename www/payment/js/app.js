// Ionic Starter App
var dependencies = ['ionic',
                    'paymentApp.services',
                    'paymentApp.controllers'];


var myAppVersion = '0.0.1';
if (!navigator.connection) {
  var Connection = {
    NONE: false
  };
}

angular.module('paymentApp', dependencies)
  .config(['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', function($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {

    $urlMatcherFactoryProvider.strictMode(false);
    
  }])
;



angular.module('paymentApp.services', ['ngResource']);

angular.module('paymentApp.controllers', [])
.controller('paymentAppCtrl', ['$scope', function($scope){

    
}])
;

