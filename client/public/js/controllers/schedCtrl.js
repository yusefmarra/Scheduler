angular
  .module('scheduler')
  .controller('schedCtrl', ['$scope', 'schedules', function($scope, schedules) {
    $scope.schedules = schedules.data;
  }]);
