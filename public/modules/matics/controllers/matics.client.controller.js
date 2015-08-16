'use strict';

// Matics controller
angular.module('matics').controller('MaticsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Matics',
	function($scope, $stateParams, $location, Authentication, Matics) {
		$scope.authentication = Authentication;

		// Create new Matic
		$scope.create = function() {
			// Create new Matic object
			var matic = new Matics ({
				name: this.name
			});

			// Redirect after save
			matic.$save(function(response) {
				$location.path('matics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Matic
		$scope.remove = function(matic) {
			if ( matic ) { 
				matic.$remove();

				for (var i in $scope.matics) {
					if ($scope.matics [i] === matic) {
						$scope.matics.splice(i, 1);
					}
				}
			} else {
				$scope.matic.$remove(function() {
					$location.path('matics');
				});
			}
		};

		// Update existing Matic
		$scope.update = function() {
			var matic = $scope.matic;

			matic.$update(function() {
				$location.path('matics/' + matic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Matics
		$scope.find = function() {
			$scope.matics = Matics.query();
		};

		// Find existing Matic
		$scope.findOne = function() {
			$scope.matic = Matics.get({ 
				maticId: $stateParams.maticId
			});
		};
	}
]);