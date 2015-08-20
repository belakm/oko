'use strict';
// Stations controller

angular.module('stations').controller('StationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Stations',
	function($scope, $stateParams, $location, Authentication, Stations) {
		$scope.authentication = Authentication;

		$scope.dataset = {};
		$scope.dataGain = function(){
			console.log('getting data');
			if (Object.keys($scope.dataset).length > 0) return 0;
			for (var i in $scope.stations){
				var reka = $scope.stations[i].name;
				var resultVodostaj = {
		    		key: 'water level of '+reka,
		    		values: [],
		    		yAxis: 1,
		    		area: true,
		    		color: "#b2e8f7"
		    	};
		    	var resultPretok = {
		    		key: 'flow of '+reka,
		    		values: [],
		    		yAxis: 2,
		    		type: 'line',
		    		color: '#008fb8'
		    	};
		    	var resultTemperatura = {
		    		key: 'temperature of '+reka,
		    		values: [],
		    		yAxis: 2,
		    		type: 'line',
		    		color: '#b82900'
		    	};
				for (var j in $scope.stations[i].info){
					var datum = parseInt(new Date($scope.stations[i].info[j].datum).getTime());
					var vodostaj = parseInt($scope.stations[i].info[j].vodostaj) || 0;
					var pretok = parseInt($scope.stations[i].info[j].pretok) || 0;
					var temperatura = parseFloat($scope.stations[i].info[j].temp_vode) || 0;
					resultVodostaj.values.push({x: datum, y: vodostaj});
					resultPretok.values.push({x: datum, y: pretok});
					resultTemperatura.values.push({x: datum, y: temperatura});
				}
				$scope.dataset[$scope.stations[i].name] = [resultVodostaj, resultPretok, resultTemperatura];
			}
			console.log('gained ', Object.keys($scope.dataset).length, 'objects', $scope.dataset);
		};

		d3.selection.prototype.moveToFront = function() {
		    return this.each(function(){
		        this.parentNode.appendChild(this);
		    });
		};

		$scope.getOptions = function(arg){
			if (arg){
				$scope.options.chart.width = undefined;
				$scope.options.chart.height = 420;
				$scope.options.chart.callback = function(){
                	d3.selectAll('.lines2Wrap').moveToFront();
                	//d3.selectAll('svg').style("width", 1110);
                }
			}
			return $scope.options;
		}

		$scope.options = {
			/*chart: {
                type: 'multiChart',
                height: 250,
                width: 500,
                x: function(d){
                	if (!d.value || typeof d.value == undefined) return 0;
                	else return d;
                },
                y: function(d){
                	if (!d.value || typeof d.value == undefined) return 0;
                	else return d;
                },
                margin: {
                    top: 30,
                    right: 60,
                    bottom: 50,
                    left: 70
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: false,
                transitionDuration: 500,
                xAxis: {
                    tickFormat: function(d){
                      return d3.time.format('%H:%M %d/%m/%Y')(new Date(d));
                    }
                },
                yAxis1: {
                	axisLabel: 'Water level (cm)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                yAxis2: {
                	axisLabel: 'Stream (cm^3) & Temperature (°C)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                callback: function(chart){
                	d3.selectAll('.lines2Wrap').moveToFront();
                	d3.selectAll('svg').style("width", 538);
                }
            }*/
            chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                xAxis: {
                    tickFormat: function(d){
                      return d3.time.format('%H:%M')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabel: '',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                }
            }
		};

	    $scope.getData = function(station){
	    	if (typeof station === 'undefined') return 0;
	    	$scope.dataGain();
	    	return $scope.dataset[station.name];
	    };

		$scope.center = function(station){
			var last = station.info.length-1;
        	var result = {
	            latitude: station.info[last].ge_sirina,
	            longitude: station.info[last].ge_dolzina
	        };
        	return result;
        };
	    $scope.zoom =  function() {return 12;};

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

		// Show only required attributes
		/*$scope.attrFilter = function (key, item) { 
		    switch(key):
		    	c 
		};	*/

		$scope.translateKey = function(key){
			switch (key){
				case 'datum': return 'Most recent data';
				case 'ge_dolzina': return 'Longitude';
				case 'ge_sirina': return 'Latitude';
				case 'ime_kratko': return 'Short name';
				case 'merilno_mesto': return 'Measuring spot';
				case 'pretok': return 'Flow [m^3/s]';
				case 'pretok_znacilni': return 'Characteristic flow';
				case 'reka': return 'River';
				case 'sifra': return 'Code';
				case 'kota_0': return 'Elevation';
				case 'temp_vode': return 'Water temperature [°C]';
				case 'vodostaj': return 'Water level [cm]';
				default: return key;
			}
		}	
		$scope.translateValue = function(key, value){
			switch (key){
				case 'pretok_znacilni':
					switch(value){
						case 'mali pretok': return 'Weak';
						case 'srednji pretok': return 'Medium';
						case 'velik pretok': return 'Strong';
						case 'opozorilni pretok': return 'Alarming';
						default: return value;
					}
				case 'datum':
					var date = new Date(value);
					return date.getUTCHours() + ':' + date.getUTCMinutes() + ' - ' + date.getUTCDate() + '. ' + date.getUTCDate() + '. ' + date.getUTCFullYear();
				case '': return 'no data';
				default: return value;			
			}
		}

		$scope.findR = function(){
			if (typeof $scope.stations !== 'undefined'){
				$scope.station = $scope.stations[Math.floor(Math.random() * $scope.stations.length)];
				$scope.zoom = 10;
				$scope.infoBay = $scope.station.info[0];
				$scope.posexists = ($scope.infoBay.ge_sirina == '') ? false : true;
				if ($scope.posexists){
					/* if there isnt a minimal adjustment, ngMap will render streetview on both maps (??) */
					var x = parseFloat($scope.infoBay.ge_sirina);
					var y = parseFloat($scope.infoBay.ge_dolzina);
					$scope.mapPosition1 = x + ", " + y;
				}
			} else {
				$scope.stations = Stations.query({}, '_id', function(err, docs){
					$scope.station = $scope.stations[Math.floor(Math.random() * $scope.stations.length)];
 					$scope.getData($scope.station);
					$scope.zoom = 10;
					$scope.infoBay = $scope.station.info[0];
					$scope.posexists = ($scope.infoBay.ge_sirina == '') ? false : true;
					if ($scope.posexists){
						/* if there isnt a minimal adjustment, ngMap will render streetview on both maps (??) */
						var x = parseFloat($scope.infoBay.ge_sirina);
						var y = parseFloat($scope.infoBay.ge_dolzina);
						$scope.mapPosition1 = x + ", " + y;
					}
				});
			}
		};

		// Find existing Station
		$scope.findOne = function() {
			$scope.station = Stations.get({ 
				stationId: $stateParams.stationId
			}, function(){
				$scope.stations = [$scope.station];
				$scope.zoom = 10;
				$scope.infoBay = $scope.station.info[0];

				$scope.posexists = ($scope.infoBay.ge_sirina == '') ? false : true;
				if ($scope.posexists){
					/* if there isnt a minimal adjustment, ngMap will render streetview on both maps (??) */
					var x = parseFloat($scope.infoBay.ge_sirina);
					var y = parseFloat($scope.infoBay.ge_dolzina);
					$scope.mapPosition1 = x + ", " + y;
				}

				console.log($scope.posexists);
			});
		};

		$scope.drawGraph = function(){

		};
	}
]);