angular
  .module('scheduler')
  .controller('homeCtrl', ['$scope', 'home', function($scope) {
    $scope.home = home.data;
  }]);