window.qapp = angular.module('Qapp', ['ui.router', 'ui.bootstrap', 'qapp.controllers']);

window.qapp.config(function($stateProvider, $urlRouterProvider) {
  // Setup routes
  $stateProvider
  .state('app', {
    abstract: true,
    url: '/app',
    templateUrl: '/static/part/menu.html',
    controller: 'globalCtrl'
  })
  .state('app.login', {
    url: '/login',
    templateUrl: '/static/part/login.html',
    controller: 'loginCtrl'
  })
  .state('app.dash', {
    url: '/dash',
    templateUrl: '/static/part/dash.html',
    controller: 'dashCtrl'
  })
  .state('app.questions', {
    url: '/questions',
    templateUrl: '/static/part/questions.html',
    controller: 'questionsCtrl'
  })
  .state('app.responce', {
    url: '/responce',
    templateUrl: '/static/part/responce.html',
    controller: 'responceCtrl'
  });

  // Default redirect
  $urlRouterProvider.otherwise('/app/dash');
});