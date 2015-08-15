'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dataset = mongoose.model('Dataset'),
	_ = require('lodash');

var request = require('request');

/**
 * Create a Dataset
 */
exports.create = function(req, res) {
	var dataset = new Dataset(req.body);
	dataset.user = req.user;

	dataset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dataset);
		}
	});
};

/**
 * Show the current Dataset
 */
exports.read = function(req, res) {
	res.jsonp(req.dataset);
};


/**
 * Update a Dataset
 */
exports.update = function(req, res) {
	var dataset = req.dataset ;

	dataset = _.extend(dataset , req.body);

	dataset.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dataset);
		}
	});
};

/**
 * Delete an Dataset
 */
exports.delete = function(req, res) {
	var dataset = req.dataset ;

	dataset.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(dataset);
		}
	});
};

/**
 * List of Datasets
 */
exports.list = function(req, res) { 
	Dataset.find().sort('-created').populate('user', 'displayName').exec(function(err, datasets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(datasets);
		}
	});
};

/**
 * Read XML from web
 */
exports.readXML = function(req, res) { 
	var parseString = require('xml2js').parseString;

	var request = require('request');
	request('http://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml', function (error, response, body) {
	  if (!error && response.statusCode === 200) {
		    parseString(body, function (err, result) {
		    console.dir(JSON.stringify(result));
		});
	  }
	});
};

/**
 * Dataset middleware
 */
exports.datasetByID = function(req, res, next, id) { 
	Dataset.findById(id).populate('user', 'displayName').exec(function(err, dataset) {
		if (err) return next(err);
		if (! dataset) return next(new Error('Failed to load Dataset ' + id));
		req.dataset = dataset ;
		next();
	});
};

/**
 * Dataset authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.dataset.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
