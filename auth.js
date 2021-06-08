var jwt = require('express-jwt');
var secret = require('./config').secret;

function getTokenFromHeader(req) {
  if (req.headers.authorization) {
    return req.headers.authorization;
  }
  console.log("auth fail");
  return null;
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
};

module.exports = auth;