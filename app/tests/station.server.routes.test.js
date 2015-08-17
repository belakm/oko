'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Station = mongoose.model('Station'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, station;

/**
 * Station routes tests
 */
describe('Station CRUD tests', function() {
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

		// Save a user to the test db and create new Station
		user.save(function() {
			station = {
				name: 'Station Name'
			};

			done();
		});
	});

	it('should be able to save Station instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Station
				agent.post('/stations')
					.send(station)
					.expect(200)
					.end(function(stationSaveErr, stationSaveRes) {
						// Handle Station save error
						if (stationSaveErr) done(stationSaveErr);

						// Get a list of Stations
						agent.get('/stations')
							.end(function(stationsGetErr, stationsGetRes) {
								// Handle Station save error
								if (stationsGetErr) done(stationsGetErr);

								// Get Stations list
								var stations = stationsGetRes.body;

								// Set assertions
								(stations[0].user._id).should.equal(userId);
								(stations[0].name).should.match('Station Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Station instance if not logged in', function(done) {
		agent.post('/stations')
			.send(station)
			.expect(401)
			.end(function(stationSaveErr, stationSaveRes) {
				// Call the assertion callback
				done(stationSaveErr);
			});
	});

	it('should not be able to save Station instance if no name is provided', function(done) {
		// Invalidate name field
		station.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Station
				agent.post('/stations')
					.send(station)
					.expect(400)
					.end(function(stationSaveErr, stationSaveRes) {
						// Set message assertion
						(stationSaveRes.body.message).should.match('Please fill Station name');
						
						// Handle Station save error
						done(stationSaveErr);
					});
			});
	});

	it('should be able to update Station instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Station
				agent.post('/stations')
					.send(station)
					.expect(200)
					.end(function(stationSaveErr, stationSaveRes) {
						// Handle Station save error
						if (stationSaveErr) done(stationSaveErr);

						// Update Station name
						station.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Station
						agent.put('/stations/' + stationSaveRes.body._id)
							.send(station)
							.expect(200)
							.end(function(stationUpdateErr, stationUpdateRes) {
								// Handle Station update error
								if (stationUpdateErr) done(stationUpdateErr);

								// Set assertions
								(stationUpdateRes.body._id).should.equal(stationSaveRes.body._id);
								(stationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Stations if not signed in', function(done) {
		// Create new Station model instance
		var stationObj = new Station(station);

		// Save the Station
		stationObj.save(function() {
			// Request Stations
			request(app).get('/stations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Station if not signed in', function(done) {
		// Create new Station model instance
		var stationObj = new Station(station);

		// Save the Station
		stationObj.save(function() {
			request(app).get('/stations/' + stationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', station.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Station instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Station
				agent.post('/stations')
					.send(station)
					.expect(200)
					.end(function(stationSaveErr, stationSaveRes) {
						// Handle Station save error
						if (stationSaveErr) done(stationSaveErr);

						// Delete existing Station
						agent.delete('/stations/' + stationSaveRes.body._id)
							.send(station)
							.expect(200)
							.end(function(stationDeleteErr, stationDeleteRes) {
								// Handle Station error error
								if (stationDeleteErr) done(stationDeleteErr);

								// Set assertions
								(stationDeleteRes.body._id).should.equal(stationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Station instance if not signed in', function(done) {
		// Set Station user 
		station.user = user;

		// Create new Station model instance
		var stationObj = new Station(station);

		// Save the Station
		stationObj.save(function() {
			// Try deleting Station
			request(app).delete('/stations/' + stationObj._id)
			.expect(401)
			.end(function(stationDeleteErr, stationDeleteRes) {
				// Set message assertion
				(stationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Station error error
				done(stationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Station.remove().exec();
		done();
	});
});