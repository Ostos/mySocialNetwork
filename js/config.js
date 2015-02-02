facebook
.config(["$locationProvider","$routeProvider","$httpProvider", function($locationProvider,$routeProvider,$httpProvider){

	// Add to the interceptors the TokenInterceptor service
	$httpProvider.interceptors.push('TokenInterceptor');

	// Delete the default hash from the url
	$locationProvider.html5Mode(true);

	$routeProvider
	.when("/profile", {
		templateUrl:"/partials/profile.html",
		controller:"profileCtrl",
		access:{requiredLogin:true}
	})
	.when("/newsFeed",{
		templateUrl:"/partials/newsFeed.html",
		controller:"homeCtrl",
		access:{requiredLogin:true}
	})
	.when("/login",{
		templateUrl:"/partials/login.html",
		controller:"loginCtrl",
		access:{requiredLogin:false}
	})
	.otherwise({redirectTo:"/login"});
}])