'use strict';

// http://chaijs.com/api/bdd
var assert = require('chai').assert;
var expect = require('chai').expect;
var jwt = require('jsonwebtoken');
var restler = require('restler');
// var request = require('request');
var crypto = require('crypto');
var _ = require('lodash');

var config = {
  host: 'http://localhost',
  port: 3000,
  url: 'http://localhost:3000'
};
var api = function(uri) {
  return config.url + uri;
};

describe('Calories tracker API', function() {

  before(function() {
    // console.log('before');
  });

  after(function() {
    // console.log('after');
  });
  
  /*
  beforeEach(function() {
    // console.log('beforeEach');
  });
  
  // afterEach would prevent subsequent cases from running
  afterEach(function() {
    // console.log('afterEach');
  });
  */

  var demo = {username: 'demo', password: 'demo', password1: 'demo', password2: 'demo', setting: {expNumber: 1800} };
  var test = {username: 'test', password: 'test', password1: 'test', password2: 'test', setting: {expNumber: 3600} };

  function hash(u) {
    var md5 = crypto.createHash('md5');
    var r = _.clone(u);
    r.password = md5.update(r.password).digest('hex');
    return r;
  }

  function login(u, next) {
    var f = function(result, response) {
      u._token = result._token;
      next(u);
    };
    assert.isObject(u);
    assert.property(u, 'password');
    restler.post(api('/login'), { data: hash(u) }).on('complete', f);
  };

  describe('/register', function() {
    it('no data', function(done) {
      restler.post(api('/register'), {
      }).on('complete', function(result, response) {
        expect(response.statusCode).to.equal(400);
        expect(result.error).to.not.be.empty();
        done();
      });
    });

    it('invalid data', function(done) {
      // move below into unit test?
      var datas = [undefined, null, {},
        {username: undefined},
        {username: null},
        {username: 1},
        {username: ''},
        {username: 'ab'},
        {username: 'ada'},
        {username: 'ada', password1: ''},
        {username: 'ada', password1: '123'},
        {username: 'ada', password1: '1234'},
        {username: 'ada', password1: '1234', password2: '12345'},
      ];
      var c = 0;
      var f = function(result, response) {
        expect(response.statusCode).to.equal(400);
        expect(result.error).to.not.be.empty();
        if (++c == datas.length) done();
      };
      for (var i = 0; i < datas.length; i++) {
        restler.post(api('/register'), { data: datas[i] }).on('complete', f);
      }
    });

    it('normal', function(done) {
      var username = 'harry';
      restler.post(api('/register'), {
        data: { 
          username: username, 
          password1: 'test',
          password2: 'test',
          setting: {expNumber: 3000}
        },
      }).on('complete', function(result, response) {
        if (response.statusCode == 400) {
          // expect(result.error).to.equal('User ' + username + ' already exists!');
          expect(result.error).to.not.be.empty();
        } else if (response.statusCode == 200) {
          expect(result.username).to.equal(username);
        }
        done();
      });
    });

  });
  
  describe('/login', function() {
    
    before(function() {
    });

    it('post only', function(done) {
      var u = hash({ username: 'demo', password: 'demo' });
      var c = 0;
      var f = function(result, response) {
        expect(response.statusCode).to.equal(404);
        // expect(result).to.not.be.empty();
        if (++c == 5) done();
      };
      restler.get(api('/login'), { data: u }).on('complete', f);
      restler.put(api('/login'), { data: u }).on('complete', f);
      restler.del(api('/login'), { data: u }).on('complete', f);
      restler.head(api('/login'), { data: u }).on('complete', f);
      restler.patch(api('/login'), { data: u }).on('complete', f);
    });

    it('invalid user', function(done) {
      var u = { username: 'demo1', password: 'demo' };
      var f = function(result, response) {
        expect(response.statusCode).to.equal(404);
        expect(result._token).to.be.undefined;
        expect(result).to.not.be.empty();
        done();
      };
      restler.post(api('/login'), { data: hash(u)}).on('complete', f);
    });

    it('wrong password', function(done) {
      var u = { username: 'demo', password: 'demo1' };
      var f = function(result, response) {
        expect(response.statusCode).to.equal(400);
        expect(result._token).to.be.undefined;
        expect(result).to.not.be.empty();
        done();
      };
      restler.post(api('/login'), { data: hash(u)}).on('complete', f);
    });

    it('valid', function(done) {
      var u = { username: 'demo', password: 'demo' };
      var f = function(result, response) {
        expect(response.statusCode).to.equal(200);
        expect(result._token).to.not.be.empty();
        done();
      };
      restler.post(api('/login'), { data: hash(u) }).on('complete', f);
    });
    
  });

  describe('/profile', function() {
    it('without auth token', function(done) {
      var test = { username: 'test', password: 'test' };
      var f = function(result, response) {
        expect(response.statusCode).to.equal(401);
        expect(result.error).to.not.be.empty();
        done();
      };
      restler.put(api('/profile'), { data: test }).on('complete', f);
    });
    
    it('with auth token - modify other\'s data', function(done) {
      var f = function(result, response) {
        expect(response.statusCode).to.equal(403);
        expect(result.error).to.not.be.empty();
        done();
      };
      login(demo, function(u) {
        restler.put(api('/profile'), { accessToken: u._token, data: hash(test) }).on('complete', f);
      });
    });
    
    it('with auth token - modify own data', function(done) {
      var f = function(result, response) {
        // console.log(result);
        expect(response.statusCode).to.equal(200);
        expect(result).to.not.be.empty();
        // var s = JSON.parse(result);
        // expect(result.setting.expNumber).to.equal(demo.setting.expNumber);
        done();
      };
      login(demo, function(u) {
        restler.put(api('/profile'), { accessToken: u._token, data: hash(demo) }).on('complete', f);
      });
    });
  });

  describe('/logout', function() {
    it.only('normal', function(done) {
      var token;
      var f1 = function(result, response) {
        // console.log(result);
        expect(response.statusCode).to.equal(200);
        expect(result).to.not.be.empty();
        logout();
      };
      var f2 = function(result, response) {
        // console.log(result);
        expect(response.statusCode).to.equal(200);
        expect(result).to.not.be.empty();
        expect(result._token).to.equal(token);
        list(f3);
      };
      var f3 = function(result, response) {
        // console.log(result);
        expect(response.statusCode).to.equal(401);
        expect(result.error).to.not.be.empty();
        done();
      };
      var logout = function() {
        restler.get(api('/logout'), { accessToken: token }).on('complete', f2);
      };
      var list = function(f) {
        restler.get(api('/calories'), { accessToken: token }).on('complete', f);
      }
      login(demo, function(u) {
        token = u._token;
        list(f1);
      });
    });
    
  });

});

