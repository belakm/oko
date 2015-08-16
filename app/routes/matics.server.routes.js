'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var matics = require('../../app/controllers/matics.server.controller');

	// Matics Routes
	app.route('/matics')
		.get(matics.list)
		.post(users.requiresLogin, matics.create);

	app.route('/matics/:maticId')
		.get(matics.read)
		.put(users.requiresLogin, matics.hasAuthorization, matics.update)
		.delete(users.requiresLogin, matics.hasAuthorization, matics.delete);

	// Finish by binding the Matic middleware
	app.param('maticId', matics.maticByID);
};
