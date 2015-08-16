'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Matic = mongoose.model('Matic'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, matic;

/**
 * Matic routes tests
 */
describe('Matic CRUD tests', function() {
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

		// Save a user to the test db and create new Matic
		user.save(function() {
			matic = {
				name: 'Matic Name'
			};

			done();
		});
	});

	it('should be able to save Matic instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Matic
				agent.post('/matics')
					.send(matic)
					.expect(200)
					.end(function(maticSaveErr, maticSaveRes) {
						// Handle Matic save error
						if (maticSaveErr) done(maticSaveErr);

						// Get a list of Matics
						agent.get('/matics')
							.end(function(maticsGetErr, maticsGetRes) {
								// Handle Matic save error
								if (maticsGetErr) done(maticsGetErr);

								// Get Matics list
								var matics = maticsGetRes.body;

								// Set assertions
								(matics[0].user._id).should.equal(userId);
								(matics[0].name).should.match('Matic Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Matic instance if not logged in', function(done) {
		agent.post('/matics')
			.send(matic)
			.expect(401)
			.end(function(maticSaveErr, maticSaveRes) {
				// Call the assertion callback
				done(maticSaveErr);
			});
	});

	it('should not be able to save Matic instance if no name is provided', function(done) {
		// Invalidate name field
		matic.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Matic
				agent.post('/matics')
					.send(matic)
					.expect(400)
					.end(function(maticSaveErr, maticSaveRes) {
						// Set message assertion
						(maticSaveRes.body.message).should.match('Please fill Matic name');
						
						// Handle Matic save error
						done(maticSaveErr);
					});
			});
	});

	it('should be able to update Matic instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Matic
				agent.post('/matics')
					.send(matic)
					.expect(200)
					.end(function(maticSaveErr, maticSaveRes) {
						// Handle Matic save error
						if (maticSaveErr) done(maticSaveErr);

						// Update Matic name
						matic.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Matic
						agent.put('/matics/' + maticSaveRes.body._id)
							.send(matic)
							.expect(200)
							.end(function(maticUpdateErr, maticUpdateRes) {
								// Handle Matic update error
								if (maticUpdateErr) done(maticUpdateErr);

								// Set assertions
								(maticUpdateRes.body._id).should.equal(maticSaveRes.body._id);
								(maticUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Matics if not signed in', function(done) {
		// Create new Matic model instance
		var maticObj = new Matic(matic);

		// Save the Matic
		maticObj.save(function() {
			// Request Matics
			request(app).get('/matics')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Matic if not signed in', function(done) {
		// Create new Matic model instance
		var maticObj = new Matic(matic);

		// Save the Matic
		maticObj.save(function() {
			request(app).get('/matics/' + maticObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', matic.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Matic instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Matic
				agent.post('/matics')
					.send(matic)
					.expect(200)
					.end(function(maticSaveErr, maticSaveRes) {
						// Handle Matic save error
						if (maticSaveErr) done(maticSaveErr);

						// Delete existing Matic
						agent.delete('/matics/' + maticSaveRes.body._id)
							.send(matic)
							.expect(200)
							.end(function(maticDeleteErr, maticDeleteRes) {
								// Handle Matic error error
								if (maticDeleteErr) done(maticDeleteErr);

								// Set assertions
								(maticDeleteRes.body._id).should.equal(maticSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Matic instance if not signed in', function(done) {
		// Set Matic user 
		matic.user = user;

		// Create new Matic model instance
		var maticObj = new Matic(matic);

		// Save the Matic
		maticObj.save(function() {
			// Try deleting Matic
			request(app).delete('/matics/' + maticObj._id)
			.expect(401)
			.end(function(maticDeleteErr, maticDeleteRes) {
				// Set message assertion
				(maticDeleteRes.body.message).should.match('User is not logged in');

				// Handle Matic error error
				done(maticDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Matic.remove().exec();
		done();
	});
});