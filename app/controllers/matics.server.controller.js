'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Matic = mongoose.model('Matic'),
	_ = require('lodash');

/**
 * Create a Matic
 */
exports.create = function(req, res) {
	var matic = new Matic(req.body);
	matic.user = req.user;

	matic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(matic);
		}
	});
};

/**
 * Show the current Matic
 */
exports.read = function(req, res) {
	res.jsonp(req.matic);
};

/**
 * Update a Matic
 */
exports.update = function(req, res) {
	var matic = req.matic ;

	matic = _.extend(matic , req.body);

	matic.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(matic);
		}
	});
};

/**
 * Delete an Matic
 */
exports.delete = function(req, res) {
	var matic = req.matic ;

	matic.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(matic);
		}
	});
};

/**
 * List of Matics
 */
exports.list = function(req, res) { 
	Matic.find().sort('-created').populate('user', 'displayName').exec(function(err, matics) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(matics);
		}
	});
};

/**
 * Matic middleware
 */
exports.maticByID = function(req, res, next, id) { 
	Matic.findById(id).populate('user', 'displayName').exec(function(err, matic) {
		if (err) return next(err);
		if (! matic) return next(new Error('Failed to load Matic ' + id));
		req.matic = matic ;
		next();
	});
};

/**
 * Matic authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.matic.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
