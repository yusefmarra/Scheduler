angular
  .module('scheduler')
  .controller('empCtrl', ['$scope', 'employees', function($scope, employees) {
      $scope.employees = employees.data;
    }]);