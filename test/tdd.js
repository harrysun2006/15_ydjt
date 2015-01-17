'use strict';

// http://chaijs.com/api/bdd
var assert = require('chai').assert;
var expect = require('chai').expect;

suite 'Array', !->
    setup !->
        console.log 'setup'

    teardown !->
        console.log 'teardown'

    suite '#indexOf()', !->
        test 'should return -1 when not present', !->
            assert.equal -1, [1,2,3].indexOf 4