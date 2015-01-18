var moment = require('moment')
var db = require('../config/database.js');
var validator = require('../config/validator.js');
var dateFormat = 'DD/MM/YYYY';

exports.list = function(req, res) {
	db.calorieModel.find({user_id: req.user._id}, function(err, results) {
		if (err) {
			return res.status(500).send({error:err});
		}
		return res.status(200).send(results);
	});
};

exports.search = function(req, res) {
	var c = req.body;
	var options = {sort: {date: 1}};
	var q = db.calorieModel.find({user_id: req.user._id});
	// console.log(c);
	/*
	if (c.description) {
		q.and({description: {$regex: '.*'+c.description+'.*', $options: 'i' }});
	}
	*/
	if (c.date_from) {
	  var df = moment(c.date_from, dateFormat);
		q.where('date').gte(df.toDate());
	}
	if (c.date_to) {
	  var dt = moment(c.date_to, dateFormat).add('days', 1);
		q.where('date').lt(dt.toDate());
	}
	q.exec(function(err, results) {
		if (err) {
			return res.status(500).send({error:err});
		}
		return res.status(200).send(results);
	});
};

exports.create = function(req, res) {
	var data = req.body;
	var error = validator.checkCalorie(data);
	// console.log(data);
	if (error) {
		return res.status(400).send({error:'Bad Request'});
	}
	var mm = moment(data.datetime, data.datetimeFormat);

	var model = new db.calorieModel();
	model.user_id = req.user._id;
	model.date	= mm.toDate();
	model.time = mm.unix();
	model.amount  = data.amount;
	model.description = data.description;
	// console.log(model);

	model.save(function(err) {
		if (err) {
		  // console.log(err);
			return res.status(500).send({error:err});
		}
		return res.status(200).send(model);
	});
};

exports.update = function(req, res) {
	if (req.params.id === undefined) {
		return res.status(400).send({error:'Bad Request'});
	}
	var id = req.params.id;
	var data = req.body;
	var error = validator.checkCalorie(data);
	if (error) {
		return res.status(400).send({error:'Bad Request'});
	}
	var mm = moment(data.datetime, data.datetimeFormat);
	data.date	= mm.toDate();
	data.time = mm.unix();

	db.calorieModel.findOneAndUpdate(
		{_id: id, user_id: req.user._id}, 
		data, {},
		function(err, result) {
			if (err) {
				return res.status(500).send({error:err});
			}
			if (result == null) {
				return res.status(404).send({error:'Data is not found!'});
			}
			return res.status(200).send(result);
		});
};

exports.delete = function(req, res) {
	if (req.params.id === undefined) {
		return res.status(400).send({error:'Bad Request'});
	}
	var id = req.params.id;
	db.calorieModel.findOne({_id: id, user_id: req.user._id}, function(err, result) {
		if (err) {
			return res.status(500).send({error:err});
		}
		if (result == null) {
			return res.status(404).send({error:'Data is not found!'});
		}
		result.remove();
		return res.status(200).send(result);
	});
};