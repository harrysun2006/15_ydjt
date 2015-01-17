'use strict';

// http://mcavage.me/node-restify
// https://github.com/danwrong/restler
// https://github.com/request/request
var assert = require('assert');
var expect = require('chai').expect;
var jwt = require('jsonwebtoken');
var restify = require('restify');
var restler = require('restler');
var request = require('request');
var url = 'http://www.google.com';
var options = {
  tunnel: 'both',
  host: '172.17.0.20', 
  port: 80
};
require('global-tunnel').initialize(options);
// process.env.http_proxy = 'http://172.17.0.20:80'; // not working for restify

describe('General test', function() {

  it('expect', function(done) {
    console.log('Hello Mocha!');
    expect(true).to.equal(true);
    done();
  });

  it('assert', function(done) {
    assert.equal(-1, [1,2,3].indexOf(5));
    assert.equal(-1, [1,2,3].indexOf(0));
    done();
  });
  
  it('jwt', function(done) {
    var user = { id: 1, username: 'bob', token: '5483ba67ecea1dfc55c368b9', email: 'bob@example.com' };
    var key = 'harry';
    var options = { algorithm: 'HS256', expiresInMinutes: 6};
    var token = jwt.sign(user, key, options);
    var d = jwt.decode(token);
    expect(d).to.deep.equal(user);
    jwt.verify(token, key, options, function(err, data) {
      if (err) console.log(err);
      else console.log(data);
      done();
    });
  });
});

describe('RESTful client libraries', function() {
  it('restify', function(done) {
    var http = restify.createClient({
      url: url
    });
    http.get(url, function(err, req) {
      assert.ifError(err); // connection error
      req.on('result', function(err, res) {
        assert.ifError(err); // HTTP status code >= 400

        res.body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          res.body += chunk;
        });

        res.on('end', function() {
          console.log(res.body.substring(0, 60) + '... ...(' + res.body.length + ')');
          done();
        });
      });
    });
  });
  
  it('restler', function(done) {
    restler.get(url).on('complete', function(body, response) {
      if (body instanceof Error) {
        console.log('Error:', body.message);
        this.retry(5000); // try again after 5 sec
      } else {
        console.log(body.substring(0, 60) + '... ...(' + body.length + ')');
      }
      expect(response.statusCode).to.equal(200);
      done();
    });
  });
  
  it('request', function(done) {
    request(url, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(body.substring(0, 60) + '... ...(' + body.length + ')');
      }
      expect(response.statusCode).to.equal(200);
      // response.headers
      // response.request
      done();
    })
  });
});

/*
rest.get('http://twaud.io/api/v1/users/danwrong.json').on('complete', function(data) {
  console.log(data[0].message); // auto convert to object
});

rest.get('http://twaud.io/api/v1/users/danwrong.xml').on('complete', function(data) {
  console.log(data[0].sounds[0].sound[0].message); // auto convert to object
});

rest.get('http://someslowdomain.com',{timeout: 10000}).on('timeout', function(ms){
  console.log('did not return within '+ms+' ms');
}).on('complete',function(data,response){
  console.log('did not time out');
});

rest.post('http://user:pass@service.com/action', {
  data: { id: 334 },
}).on('complete', function(data, response) {
  if (response.statusCode == 201) {
    // you can get at the raw response like this...
  }
});

// multipart request sending a 321567 byte long file using https
rest.post('https://twaud.io/api/v1/upload.json', {
  multipart: true,
  username: 'danwrong',
  password: 'wouldntyouliketoknow',
  data: {
    'sound[message]': 'hello from restler!',
    'sound[file]': rest.file('doug-e-fresh_the-show.mp3', null, 321567, null, 'audio/mpeg')
  }
}).on('complete', function(data) {
  console.log(data.audio_url);
});

// create a service constructor for very easy API wrappers a la HTTParty...
Twitter = rest.service(function(u, p) {
  this.defaults.username = u;
  this.defaults.password = p;
}, {
  baseURL: 'http://twitter.com'
}, {
  update: function(message) {
    return this.post('/statuses/update.json', { data: { status: message } });
  }
});

var client = new Twitter('danwrong', 'password');
client.update('Tweeting using a Restler service thingy').on('complete', function(data) {
  console.log(data);
});

// post JSON
var jsonData = { id: 334 };
rest.postJson('http://example.com/action', jsonData).on('complete', function(data, response) {
  // handle response
});

// put JSON
var jsonData = { id: 334 };
rest.putJson('http://example.com/action', jsonData).on('complete', function(data, response) {
  // handle response
});
*/