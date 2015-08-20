'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var stations = require('../../app/controllers/stations.server.controller');

	// Stations Routes
	app.route('/stations')
		.get(stations.list)
		.post(users.requiresLogin, stations.create);

	// Parse Routes
	app.route('/stations/xml')
		.get(stations.readXML);

	app.route('/stations/random')
		.get(stations.random)
		.put(users.requiresLogin, stations.hasAuthorization, stations.update)
		.delete(users.requiresLogin, stations.hasAuthorization, stations.delete);

	app.route('/stations/:stationId')
		.get(stations.read)
		.put(users.requiresLogin, stations.hasAuthorization, stations.update)
		.delete(users.requiresLogin, stations.hasAuthorization, stations.delete);

	// Finish by binding the Station middleware
	app.param('stationId', stations.stationByID);
};
