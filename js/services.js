facebook
// Service to be used as a flag to now if the user is currently logged in or not
.factory('AuthenticationService', function() {
	var auth = {
		isLogged: false
	};
	return auth;
})
// Service to log in to facebook
.factory('UserService', function($http) {
	return {
		logIn: function(username, password) {
			return $http.post('/login', {username: username, password: password});
		}
	};
})
// Service to intercept an http request to check for the token in the user's browser
.factory('TokenInterceptor', function ($q, $window, AuthenticationService) {
    return {
        request: function (config) { //http config object
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config; //the http config object should be returned
        },
        response: function (response) {
            return response || $q.when(response);
        }
    };
});