var redis = require('redis');

var redisClient = redis.createClient(6379);

redisClient.on('error', function (err) {
  console.log('Cannot connect redis: ' + err);
});

redisClient.on('connect', function () {
  console.log('Successfully connected to redis!');
});

var ready = function() {
  return redisClient.connected && redisClient.ready;
};

function test1() {
  redisClient.set('name', 'Harry');
  var get = function(err, value) {
    if (err) console.log('Error: ' + err);
    console.log('1.name = ' + value);
    redisClient.del('name');
    redisClient.get('name', function(err, value) {
      console.log('2.name = '+ value);
    });
  };
  redisClient.get('name', get);
};

test1();
