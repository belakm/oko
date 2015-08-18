'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Station = mongoose.model('Station'),
	Dataset = mongoose.model('Dataset'),
	_ = require('lodash');

var request = require('request');
var chalk = require('chalk');
var async = require('async');
var Repeat = require('repeat');

/**
 * Create a Station
 */
exports.create = function(req, res) {
	var station = new Station(req.body);
	station.user = req.user;

	station.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(station);
		}
	});
};

/**
 * Show the current Station
 */
exports.read = function(req, res) {
	res.jsonp(req.station);
};

/**
 * Update a Station
 */
exports.update = function(req, res) {
	var station = req.station ;

	station = _.extend(station , req.body);

	station.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(station);
		}
	});
};

/**
 * Delete an Station
 */
exports.delete = function(req, res) {
	var station = req.station ;

	station.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(station);
		}
	});
};

/**
 * List of Stations
 */
exports.list = function(req, res) { 
	Station.find().sort('name').populate('user', 'displayName').exec(function(err, stations) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(stations);
		}
	});
};

/**
 * Station middleware
 */
exports.stationByID = function(req, res, next, id) { 
	Station.findById(id).populate('user', 'displayName').exec(function(err, station) {
		if (err) return next(err);
		if (! station) return next(new Error('Failed to load Station ' + id));
		req.station = station ;
		next();
	});
};

/**
 * Station authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.station.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

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

				async.each(datasets, function(file, callback) {
					Station.findOne({ name: file.ime_kratko}, function (err, doc){
						if (err) console.log('iterate err', errorHandler.getErrorMessage(err));
						if (!doc){ // if there is no station under specified name, add new station to collection
							file.datum = new Date(file.datum);
							var station = new Station({
								name: file.ime_kratko,
							});
							var infoArray = new Dataset(file);
							console.log(chalk.green(infoArray));
							station.info = [infoArray];
							//station.user = req.user;
							console.log(station);
							station.save(function(err) {
								if (err) {
									console.log('Saving error. '+errorHandler.getErrorMessage(err));
								} else {
									console.log(chalk.magenta('Station ' + station.name + ' has been added.'));
								}
							});
						} else { // first check if record is up do date, if it isnt, update it
							var datum = new Date(file.datum);
							if (+datum === +doc.info[doc.info.length-1].datum){	
								console.log(chalk.yellow('Station ' + doc.name + ' is already up to date.'));
							}
							else {
								file.datum = new Date(file.datum);
								var infoArray = new Dataset(file);
								doc.info.push(infoArray);
								doc.save(function(err) {
									if (err) {
										console.log('Updating error with '+doc.name+'. Info:'+errorHandler.getErrorMessage(err));
									} else {
										console.log(chalk.green('Station ' + doc.name + ' has been updated.'));
									}
								});
							}
						}
					});
				}, function(err){
				    // if any of the file processing produced an error, err would equal that error
				    if( err ) {
				      console.log('A file failed to process');
				    } 
				    console.log('Finish');
				});
/*
				Station.collection.insert(stations, onInsert);

				var station = new Station(req.body);
				station.
				station.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.jsonp(station);
					}
				});


				dataset.save(function(err) {
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

/*
 *  Query new data every tem minutes
 */
