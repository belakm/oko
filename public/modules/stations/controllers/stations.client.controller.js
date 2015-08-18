'use strict';
// Stations controller

angular.module('stations').controller('StationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stations',
	function($scope, $stateParams, $location, Authentication, Stations) {
		$scope.authentication = Authentication;

		$scope.dataset = {};
		$scope.dataGain = function(){
			if (Object.keys($scope.dataset).length > 0) return 0;
			for (var i in $scope.stations){
				var resultVodostaj = {
		    		key: $scope.stations[i].name,
		    		values: []
		    	};
		    	var resultPretok = {
		    		key: $scope.stations[i].name,
		    		values: []
		    	};
				for (var j in $scope.stations[i].info){
					resultVodostaj.values.push({label: new Date($scope.stations[i].info[j].datum), value: parseInt($scope.stations[i].info[j].vodostaj)});
					resultPretok.values.push({label: new Date($scope.stations[i].info[j].datum), value: parseInt($scope.stations[i].info[j].pretok)});
				}
				$scope.dataset[$scope.stations[i].name] = [resultVodostaj, resultPretok];
			}
		};

		$scope.options = {
			chart: {
                type: 'lineChart',
                height: 280,
                width: 540,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 70
                },
                y: function(d){ return d.value; },
                x: function(d){return d.label; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)',
                    tickFormat: function(d){
                       return d3.time.format('%d. %m. %H:%M')(new Date(d));
                    },
                	rotateLabels: 45
                },
                yAxis: {
                    axisLabel: 'Water level (cm)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                }
            }
			/*chart: {
                type: 'sparklinePlus',
                height: 150,
                x: function(d, i){return d.value;},
                xTickFormat: function(d) {
                    return d3.time.format(d)(new Date(d)); 
                },
                transitionDuration: 250
            }
            /*chart: {
                type: 'discreteBarChart',
                height: 150,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function(d){console.log(d.label); return d.label.getHours() +':' + d.label.getMinutes();},
                y: function(d){return d.value;},
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
            }*/
		};

	    $scope.getData = function(station){
	    	$scope.dataGain();
	    	return $scope.dataset[station.name];
	    	//return volatileChart(130.0, 0.02);
	    };

		$scope.center = function(station){
			var last = station.info.length-1;
        	var result = {
	            latitude: station.info[last].ge_sirina,
	            longitude: station.info[last].ge_dolzina
	        };
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

		};
	}
]);