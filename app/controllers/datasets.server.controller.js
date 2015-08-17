'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Dataset = mongoose.model('Dataset'),
	_ = require('lodash');

var request = require('request');
var chalk = require('chalk');
var async = require('async');

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
	Dataset.find().sort('datum').populate('user', 'displayName').exec(function(err, datasets) {
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

function onInsert(err, docs) {
    if (err) {
        console.log(chalk.red('Error inserting into database.' + err));
    } else {
        console.info('%d Objects were successfully stored.', docs.length);
    }
}


exports.readXML = function(req, res) { 
	var parserString = require('xml2js').Parser({mergeAttrs :'true', explicitArray : false});

	request('http://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml', function (error, response, body) {
	  if (!error && response.statusCode === 200) {
		    parserString.parseString(body, function (err, result) {

		    //console.dir(JSON.stringify(result));
		    if (err) {
		    	console.log(chalk.yellow('Parse error.'));
		    } else {
		    	/*var dataset = new Dataset(result);
				dataset.user = req.user;*/

				var datasets = result.arsopodatki.postaja;

				//console.log(result.arsopodatki.postaja);
				var user2 = req.user;

				async.each(datasets, function(file, callback) {
					file.user = user2.id;
					console.log(user2.id);
				}, function(err){
				    // if any of the file processing produced an error, err would equal that error
				    if( err ) {
				      console.log('A file failed to process');
				    } 
				    console.log('Finish');
				    
				});

				 Dataset.collection.insert(datasets, onInsert);


				/*dataset.save(function(err) {
					if (err) {
						console.log(chalk.red('Error inserting into database.'));
					} else {
						console.log(chalk.green('Inserted ' + Object.keys(result).length + ' keys into database.'));
					}
				});*/
		    }
		});
	  }
	});
};

/**
 * Get latest set
 */
exports.getLatest = function(req, res) {
	Dataset.find().distinct('reka', function(error, reke) {
    	console.log(reke);
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
