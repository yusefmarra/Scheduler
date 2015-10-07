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
        // templateUrl: 'templates/restaurant.html',
        template: '<h1>test</h1>',
        resolve: {
          restaurants: ['$http', function($http) {
            return $http.get('/api/restaurants/').then(function(response) {
              console.log(response.data);
              return response.data;
            }).error(function(err) {
              return err;
            });
          }]
        },
        // controller: 'restaurantCtrl'
        controller: ['$scope', 'restaurants', function($scope, restaurants) {
          $scope.restaurants = restaurants;
        }]
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
