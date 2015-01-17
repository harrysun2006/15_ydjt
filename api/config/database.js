'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var global = require('./global').settings;

var mongoOptions = global.mongoOptions || { };
var mongoUrl = global.mongoUrl || 'mongodb://localhost/calories';

mongoose.connect(mongoUrl, mongoOptions, function (err, res) {
  if (err) { 
    console.log('ERROR connecting to ' + mongoUrl + '. ' + err);
  } else {
    console.log('Successfully connected to ' + mongoUrl);
  }
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  setting: {type: Object, required: true}
});

var Calorie = new Schema({
  user_id: { type: Schema.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now, required: true },
  time: { type: Number, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

// crypto middleware on UserSchema
// see: http://mongoosejs.com/docs/middleware.html
User.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) return next();
  var md5 = crypto.createHash('md5');
  user.password = md5.update(user.password).digest('hex');
  next();
});

// Password verification
User.methods.comparePassword = function(candidatePassword, cb) {
  /*
  var md5 = crypto.createHash('md5');
  var password = md5.update(candidatePassword).digest('hex');
  return cb(null, (this.password == password));
  */
  return cb(null, (this.password == candidatePassword));
};

var userModel = mongoose.model('User', User);
var calorieModel = mongoose.model('Calorie', Calorie);

// Export Models
exports.userModel = userModel;
exports.calorieModel = calorieModel;
