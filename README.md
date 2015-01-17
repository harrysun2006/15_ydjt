# Calorie Tracker
![applicaiton main UI](https://github.com/harrysun2006/tt_calories/blob/master/main.png)

## Description
- User must be able to create an account and log in
- When logged in, user can see a list of his meals and calories (user enters calories manually, no auto calculations!), also he should be able to edit and delete
- Each entry has a date, time, text, and num of calories
- Filter by dates from-to, time from-to (e.g. how much calories have I had for lunch each day in the last month, if lunch is between 12 and 15h)
- User setting – Expected number of calories per day
- When displayed, it goes green if the total for that day is less than expected number of calories per day, otherwise goes red

## Installation
1. Get the sources with <pre>git clone https://github.com/harrysun2006/tt_calories.git</pre>
2. Install MongoDB
3. Install Node.js and all dependency libraries:
<pre>
cd api
npm install
</pre>
or install these libraries globally:
<pre>
npm install -g
</pre>
and don't forget to set environment NODE_PATH properly, e.g. D:\nodejs\global\node_modules

## Run
1. Run the server.js in api folder:
<pre>
cd api
node server.js
</pre>
2. Open http://localhost:81/ and test it in browser.

## Stack
* AngularJS
* Bootstrap
* jQuery
* Browser libraries: bootstrap-datetimepicker, moment, bootbox
* MongoDB
* Node.js
* Node.js libraries: express, jsonwebtoken, lodash, moment, mongoose, passport etc.

## Test 
mocha -A -G -R spec bdd.js
mocha -A -G -R list bdd.js
mocha -R list bdd.js
mocha -R list test.js

"test": "mocha --require test/support/env --reporter spec --bail --check-leaks test/ test/acceptance/",
"test-cov": "istanbul cover node_modules/mocha/bin/_mocha -- --require test/support/env --reporter dot --check-leaks test/ test/acceptance/",
"test-travis": "istanbul cover node_modules/mocha/bin/_mocha --report lcovonly -- --require test/support/env --reporter spec --check-leaks test/ test/acceptance/"