angular
  .module('scheduler')
  .controller('restaurantCtrl', ['$scope', 'restaurants', function($scope, restaurants) {
    $scope.restaurants = restaurants;
    console.log(restaurants);
  }]);
