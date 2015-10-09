angular
  .module('scheduler', [
    'ui.router'
  ])
  .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', function($urlRouterProvider, $stateProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      })
      .state('employees', {
        url: '/employees',
        templateUrl: 'templates/employees.html',
        resolve: {
          employees: ['$http', '$state', function($http, $state) {
            return $http.get('/api/employees/');
          }]
        },
        controller:'empCtrl'
      })
      .state('restaurant', {
        url: '/restaurant',
        templateUrl: 'templates/restaurant.html',
        resolve: {
          restaurants: ['$http', '$state', function($http, $state) {
            return $http.get('/api/restaurants/');
          }]
        },
        controller: 'restaurantCtrl'
      })
      .state('schedule', {
        url: '/schedule',
        templateUrl: 'templates/schedule.html',
        resolve: {
          schedules: ['$http', '$state', function($http, $state) {
            return $http.get('/api/schedules/');
          }]
        },
        controller: 'schedCtrl'
      })
      .state('login', {
        url:'/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      });

    $httpProvider.interceptors.push('tokenInterceptor');

  }]);
