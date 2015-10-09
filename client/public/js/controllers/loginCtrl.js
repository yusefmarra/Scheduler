angular
  .module('scheduler')
  .controller('loginCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.login = function() {
      $http.post('/api/user/authenticate', {
        name: $scope.email,
        password: $scope.password
      }).then(function(response) {
        $http.defaults.headers.common['x-access-token'] = response.data.token;
        $state.go('home');
        return response.data;
      });
    };
  }]);
