'use strict';

(function() {
	// Datasets Controller Spec
	describe('Datasets Controller Tests', function() {
		// Initialize global variables
		var DatasetsController,
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

			// Initialize the Datasets controller.
			DatasetsController = $controller('DatasetsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Dataset object fetched from XHR', inject(function(Datasets) {
			// Create sample Dataset using the Datasets service
			var sampleDataset = new Datasets({
				name: 'New Dataset'
			});

			// Create a sample Datasets array that includes the new Dataset
			var sampleDatasets = [sampleDataset];

			// Set GET response
			$httpBackend.expectGET('datasets').respond(sampleDatasets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.datasets).toEqualData(sampleDatasets);
		}));

		it('$scope.findOne() should create an array with one Dataset object fetched from XHR using a datasetId URL parameter', inject(function(Datasets) {
			// Define a sample Dataset object
			var sampleDataset = new Datasets({
				name: 'New Dataset'
			});

			// Set the URL parameter
			$stateParams.datasetId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/datasets\/([0-9a-fA-F]{24})$/).respond(sampleDataset);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.dataset).toEqualData(sampleDataset);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Datasets) {
			// Create a sample Dataset object
			var sampleDatasetPostData = new Datasets({
				name: 'New Dataset'
			});

			// Create a sample Dataset response
			var sampleDatasetResponse = new Datasets({
				_id: '525cf20451979dea2c000001',
				name: 'New Dataset'
			});

			// Fixture mock form input values
			scope.name = 'New Dataset';

			// Set POST response
			$httpBackend.expectPOST('datasets', sampleDatasetPostData).respond(sampleDatasetResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Dataset was created
			expect($location.path()).toBe('/datasets/' + sampleDatasetResponse._id);
		}));

		it('$scope.update() should update a valid Dataset', inject(function(Datasets) {
			// Define a sample Dataset put data
			var sampleDatasetPutData = new Datasets({
				_id: '525cf20451979dea2c000001',
				name: 'New Dataset'
			});

			// Mock Dataset in scope
			scope.dataset = sampleDatasetPutData;

			// Set PUT response
			$httpBackend.expectPUT(/datasets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/datasets/' + sampleDatasetPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid datasetId and remove the Dataset from the scope', inject(function(Datasets) {
			// Create new Dataset object
			var sampleDataset = new Datasets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Datasets array and include the Dataset
			scope.datasets = [sampleDataset];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/datasets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDataset);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.datasets.length).toBe(0);
		}));
	});
}());