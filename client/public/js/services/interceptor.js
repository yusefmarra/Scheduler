module.factory('tokenInterceptor', ['$state',function($state) {
  var tokenInterceptor = {
    responseError: function(response) {
      if (response.code === 403) {
        $state.go('login');
      }
    },
  };

  return tokenInterceptor;
}]);

module.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('tokenInterceptor');
}]);
