angular.module('qapp.controllers', ['ngCookies'])
.controller('globalCtrl', function($cookies, $http, $rootScope, $scope, $state) {
  $scope.inSession = false;
  $rootScope.inSession = $scope.inSession;
  $rootScope.server = '10.42.0.1:6543'

  if(window.innerWidth < 768)
    $scope.isCollapsed = true;
  else
    $scope.isCollapsed = false;

  $scope.showSidebar = function(yes) {
    $scope.inSession = yes;
  };

  $scope.setServer = function(address) {
    $rootScope.server = address;
  };

  $scope.getUrl = function(path) {
    return 'http://' + $rootScope.server + path
  }

  $rootScope.$on('$NstateChangeStart', function(ev, toState, toPara, fromState) {
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
  $scope.allQ = $scope.allQ || []
  // get list of existing questions
  $scope.fetchQ = function() {
    $http.get($scope.getUrl('/api/getq')).success(function(res) {
      $scope.allQ = res;
    });
  };
  // integrate modal to add q
  $scope.addQ = function(data) {
    if(data.length && $scope.questionform.$valid) {
      var toSend = {
        question: data.question,
        question_type: data.question_type,
        options: data.options,
        answer: data.answer
      };

      $http.post($scope.getUrl('/api/setq'), toSend).success(function(res) {
        console.log(res)
        // update allQ
        if (res.status == "success")
          $scope.allQ.append(toSend);
      });
    }
  };

  // __init__
  $scope.fetchQ();
});
