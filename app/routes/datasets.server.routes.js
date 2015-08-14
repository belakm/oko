'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var datasets = require('../../app/controllers/datasets.server.controller');

	// Datasets Routes
	app.route('/datasets')
		.get(datasets.list)
		.post(users.requiresLogin, datasets.create);

	app.route('/datasets/:datasetId')
		.get(datasets.read)
		.put(users.requiresLogin, datasets.hasAuthorization, datasets.update)
		.delete(users.requiresLogin, datasets.hasAuthorization, datasets.delete);

	// Finish by binding the Dataset middleware
	app.param('datasetId', datasets.datasetByID);
};
