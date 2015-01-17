'use strict';

var restler = require('restler');
var restify = require('restify');
var config = {
    host: 'http://localhost',
    port: 3000,
    url: 'http://localhost:3000'
};
var api = function(uri) {
  return config.url + uri;
};

function test1() {
  restler.get('http://google.com').on('complete', function(result) {
    if (result instanceof Error) {
      console.log('Error:', result.message);
      this.retry(5000); // try again after 5 sec
    } else {
      console.log(result.substring(0, 60) + '... ...(' + result.length + ')');
    }
  });
}

function test2() {
  var http = restify.createClient({
    url: 'http://google.com'
  });
  http.get('http://google.com', function(err, req) {
    console.log('starting request...');
    req.on('result', function(err, res) {
      console.log('getting response...');

      res.body = '';
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
        res.body += chunk;
      });

      res.on('end', function() {
        console.log(res.body.substring(0, 60) + '... ...(' + res.body.length + ')');
      });
    });
  });
}

test1();
test2();
