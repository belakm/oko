'use strict';
// Stations controller

angular.module('stations').controller('StationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stations',
	function($scope, $stateParams, $location, Authentication, Stations) {
		$scope.authentication = Authentication;

		$scope.options = {
		    chart: {
		        type: 'discreteBarChart',
		        height: 450,
		        margin : {
		            top: 20,
		            right: 20,
		            bottom: 60,
		            left: 55
		        },
		        x: function(d){ return d.label; },
		        y: function(d){ return d.value; },
		        showValues: true,
		        valueFormat: function(d){
		            return d3.format(',.4f')(d);
		        },
		        transitionDuration: 500,
		        xAxis: {
		            axisLabel: 'X Axis'
		        },
		        yAxis: {
		            axisLabel: 'Y Axis',
		            axisLabelDistance: 30
		        }
		    }
		};

		$scope.data = [{
	    key: "Cumulative Return",
	    values: [
	        { "label" : "A" , "value" : -29.765957771107 },
	        { "label" : "B" , "value" : 0 },
	        { "label" : "C" , "value" : 32.807804682612 },
	        { "label" : "D" , "value" : 196.45946739256 },
	        { "label" : "E" , "value" : 0.19434030906893 },
	        { "label" : "F" , "value" : -98.079782601442 },
	        { "label" : "G" , "value" : -13.925743130903 },
	        { "label" : "H" , "value" : -5.1387322875705 }
	        ]
	    }];

		$scope.center = function(station){
			var last = station.info.length-1;
        	var result = {
	            latitude: station.info[last].ge_sirina,
	            longitude: station.info[last].ge_dolzina
	        };
        	console.log(result);
        	return result;
        };
	    $scope.zoom =  function() {return 8;};

		// Create new Station
		$scope.create = function() {
			// Create new Station object
			var station = new Stations ({
				name: this.name
			});

			// Redirect after save
			station.$save(function(response) {
				$location.path('stations/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Station
		$scope.remove = function(station) {
			if ( station ) { 
				station.$remove();

				for (var i in $scope.stations) {
					if ($scope.stations [i] === station) {
						$scope.stations.splice(i, 1);
					}
				}
			} else {
				$scope.station.$remove(function() {
					$location.path('stations');
				});
			}
		};

		// Update existing Station
		$scope.update = function() {
			var station = $scope.station;

			station.$update(function() {
				$location.path('stations/' + station._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Stations
		$scope.find = function() {
			$scope.stations = Stations.query();
		};

		// Find existing Station
		$scope.findOne = function() {
			$scope.station = Stations.get({ 
				stationId: $stateParams.stationId
			});
		};


		$scope.drawGraph = function(){

		}
	}
]);