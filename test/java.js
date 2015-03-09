'use strict';

var java = require('java');
java.classpath.push('test.jar');

// https://www.npmjs.com/package/java#javaImport

function test1() {
  var f = function (err, result) {
    if(err) console.error('ERROR@Callback', err);
    else console.log('OK@Callback', result);
  };
  var t1 = java.newInstanceSync('com.test.NodeTest');
  var r1 = java.callMethodSync(t1, 'greeting', 'Harry');
  console.log('Harry@Nodejs: ', r1);
  try {
    var r2 = java.callMethodSync(t1, 'greeting', 'Barry');
    console.log('Barry@Nodejs: ', r2);
  } catch (e) {
    console.log(e);
  }
  
  var t2 = java.newInstanceSync('com.test.NodeTest');
  var r3 = java.callMethod(t2, 'greeting', 'May', f);
  console.log('May@Nodejs: ', r3);
  var r4 = java.callMethod(t2, 'greeting', 'Ben', f);
  console.log('Ben@Nodejs: ', r4);
}

function test2() {
  var v = java.newProxy('com.test.Visitor', {
    visit: function (item) {
      // This is actually run on the v8 thread and not the new java thread
      if (item['valuesSync']) {
        console.log(item.keySetSync().toArraySync());
        console.log(item.valuesSync().toArraySync());
      } else {
        console.log(item);
      }
    }
  });
  var t = java.newInstanceSync('com.test.NodeTest');
  var r = java.callMethodSync(t, 'walk', v);
  // console.log(r);
}

// test1();
test2();
