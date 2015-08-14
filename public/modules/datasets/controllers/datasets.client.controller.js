'use strict';

// Datasets controller
angular.module('datasets').controller('DatasetsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Datasets', '$http',
	function($scope, $stateParams, $location, Authentication, Datasets, $http) {
		$scope.authentication = Authentication;

		var parser='';

		// Create new Dataset
		$scope.create = function() {
			// Create new Dataset object
			var dataset = new Datasets ({
				name: this.name
			});

			// Redirect after save
			dataset.$save(function(response) {
				$location.path('datasets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.parse = function() {
			console.log('yo');
			$http.get('http://www.arso.gov.si/xml/vode/hidro_podatki_zadnji.xml').
			  then(function(response) {
			    $scope.parser = response;
				console.log(response);
			  }, function(err) {
			    $scope.parser = err;
				console.log(response);
 			 });   // Your code...y
		};

		// Remove existing Dataset
		$scope.remove = function(dataset) {
			if ( dataset ) { 
				dataset.$remove();

				for (var i in $scope.datasets) {
					if ($scope.datasets [i] === dataset) {
						$scope.datasets.splice(i, 1);
					}
				}
			} else {
				$scope.dataset.$remove(function() {
					$location.path('datasets');
				});
			}
		};

		// Update existing Dataset
		$scope.update = function() {
			var dataset = $scope.dataset;

			dataset.$update(function() {
				$location.path('datasets/' + dataset._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Datasets
		$scope.find = function() {
			$scope.datasets = Datasets.query();
		};

		// Find existing Dataset
		$scope.findOne = function() {
			$scope.dataset = Datasets.get({ 
				datasetId: $stateParams.datasetId
			});
		};
	}
]);