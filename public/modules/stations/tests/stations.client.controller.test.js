'use strict';

(function() {
	// Stations Controller Spec
	describe('Stations Controller Tests', function() {
		// Initialize global variables
		var StationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Stations controller.
			StationsController = $controller('StationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Station object fetched from XHR', inject(function(Stations) {
			// Create sample Station using the Stations service
			var sampleStation = new Stations({
				name: 'New Station'
			});

			// Create a sample Stations array that includes the new Station
			var sampleStations = [sampleStation];

			// Set GET response
			$httpBackend.expectGET('stations').respond(sampleStations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.stations).toEqualData(sampleStations);
		}));

		it('$scope.findOne() should create an array with one Station object fetched from XHR using a stationId URL parameter', inject(function(Stations) {
			// Define a sample Station object
			var sampleStation = new Stations({
				name: 'New Station'
			});

			// Set the URL parameter
			$stateParams.stationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/stations\/([0-9a-fA-F]{24})$/).respond(sampleStation);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.station).toEqualData(sampleStation);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Stations) {
			// Create a sample Station object
			var sampleStationPostData = new Stations({
				name: 'New Station'
			});

			// Create a sample Station response
			var sampleStationResponse = new Stations({
				_id: '525cf20451979dea2c000001',
				name: 'New Station'
			});

			// Fixture mock form input values
			scope.name = 'New Station';

			// Set POST response
			$httpBackend.expectPOST('stations', sampleStationPostData).respond(sampleStationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Station was created
			expect($location.path()).toBe('/stations/' + sampleStationResponse._id);
		}));

		it('$scope.update() should update a valid Station', inject(function(Stations) {
			// Define a sample Station put data
			var sampleStationPutData = new Stations({
				_id: '525cf20451979dea2c000001',
				name: 'New Station'
			});

			// Mock Station in scope
			scope.station = sampleStationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/stations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/stations/' + sampleStationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid stationId and remove the Station from the scope', inject(function(Stations) {
			// Create new Station object
			var sampleStation = new Stations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Stations array and include the Station
			scope.stations = [sampleStation];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/stations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleStation);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.stations.length).toBe(0);
		}));
	});
}());