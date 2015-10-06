angular
  .module('scheduler')
  .controller('loginCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.login = function() {
      $http.post('/api/user/authenticate', {
        name: $scope.name,
        password: $scope.password
      }).then(function(response) {
        $http.defaults.headers.common['x-access-token'] = response.data.token;
        return response.data;
      });
    };
  }]);
