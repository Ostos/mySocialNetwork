var TOKEN_EXPIRATION = 60;
var TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60;
var secret = require("./secret.js");

// Middleware for token verification
exports.verifyToken = function (req, res, next) {
	var token = getToken(req.headers);

	if(token == secret.secretToken){
		next();
	}else{
		res.send(401);
	}
};

var getToken = function(headers) {
	if (headers && headers.authorization) {
		var authorization = headers.authorization;
		var part = authorization.split(' ');

		if (part.length == 2) {
			var token = part[1];

			return part[1];
		}
		else {
			return null;
		}
	}
	else {
		return null;
	}
};

exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;