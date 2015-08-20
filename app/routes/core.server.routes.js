'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	var stations = require('../../app/controllers/stations.server.controller');
	app.route('/').get(core.index);
};