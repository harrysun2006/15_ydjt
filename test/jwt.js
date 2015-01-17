var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
var db = require('../api/config/database');
var _ = require('lodash');

const users = [
  { id: 1, username: 'bob', token: '5483ba67ecea1dfc55c368b9', email: 'bob@example.com' },
  { id: 2, username: 'joe', token: '54862712b71dc31c2554be18', email: 'joe@example.com' }
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

// Supported algorithms: "HS256", "HS384", "HS512", "RS256", "RS384", "RS512" and "none"
const ALGORITHMS = [
  'HS256', 'HS384', 'HS512',
  'RS256', 'RS384', 'RS512',
  'ES256', 'ES384', 'ES512',
  'none',
];

const PUB_KEY = fs.readFileSync(path.join(__dirname, 'pub.pem'));
const PRIV_KEY = fs.readFileSync(path.join(__dirname, 'priv.pem'));
const SECRET_KEY = 'toptal.calories';
const EXPIRE_IN_MINUTES = 1;

/**
 * in verify@jwt 2.0.0:
 * return process.nextTick(function() {
 *   callback.apply(null, args)
 * });
 * the callback function will be called after jwt.verify, which might cause a problem
 * 
 * calling verify without callback will return the preload, or throw errors!!!
 * return jwt.verify(tt, secret, options);
 * 
 **/
function test1() {
  var i, alg, options, key, pkey, token, u = null, d, v;
  findByToken('5483ba67ecea1dfc55c368b9', function(err, user) {
    if (err) console.log(err);
    else u = user;
    // u = {_id:user.token, t:new Date().getTime()};
    // u = {_id:user.token};
    // u = user.token;
  });
  // console.log(u);
  if (u == null) return;
  var verify = function(tt, key, options) {
    var r = null;
    jwt.verify(tt, key, options, function(err, d){
      if (err) console.log(err);
      else r = d;
    });
    return r;
  };
  for (i = 0; i < ALGORITHMS.length; i++) {
    alg = ALGORITHMS[i];
    if (alg.indexOf('HS') === 0) {
      key = SECRET_KEY;
      pkey = SECRET_KEY;
    } else {
      key = PRIV_KEY;
      pkey = PUB_KEY;
    }
    options = { algorithm: alg, expiresInMinutes: EXPIRE_IN_MINUTES};
    token = jwt.sign(u, key, options);
    d = jwt.decode(token);
    // console.log('%s: %s', alg, token);
    // console.log('%s: ', alg, d);
    setTimeout(function() {
      var t1 = Math.floor(new Date().getTime()/1000);
      var v1 = verify(arguments[1], arguments[2], arguments[3]);
      console.log('%s: %d, ', arguments[0], t1, v1);
    }, EXPIRE_IN_MINUTES*60*1000-1000, alg, token, pkey, options);
    setTimeout(function() {
      var t2 = Math.floor(new Date().getTime()/1000);
      var v2 = verify(arguments[1], arguments[2], arguments[3]);
      console.log('%s: %d, ', arguments[0], t2, v2);
    }, EXPIRE_IN_MINUTES*60*1000+1000, alg, token, pkey, options);
  }
};

function test2() {
  var i, alg, options, key, pkey, token, u, d, v;
  u = users[0];
  for (i = 0; i < ALGORITHMS.length; i++) {
    alg = ALGORITHMS[i];
    if (alg.indexOf('HS') === 0) {
      key = SECRET_KEY;
      pkey = SECRET_KEY;
    } else {
      key = PRIV_KEY;
      pkey = PUB_KEY;
    }
    options = { algorithm: alg, expiresInMinutes: EXPIRE_IN_MINUTES};
    token = jwt.sign(u, key, options);
    d = jwt.decode(token);
    jwt.verify(token, pkey, options, function(err, data) {
      if (err) v = false;
      else v = data;
    });
    console.log('%s(%s, %s): %s', alg, (u.email == d.email), (u.email == v.email), token);
  }
};

function test3() {
  var r = {};
  var a = {id: 1, name: 'demo'};
  var b = {"_token": 123456789};
  _.extend(r, a, b);
  console.log(r);
  db.userModel.findOne({ username: 'demo' }, function(err, user) {
    /*
    console.log(user);
    console.log(user._doc);
    var d = _.clone(user._doc);
    console.log(d);
    console.log(user._id);
    */
    var c = _.clone(user);
    console.log(c);
  })
};

test2();
// setInterval(test1, 2000);
// test2();