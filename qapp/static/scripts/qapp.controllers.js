angular.module('qapp.controllers', ['ngCookies'])
.controller('globalCtrl', function($cookies, $http, $rootScope, $scope, $state) {
  $scope.inSession = false;
  $rootScope.inSession = $scope.inSession;
  $scope.a3file = null; // data about uploaded file

  if(window.innerWidth < 768)
    $scope.isCollapsed = true;
  else
    $scope.isCollapsed = false;

  $scope.getOperations = function(callback) {
    $http.get('/api/operations').success(function(res) {
      for (var i = res.length - 1; i >= 0; i--) {
        res[i].name = res[i].operation.replace(/_/g, ' ');
      };
      $scope.operations = res;
      if (angular.isFunction(callback))
        callback();
    });
  };
  $scope.getOperations();

  $scope.showSidebar = function(yes) {
    $scope.inSession = yes;
  };

  $rootScope.$on('$stateChangeStart', function(ev, toState, toPara, fromState) {
    if(!$cookies.auth_tkt && toState.name != 'app.login' && toState.name != 'app.signup') {
      if (toPara.fromLogin != 'yes') {
        console.log('Permission Denied 403');
        ev.preventDefault();
        $state.go('app.login');
      } else {
        console.log('First Login Allow');
      }
    } else if(!!$cookies.auth_tkt && (toState.name == 'app.login' || toState.name == 'app.signup') ) {
      ev.preventDefault();
      $state.go('app.dash');
    }
  });
})
.controller('loginCtrl', function($cookies, $http, $scope, $state, $templateCache, $timeout) {
  $templateCache.removeAll();
  $scope.showSidebar(false);

  if($cookies.auth_tkt && $cookies.auth_tkt.length > 0)
    $state.go('app.dash', {fromLogin:'yes'});

  $scope.try_login = function() {
    if($scope.loginform.$valid) {
      $http.post('/api/login', {
        email: $scope.email,
        passwd: $scope.passwd
      }).success(function(res) {
        console.log('LOGIN SUCCESS', res);
        if(res.status == 'success') {
          $scope.getOperations(function() {
            console.log('Login SUCCESS; Redirecting to dash');
            $state.go('app.dash', {fromLogin:'yes'});
          });
        } else {
          // Show Error Message
          $scope.errorMessage = 'Wrong Credentials';
          $timeout(function() {
            $scope.errorMessage = '';
          }, 5000);
          $scope.passwd = ''
        }
      });
    }
  };
})
.controller('signupCtrl', function($http, $scope, $state, $timeout) {
  $scope.showSidebar(false);
  $scope.doSignup = function() {
    if($scope.signupform.$valid) {
      $http.post('/api/signup', {
        name: $scope.name,
        email: $scope.email,
        passwd: $scope.passwd
      }).success(function(res) {
        if(res.status == 'success') {
          if(res.u3id != null) {
            // ACCOUNT CREATED SUCCESSFULLY
            $scope.displayMessage = 'Account Created.';
            $timeout(function() {
              $state.go('app.login');
            }, 5000);
          } else {
            $scope.displayMessage = 'This Email ID Is Already Used.';
          }
        } else {
          $scope.displayMessage = 'Unable To Create New Account.';
        }

        $timeout(function() {
          $scope.displayMessage = ''
        }, 10000);
      }).error(function(res, status) {
        console.log("SIGNUP FAIL", status, res);
      })
    }
  }
})
.controller('dashCtrl', function($http, $scope){
  $scope.showSidebar(true);
  // TODO: get list of user's files
  
})
.controller('plotCtrl', function($scope) {
  $scope.showSidebar(true);
  $scope.imageUrl = '';
  $scope.imageType = null;

  $scope.plotImage = function(imageType) {
    if($scope.imageType != imageType) {
      // $http.get() TODO
    }
  }
})
.controller('cleanupCtrl', function($http, $scope) {
  $scope.showSidebar(true);
  $scope.selectedOperation = 0;
  $scope.params = {};
  $scope.allColumns = [
    {'name':'Q1', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q2', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q3', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q4', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q5', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q6', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q7', 'attrone':'something', 'attrtwo':'value of it'},
    {'name':'Q8', 'attrone':'something', 'attrtwo':'value of it'}
    ];

  $scope.resetParams = function() {
    $scope.params = {};
  }

  $scope.performOperation = function() {
    console.log($scope.cleanupform.$valid);
    console.log($scope.selectedOperation, $scope.operations[$scope.selectedOperation]);
    console.log($scope.params);
    var toSend = $scope.operations[$scope.selectedOperation] ;
    toSend.para = $scope.params;

    $http.post('/api/cleanup',toSend )
    .success(function(res){
    	console.log("data sent")
    });
  }

});
