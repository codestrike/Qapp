angular.module('qapp.controllers', ['ngCookies'])
.controller('globalCtrl', function($cookies, $http, $rootScope, $scope, $state) {
  $scope.inSession = false;
  $rootScope.inSession = $scope.inSession;

  if(window.innerWidth < 768)
    $scope.isCollapsed = true;
  else
    $scope.isCollapsed = false;

  $scope.showSidebar = function(yes) {
    $scope.inSession = yes;
  };

  $rootScope.$on('$stateChangeStart', function(ev, toState, toPara, fromState) {
    if(!$cookies.auth_tkt && toState.name != 'app.login') {
      if (toPara.fromLogin != 'yes') {
        console.log('Permission Denied 403');
        ev.preventDefault();
        $state.go('app.login');
      }
    } else if(!!$cookies.auth_tkt && toState.name == 'app.login') {
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
.controller('dashCtrl', function($http, $scope){
  $scope.showSidebar(true);
  // TODO: get list of user's files
  
})
.controller('questionsCtrl', function($http, $scope) {
  $scope.showSidebar(true);
});
