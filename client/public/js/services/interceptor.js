angular
  .module('scheduler')
  .factory('tokenInterceptor', ['$q', '$injector', function ($q, $injector) {
    return {
      'responseError': function (rejection) {
        if (rejection.status == "403") {
          $injector.get('$state').go('login');
        } else {
          return $q.reject(rejection);
        }
      }
    };
  }]);
