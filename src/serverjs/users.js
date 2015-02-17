var jwt = require('jsonwebtoken');
var secret = require('./secret');
var tokenManager = require('./token_manager');
var MongoClient = require('mongodb').MongoClient;

exports.signin = function(req, res) {

	//Save the username and password sent in the body of the request object
	var username = req.body.username || '';
	var password = req.body.password || '';

	//if the username and password are empty, return an unauthorized status (401)
	if (username == '' || password == '') { 
		return res.send(401); 
	}

	//Connect to the MongoDB 'facebook' database
	return MongoClient.connect("mongodb://localhost:27017/facebook", function(err,db){
		//Authenticate the user with the username and password sent in the body of the request
		return db.authenticate(username,password,function(err,loggedIn){
			//loggedIn will be true or false
			//If its false, return an unauthorized error
			if(!loggedIn){
				db.close();//close the mongodb connection
				//this error will be detected by the express error middleware
				return new Error(401); //Unauthorized Error
			}
			//This creates the token that will be sent back to the client side
			var token = jwt.sign({id: "ostos"}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
			db.close(); //close the mongodb connection
			return res.json({token:token}); //The response object will return the token in a json object
		});

	});
};

//MONGODB EXAMPLE BELOW

//----------------------------------------MONGO------------------------------------------------
// var MongoClient = require('mongodb').MongoClient;

// MongoClient.connect("mongodb://localhost:27017/facebook", function(err,db){
// 	var authenticated = false;
// 	if(!err)
// 		console.log("Connected to the facebook database!");

// 	var usersCollection = db.collection("users").find().toArray(function(err,documents){
// 		console.log(documents);
// 	});

// 	db.authenticate("fbuser","user",function(err,res){
// 		authenticated = res;
// 		console.log(authenticated);
// 		var usersCollection = db.collection("users").find().toArray(function(err,documents){
// 			for(var i = 0; i < documents.length; i++){
// 				console.log(documents[i]);
// 			}
// 		});
// 	});

// });

//--------------------------------------MONGO ENDS---------------------------------------------