'use strict';

var AUTH_ENUM = { eToken: 1, eForm: 2};
var AUTH_TYPE = AUTH_ENUM.eToken;

var GLOBAL_SETTINGS = {
    portApi: 3000,
    portWeb: 81,
    secret: 'toptal.calories',
    privKey: 'toptal.calories', // fs.readFileSync(path.join(__dirname, 'priv.pem'));
    pubKey: 'toptal.calories', // fs.readFileSync(path.join(__dirname, 'pub.pem'));
    tokenOption: {algorithm: 'HS256', expiresInMinutes: 5},
    isFormAuth: function() { 
      return AUTH_TYPE == AUTH_ENUM.eForm;
    },
    isTokenAuth: function() { 
      return AUTH_TYPE == AUTH_ENUM.eToken;
    },
    mongoUrl: 'mongodb://localhost/calories',
    redisHost: 'localhost',
    redisPort: 6379
};

exports.settings = GLOBAL_SETTINGS;
