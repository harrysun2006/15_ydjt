var express = require('express')
  , http = require('http')
  , bodyParser = require('body-parser')
  , passport = require('passport')
  , util = require('util')
  , BearerStrategy = require('passport-http-bearer').Strategy;

var users = [
    { id: 1, username: 'bob', token: '123456789', email: 'bob@example.com' }
  , { id: 2, username: 'joe', token: 'abcdefghi', email: 'joe@example.com' }
];

function findByToken(token, fn) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.token === token) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Use the BearerStrategy within Passport.
//   Strategies in Passport require a `validate` function, which accept
//   credentials (in this case, a token), and invoke a callback with a user
//   object.
passport.use(new BearerStrategy({
  },
  function(token, done) {
    // Find the user by token.  If there is no user with the given token, set
    // the user to `false` to indicate failure.  Otherwise, return the
    // authenticated `user`.  Note that in a production-ready application, one
    // would want to validate the token for authenticity.
    // console.log(token);
    findByToken(token, function(err, user) {
      if (err) { console.log(err); return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user);
    });
  }
));

/* 
// Return back the request object example by passing in options "passReqToCallback": true
// Use the BearerStrategy within Passport.
//   Strategies in Passport require a `validate` function, which accept
//   credentials (in this case, a token), and invoke a callback with a user
//   object.
passport.use(new BearerStrategy({ "passReqToCallback": true },
  function(req, token, done) {
    
    //req is passed back here
    console.log(req);
    // asynchronous validation, for effect...
    process.nextTick(function () {
      
      // Find the user by token.  If there is no user with the given token, set
      // the user to `false` to indicate failure.  Otherwise, return the
      // authenticated `user`.  Note that in a production-ready application, one
      // would want to validate the token for authenticity.
      findByToken(token, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      })
    });
  }
));
*/

var api = express();

api.set('port', process.env.PORT || 3000);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({extended: true}));
// Initialize Passport!  Note: no need to use session middleware when each
// request carries authentication credentials, as is the case with HTTP
// Bearer.
api.use(passport.initialize());
api.use(express.static(__dirname + '/public'));
api.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.status(200).end();
  next();
});

http.createServer(api).listen(api.get('port'), function() {
  console.log('API server listening on port %d', api.get('port'));
});

// curl -v http://127.0.0.1:3000/?access_token=123456789
// or request http://localhost:3000 with "authorization: Bearer 123456789" in request header
// passport-http-bearer does not provide token sign/decode/expire(refresh)!!!
// can use jsonwebtoken instead if a complex token is required!!!
api.get('/',
// Authenticate using HTTP Bearer credentials, with session support disabled.
passport.authenticate('bearer', { session: false }),
function(req, res){
  res.json({ username: req.user.username, email: req.user.email });
});

