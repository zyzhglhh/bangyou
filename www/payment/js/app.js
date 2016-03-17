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
  .config(['$stateProvider', '$locationProvider', '$urlMatcherFactoryProvider', function($stateProvider, $locationProvider, $urlMatcherFactoryProvider) {

    //$urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);
       
  }])
  .run(['$rootScope', '$state', function($rootScope, $state){
    
  }])
;



angular.module('paymentApp.services', ['ngResource'])
.constant('CONFIG', {
    baseUrl: '/'
})
.factory('Data', ['$resource', '$q', 'CONFIG', '$interval', function ($resource, $q, CONFIG, $interval) {
  var self = this;
  var abort = $q.defer();

  var Api = function () {
    return $resource(CONFIG.baseUrl + ':path/:route', {
        path:'api',
    }, {
      payVerify: {method:'POST', params:{route: 'payVerify'}, timeout: 10000},
      getTrade: {method:'POST', params:{route: 'getTrade'}, timeout: 10000}
    });
  };

  self.Api = Api();
  return self;
}])
.factory('Api', ['Data', '$q', function (Data, $q) {
  var self = this;
  self.payVerify = function (params) {
    var deferred = $q.defer();

    Data.Api.payVerify(params, function (data, headers) {

      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };

  self.getTrade = function (params) {
    var deferred = $q.defer();

    Data.Api.getTrade(params, function(data, headers ) {
      deferred.resolve(data);
    }, function (err) {
      deferred.reject(err);
    });

    return deferred.promise;
  };

  return self;

}])

.factory('PageFunc', ['$ionicPopup', '$ionicScrollDelegate', '$ionicSlideBoxDelegate', '$ionicModal', '$timeout', function ($ionicPopup, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicModal, $timeout) {
  return {
    message: function (_msg, _time, _title) {
      var messagePopup = $ionicPopup.alert({
        title: _title || '消息', 
        template: _msg, 
        okText: '确认', 
        okType: 'button-energized' 
      });
      if (_time) {
        $timeout(function () {
          messagePopup.close('Timeout!');
        }, _time);
      }
      return messagePopup;
    }
  };
}])
;

angular.module('paymentApp.controllers', [])
.controller('AppCtrl', ['$scope', function($scope){

}])
.controller('paymentLoginCtrl', ['$scope', '$location', '$window', 'Api', 'PageFunc', function($scope, $location, $window, Api, PageFunc){
    var query = $location.search();
    var sign = query.sign;
    var sig = query.s;
    var auth = query.ah;
    $scope.showUrl = query.surl;
    $scope.lg = {
      username: '',
      password: ''
    };

    /*Api.getTrade({sign:sign}).then(function(data){

    }, function(err) {
      console.log(err);
    })*/

    $scope.toSubmit = function() {
        var params = {
            sign:sign,
            sig: sig,
            auth: auth,
            username: $scope.lg.username,
            password: $scope.lg.password
          };
        
          Api.payVerify(params).then(function(data){

              PageFunc.message('支付成功!', 2000, '消息').then(function(res) {
                if (res) {
                  $window.location.href = data.results.returnUrl + 
                    '?outTradeNo=' + data.results.outTradeNo +
                    '&tradeNo=' + data.results.tradeNo + 
                    '&notifyId=' + data.results.notifyId + 
                    '&totalFee=' + data.results.totalFee + 
                    '&sign=' + data.results.sign + 
                    '&tradeStatus=' + data.results.tradeStatus;
                }
              });
          }, function(err) {
              $scope.errorInfo = err.data;
          });
    };
    
    //console.log(Api);
    
    
}])
;

