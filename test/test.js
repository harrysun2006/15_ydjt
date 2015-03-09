'use strict';

var path = require('path');
var assert = require('assert');
var expect = require('chai').expect;
var jwt = require('jsonwebtoken');
var request = require('request');
var db = require('../api/config/Database');

var url = 'http://www.google.com';

xdescribe('General test', function() {

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

xdescribe('RESTful client libraries', function() {

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

describe('doc', function() {
  
  it('textract', function(done) {
    var textract = require('textract');
    var docPath = path.join( __dirname, "../doc", "01.doc" );
    textract(docPath, function( error, text ) {
      expect(error).to.be.null;
      expect(text).to.be.an('string');
      console.log(text);
      done();
    });
  });
  
  it('cfb', function(done) {
    var cfb = require('cfb');
    var doc = cfb.read('../doc/01.doc', {type: 'file'});
    var w = doc.find('Word Document');
    console.log(doc);
    console.log(w);
    done();
  });
  
  it.only('office', function(done) {
    var office = require('office');
    office.parse('../doc/01.doc', function(err, data) {
        console.log(data);
    });
    done();
  });
});

