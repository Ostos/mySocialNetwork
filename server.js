var express = require("express");
var app = express();
var session = require('express-session');
//Authentication module
var jwt = require('express-jwt');
//bodyParser... it parses the body of the request into a json object
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var tokenManager = require('./serverjs/token_manager');
var secret = require('./serverjs/secret');
var url = require("url");
var fs = require("fs");

var portToListen = 8083;

app.listen(portToListen);

app.use(bodyParser());

var routes = {};
routes.users = require('./serverjs/users.js');

// These headears should be added in every request
// app.all('*', function(req, res, next) {
// 	res.set('Access-Control-Allow-Origin', 'http://localhost');
// 	res.set('Access-Control-Allow-Credentials', true);
// 	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
// 	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
// 	if ('OPTIONS' == req.method) return res.send(200);
// 	next();
// });

app.get("/",function(req,res){
	getResources(req,res);
});

app.get("/profile", jwt({secret:secret.secretToken}), function(req,res){
	getResources(req,res);
});

app.get("/newsFeed", jwt({secret:secret.secretToken}), function(req,res){
	getResources(req,res);
});

//Post and Get methods for the /login path
app.route("/login")
.post(routes.users.signin)
.get(function(req,res){
	getResources(req,res);
});

//These middleware is to handle errors when the token is not valid. It redirects to the login page.
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		// res.redirect(401,"/login");
		// console.log(req.method); ALLREADY IS A GET
		req.method = "GET"; //Just to be 100% sure that it is a GET
		req.path = "/login";
		getResources(req,res);
	}
});

//This middleware is used when nothing was matched before
app.use(function(req,res){
	getResources(req,res);
});


//This method reads the path of the url in order to know what file to open
function getResources(req,res){

	var reqData = {
		url:url.parse(req.url,true),
		method: req.method,
		headers:req.headers
	};

	var path = reqData.url.pathname;

	if(path.match(/.*\.(html|js|css|map|png|woff|json|jpg|ico)$/)){
		path = "." + path;
		if(path.match(/.*\.css$/))
			serveStaticFile(res,path,"text/css");
		if(path.match(/.*\.js$/))
			serveStaticFile(res,path,"application/javascript");
		if(path.match(/.*\.html$/))
			serveStaticFile(res,path,"text/html");
		if(path.match(/.*\.map$/))
			serveStaticFile(res,path,"application/javascript");
		if(path.match(/.*\.png$/))
			serveStaticFile(res,path,"image/png");
		if(path.match(/.*\.woff$/))
			serveStaticFile(res,path,"application/x-font-woff");
		if(path.match(/.*\.json$/))
			serveStaticFile(res,path,"application/json");
		if(path.match(/.*\.jpg$/))
			serveStaticFile(res,path,"image/jpg");
		if(path.match(/.*\.ico$/))
			serveStaticFile(res,path,"image/x-icon");
	}else{
		if(path.match(/^\/([a-zA-Z0-9]+)?$/))
			serveStaticFile(res,"index.html","text/html");
	}	
}

//Sets the properties for the response object. (content type, status, headers...)
function serveStaticFile(res, path, contentType, responseCode) {
	if(!responseCode) responseCode = 200;
	fs.readFile(path, function(err,data) {
		if(err) {
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('404 - File Not Found');
		} else {
			res.writeHead(responseCode,{ 'Content-Type': contentType });
			res.end(data);
		}
	});
}

console.log("Facebook is running in port 8083.");

