'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
	Repeat = require('repeat');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);

var stationsControl = require('./app/controllers/stations.server.controller.js');

// EVERY 10 MIN CHECK FOR NEW DATA

new Repeat(function(){
	console.log(chalk.cyan.inverse('Scraping XML off ARSO.'));
	stationsControl.readXML();
}).every(600000, 'ms').for(10000000, 'minutes').start.in(1, 'sec');
