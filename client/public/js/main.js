angular
  .module('scheduler', [
    'ui.router'
  ])
  .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: 'homeCtrl'
      })
      .state('employees', {
        url: '/employees',
        templateUrl: 'templates/employees.html'
      })
      .state('restaurant', {
        url: '/restaurant',
        templateUrl: 'templates/restaurant.html',
        resolve: {
          restaurants: ['$http', function($http) {
            return $http.get('/api/restaurants/');
          }]
        },
        controller: 'restaurantCtrl'
      })
      .state('schedule', {
        url: '/schedule',
        templateUrl: 'templates/schedule.html'
      })
      .state('login', {
        url:'/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      });
  }]);
