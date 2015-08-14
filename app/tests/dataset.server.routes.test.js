'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Dataset = mongoose.model('Dataset'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, dataset;

/**
 * Dataset routes tests
 */
describe('Dataset CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Dataset
		user.save(function() {
			dataset = {
				name: 'Dataset Name'
			};

			done();
		});
	});

	it('should be able to save Dataset instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dataset
				agent.post('/datasets')
					.send(dataset)
					.expect(200)
					.end(function(datasetSaveErr, datasetSaveRes) {
						// Handle Dataset save error
						if (datasetSaveErr) done(datasetSaveErr);

						// Get a list of Datasets
						agent.get('/datasets')
							.end(function(datasetsGetErr, datasetsGetRes) {
								// Handle Dataset save error
								if (datasetsGetErr) done(datasetsGetErr);

								// Get Datasets list
								var datasets = datasetsGetRes.body;

								// Set assertions
								(datasets[0].user._id).should.equal(userId);
								(datasets[0].name).should.match('Dataset Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Dataset instance if not logged in', function(done) {
		agent.post('/datasets')
			.send(dataset)
			.expect(401)
			.end(function(datasetSaveErr, datasetSaveRes) {
				// Call the assertion callback
				done(datasetSaveErr);
			});
	});

	it('should not be able to save Dataset instance if no name is provided', function(done) {
		// Invalidate name field
		dataset.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dataset
				agent.post('/datasets')
					.send(dataset)
					.expect(400)
					.end(function(datasetSaveErr, datasetSaveRes) {
						// Set message assertion
						(datasetSaveRes.body.message).should.match('Please fill Dataset name');
						
						// Handle Dataset save error
						done(datasetSaveErr);
					});
			});
	});

	it('should be able to update Dataset instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dataset
				agent.post('/datasets')
					.send(dataset)
					.expect(200)
					.end(function(datasetSaveErr, datasetSaveRes) {
						// Handle Dataset save error
						if (datasetSaveErr) done(datasetSaveErr);

						// Update Dataset name
						dataset.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Dataset
						agent.put('/datasets/' + datasetSaveRes.body._id)
							.send(dataset)
							.expect(200)
							.end(function(datasetUpdateErr, datasetUpdateRes) {
								// Handle Dataset update error
								if (datasetUpdateErr) done(datasetUpdateErr);

								// Set assertions
								(datasetUpdateRes.body._id).should.equal(datasetSaveRes.body._id);
								(datasetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Datasets if not signed in', function(done) {
		// Create new Dataset model instance
		var datasetObj = new Dataset(dataset);

		// Save the Dataset
		datasetObj.save(function() {
			// Request Datasets
			request(app).get('/datasets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Dataset if not signed in', function(done) {
		// Create new Dataset model instance
		var datasetObj = new Dataset(dataset);

		// Save the Dataset
		datasetObj.save(function() {
			request(app).get('/datasets/' + datasetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', dataset.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Dataset instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Dataset
				agent.post('/datasets')
					.send(dataset)
					.expect(200)
					.end(function(datasetSaveErr, datasetSaveRes) {
						// Handle Dataset save error
						if (datasetSaveErr) done(datasetSaveErr);

						// Delete existing Dataset
						agent.delete('/datasets/' + datasetSaveRes.body._id)
							.send(dataset)
							.expect(200)
							.end(function(datasetDeleteErr, datasetDeleteRes) {
								// Handle Dataset error error
								if (datasetDeleteErr) done(datasetDeleteErr);

								// Set assertions
								(datasetDeleteRes.body._id).should.equal(datasetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Dataset instance if not signed in', function(done) {
		// Set Dataset user 
		dataset.user = user;

		// Create new Dataset model instance
		var datasetObj = new Dataset(dataset);

		// Save the Dataset
		datasetObj.save(function() {
			// Try deleting Dataset
			request(app).delete('/datasets/' + datasetObj._id)
			.expect(401)
			.end(function(datasetDeleteErr, datasetDeleteRes) {
				// Set message assertion
				(datasetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Dataset error error
				done(datasetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Dataset.remove().exec();
		done();
	});
});