'use strict';

(function() {
	// Matics Controller Spec
	describe('Matics Controller Tests', function() {
		// Initialize global variables
		var MaticsController,
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

			// Initialize the Matics controller.
			MaticsController = $controller('MaticsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Matic object fetched from XHR', inject(function(Matics) {
			// Create sample Matic using the Matics service
			var sampleMatic = new Matics({
				name: 'New Matic'
			});

			// Create a sample Matics array that includes the new Matic
			var sampleMatics = [sampleMatic];

			// Set GET response
			$httpBackend.expectGET('matics').respond(sampleMatics);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.matics).toEqualData(sampleMatics);
		}));

		it('$scope.findOne() should create an array with one Matic object fetched from XHR using a maticId URL parameter', inject(function(Matics) {
			// Define a sample Matic object
			var sampleMatic = new Matics({
				name: 'New Matic'
			});

			// Set the URL parameter
			$stateParams.maticId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/matics\/([0-9a-fA-F]{24})$/).respond(sampleMatic);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.matic).toEqualData(sampleMatic);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Matics) {
			// Create a sample Matic object
			var sampleMaticPostData = new Matics({
				name: 'New Matic'
			});

			// Create a sample Matic response
			var sampleMaticResponse = new Matics({
				_id: '525cf20451979dea2c000001',
				name: 'New Matic'
			});

			// Fixture mock form input values
			scope.name = 'New Matic';

			// Set POST response
			$httpBackend.expectPOST('matics', sampleMaticPostData).respond(sampleMaticResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Matic was created
			expect($location.path()).toBe('/matics/' + sampleMaticResponse._id);
		}));

		it('$scope.update() should update a valid Matic', inject(function(Matics) {
			// Define a sample Matic put data
			var sampleMaticPutData = new Matics({
				_id: '525cf20451979dea2c000001',
				name: 'New Matic'
			});

			// Mock Matic in scope
			scope.matic = sampleMaticPutData;

			// Set PUT response
			$httpBackend.expectPUT(/matics\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/matics/' + sampleMaticPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid maticId and remove the Matic from the scope', inject(function(Matics) {
			// Create new Matic object
			var sampleMatic = new Matics({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Matics array and include the Matic
			scope.matics = [sampleMatic];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/matics\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMatic);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.matics.length).toBe(0);
		}));
	});
}());