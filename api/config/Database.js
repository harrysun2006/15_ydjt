'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var global = require('./Global').settings;

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

var User = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  salt: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  setting: {type: Object, required: true},
  personId: { type: Schema.ObjectId, ref: 'Person' },
  creator: { type: Schema.ObjectId, ref: 'User' },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var Role = new Schema({
  name: { type: String, required: true }
});

var UserRole = new Schema({
  userId: { type: Schema.ObjectId, ref: 'User' },
  roleId: { type: Schema.ObjectId, ref: 'Role' },
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var Person = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, default: Date.now },
  gender: { type: String, required: true },
  telephone: { type: String },
  fax: { type: String },
  mobile: { type: String },
  creator: { type: Schema.ObjectId, ref: 'User' },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var Folder = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  parentId: { type: Schema.ObjectId, ref: 'Folder' },
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var Quiz = new Schema({
  quizType: { type: Schema.ObjectId, ref: 'QuizType', required: true },
  title: { type: String, required: true },
  content: { type: Object, required: true }, // json format
  answer: { type: Object, required: true }, // json format
  score: { type: Number, default: 0 }, // can be overwritten
  hardship: { type: Number, default: 0 }, // 0-100
  duration: { type: Number, default: 60 }, // resolving time limit, in seconds, 0-no time limit 
  hashcode: { type: String, required: true, unique: true },
  comments: { type: Object }, // in hierarchy
  description: { type: String },
  setting: {type: Object, required: true},
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now },
  checkClass: { type: Object } // or String, class to check, manual checker class is predefined
});

var QuizType = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String },
  renderClass: { type: String, required: true },
  checkClass: { type: String, required: true }
});

var Keyword = new Schema({
  keyword: { type: String, required: true, unique: true },
  popularity: { type: Number, default: 0 }
});

// create indexes on title and content for quiz
var QuizIndex = new Schema({
  quizId: { type: Schema.ObjectId, ref: 'Quiz', required: true },
  keywordId: { type: Schema.ObjectId, ref: 'Quiz', required: true },
  relativity: { type: Number, default: 1 }
});

var Tag = new Schema({
  code: { type: String, required: true, unique: true },
  text: { type: String, required: true, unique: true },
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

// relativity: 1~100, several sources: used count, directory location
var QuizTag = new Schema({
  quizId: { type: Schema.ObjectId, ref: 'Quiz', required: true },
  tagId: { type: Schema.ObjectId, ref: 'Tag', required: true },
  relativity: { type: Number, default: 1 },
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var Section = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  parentSectionId: { type: Schema.ObjectId, ref: 'Section' },
  duration: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  setting: {type: Object, required: true},
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var SectionQuiz = new Schema({
  sectionId: { type: Schema.ObjectId, ref: 'Section', required: true },
  quizId: { type: Schema.ObjectId, ref: 'Quiz', required: true },
  sequence: { type: Number, default: 0 },
  score: { type: Number, default: 0 }, // can be overwritten
  setting: {type: Object, required: true}, // font, color, paragraph etc.
  hardship: { type: Number, default: 0 }, // 0-100
  duration: { type: Number, default: 60 } // resolving time limit, in seconds, 0-no time limit 
});

var Test = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  description: { type: String },
  testTime: { type: Date, default: Date.now },
  creator: { type: Schema.ObjectId, ref: 'User', required: true },
  createTime: { type: Date, default: Date.now },
  updater: { type: Schema.ObjectId, ref: 'User', required: true },
  updateTime: { type: Date, default: Date.now }
});

var TestAttendee = new Schema({
  testId: { type: Schema.ObjectId, ref: 'Test', required: true },
  personId: { type: Schema.ObjectId, ref: 'Person', required: true },
  attendTime: { type: Date, default: Date.now },
  finishTime: { type: Date, default: Date.now },
  trace: { type: Object }
});

var TestChecker = new Schema({
  testId: { type: Schema.ObjectId, ref: 'Test', required: true },
  personId: { type: Schema.ObjectId, ref: 'Person', required: true },
  checkTime: { type: Date, default: Date.now },
  finishTime: { type: Date, default: Date.now },
  trace: { type: Object }
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

var user = mongoose.model('User', User);
var role = mongoose.model('Role', Role);
var userRole = mongoose.model('UserRole', UserRole);
var person = mongoose.model('Person', Person);
var folder = mongoose.model('Folder', Folder);
var quiz = mongoose.model('Quiz', Quiz);
var quizType = mongoose.model('QuizType', QuizType);
var keyword = mongoose.model('Keyword', Keyword);
var quizIndex = mongoose.model('QuizIndex', QuizIndex);
var tag = mongoose.model('Tag', Tag);
var quizTag = mongoose.model('QuizTag', QuizTag);
var section = mongoose.model('Section', Section);
var sectionQuiz = mongoose.model('SectionQuiz', SectionQuiz);
var test = mongoose.model('Test', Test);
var testAttendee = mongoose.model('TestAttendee', TestAttendee);
var testChecker = mongoose.model('TestChecker', TestChecker);

// Export Models
exports.user = user;
exports.role = role;
exports.userRole = userRole;
exports.person = person;
exports.folder = folder;
exports.quiz = quiz;
exports.quizType = quizType;
exports.keyword = keyword;
exports.quizIndex = quizIndex;
exports.tag = tag;
exports.quizTag = quizTag;
exports.section = section;
exports.sectionQuiz = sectionQuiz;
exports.test = test;
exports.testAttendee = testAttendee;
exports.testChecker = testChecker;
