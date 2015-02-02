facebook
// Main controller 
.controller("facebookCtrl", ["$scope","$resource", function($scope,$resource){

	$scope.title = "Facebook";
	$scope.friendRequests = [];
	$scope.search = "";

	// Get data for the friend requests section
	var friendRequests = $resource("/data/friendrequests.json",{});
	friendRequests.query({}).$promise.then(function(friends){
		$scope.friendRequests = friends;
	});

	// Get the DustJS template for the wall posts
	$.ajax({
		url:"/partials/dust-template-wall-post.html",
		// async:false,
		success: function(temp){
			dust.loadSource(dust.compile(temp,"wall-post"));
		}
	});

}])
.controller("homeCtrl", ["$scope","$resource", function($scope,$resource){

	// Element to start adding new posts on the wall
	var wall = $("#wall .wall:first");

	// Get information for the posts and render them using the DustJS template
	// The $resource service works on top of the $http service to make an http request
	var friendRequests = $resource("/data/friendrequests.json",{});
	// The query method expects an array in json format from the http request
	friendRequests.query({}).$promise.then(function(friends){
		post(friends[2],"Greetings from Tijuana!","",friends[0],wall);
		post(friends[1],"Ready to go to work","",friends[0],wall);
		post(friends[3],"I just got married!",friends[3].photo,friends[0],wall);
		post(friends[0],"Today's my birthday!","",friends[0],wall);
	});

}])
.controller("profileCtrl", ["$scope", function($scope){

	$scope.title = "Profile";

}])
.controller("loginCtrl",['$scope', '$location', '$window', 'UserService', 'AuthenticationService', function($scope, $location, $window, UserService, AuthenticationService) {
	$scope.username = "";
	$scope.password = "";

	 $scope.logIn = function logIn(username, password) {
	 	if (username !== undefined && password !== undefined) {

	 		UserService.logIn(username, password)
	 		// If the login was successfull
	 		.success(function(data) {
	 			AuthenticationService.isLogged = true;
	 			$window.sessionStorage.token = data.token;
	 			$location.path("/newsFeed");
	 		})
	 		// If there was an error with the username and/or password
	 		.error(function(status, data) {
	 			$("#login-error-message").html("Incorrect username or password");
	 		});
	 	}
	 };
}])