'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'oko';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'uiGmapgoogle-maps', 'nvd3', 'ngMap'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		angular.module('myApp', ['ngMap']);
		

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);


//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('stations');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('stations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stations', 'stations', 'dropdown', '/stations(/create)?');
		Menus.addMenuItem('topbar', 'Random station', 'stations/random');
		Menus.addSubMenuItem('topbar', 'stations', 'List Stations', 'stations');
	}
]);
'use strict';

//Setting up route
angular.module('stations').config(['$stateProvider',
	function($stateProvider) {
		// Stations state routing
		$stateProvider.
		state('listStations', {
			url: '/stations',
			templateUrl: 'modules/stations/views/list-stations.client.view.html'
		}).
		state('createStation', {
			url: '/stations/create',
			templateUrl: 'modules/stations/views/create-station.client.view.html'
		}).
		state('viewStation', {
			url: '/stations/:stationId',
			templateUrl: 'modules/stations/views/view-station.client.view.html'
		}).
		state('viewRandomStation', {
			url: '/stations/random',
			templateUrl: 'modules/stations/views/view-station.client.view.html'
		}).
		state('editStation', {
			url: '/stations/:stationId/edit',
			templateUrl: 'modules/stations/views/edit-station.client.view.html'
		});
	}
]);
'use strict';

angular.module('stations').controller('myCtrl', ['$scope',
	function($scope) {
		
	}
]);
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
angular.module("ngMap",[]),function(){"use strict";function camelCase(e){return e.replace(SPECIAL_CHARS_REGEXP,function(e,t,n,o){return o?n.toUpperCase():n}).replace(MOZ_HACK_REGEXP,"Moz$1")}function JSONize(e){try{return JSON.parse(e),e}catch(t){return e.replace(/([\$\w]+)\s*:/g,function(e,t){return'"'+t+'":'}).replace(/'([^']+)'/g,function(e,t){return'"'+t+'"'})}}var SPECIAL_CHARS_REGEXP=/([\:\-\_]+(.))/g,MOZ_HACK_REGEXP=/^moz([A-Z])/,Attr2Options=function($parse,$timeout,NavigatorGeolocation,GeoCoder){var orgAttributes=function(e){e.length>0&&(e=e[0]);for(var t={},n=0;n<e.attributes.length;n++){var o=e.attributes[n];t[o.name]=o.value}return t},toOptionValue=function(input,options){var output,key=options.key,scope=options.scope;try{var num=Number(input);if(isNaN(num))throw"Not a number";output=num}catch(err){try{if(input.match(/^[\+\-]?[0-9\.]+,[ ]*\ ?[\+\-]?[0-9\.]+$/)&&(input="["+input+"]"),output=JSON.parse(JSONize(input)),output instanceof Array){var t1stEl=output[0];if(t1stEl.constructor==Object);else if(t1stEl.constructor==Array)output=output.map(function(e){return new google.maps.LatLng(e[0],e[1])});else if(!isNaN(parseFloat(t1stEl))&&isFinite(t1stEl))return new google.maps.LatLng(output[0],output[1])}}catch(err2){if(input.match(/^[A-Z][a-zA-Z0-9]+\(.*\)$/))try{var exp="new google.maps."+input;output=eval(exp)}catch(e){output=input}else if(input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/))try{var matches=input.match(/^([A-Z][a-zA-Z0-9]+)\.([A-Z]+)$/);output=google.maps[matches[1]][matches[2]]}catch(e){output=input}else if(input.match(/^[A-Z]+$/))try{var capitalizedKey=key.charAt(0).toUpperCase()+key.slice(1);key.match(/temperatureUnit|windSpeedUnit|labelColor/)?(capitalizedKey=capitalizedKey.replace(/s$/,""),output=google.maps.weather[capitalizedKey][input]):output=google.maps[capitalizedKey][input]}catch(e){output=input}else output=input}}return output},getAttrsToObserve=function(e){var t=[];if(e["ng-repeat"]||e.ngRepeat);else for(var n in e){var o=e[n];o&&o.match(/\{\{.*\}\}/)&&t.push(camelCase(n))}return t},filter=function(e){var t={};for(var n in e)n.match(/^\$/)||n.match(/^ng[A-Z]/)||(t[n]=e[n]);return t},getOptions=function(e,t){var n={};for(var o in e)if(e[o]){if(o.match(/^on[A-Z]/))continue;if(o.match(/ControlOptions$/))continue;n[o]=toOptionValue(e[o],{scope:t,key:o})}return n},getEvents=function(e,t){var n={},o=function(e){return"_"+e.toLowerCase()},r=function(t){var n=t.match(/([^\(]+)\(([^\)]*)\)/),o=n[1],r=n[2].replace(/event[ ,]*/,""),i=$parse("["+r+"]");return function(t){function n(e,t){return e[t]}var r=i(e),a=o.split(".").reduce(n,e);a&&a.apply(this,[t].concat(r)),$timeout(function(){e.$apply()})}};for(var i in t)if(t[i]){if(!i.match(/^on[A-Z]/))continue;var a=i.replace(/^on/,"");a=a.charAt(0).toLowerCase()+a.slice(1),a=a.replace(/([A-Z])/g,o);var s=t[i];n[a]=new r(s)}return n},getControlOptions=function(e){var t={};if("object"!=typeof e)return!1;for(var n in e)if(e[n]){if(!n.match(/(.*)ControlOptions$/))continue;var o=e[n],r=o.replace(/'/g,'"');r=r.replace(/([^"]+)|("[^"]+")/g,function(e,t,n){return t?t.replace(/([a-zA-Z0-9]+?):/g,'"$1":'):n});try{var i=JSON.parse(r);for(var a in i)if(i[a]){var s=i[a];if("string"==typeof s?s=s.toUpperCase():"mapTypeIds"===a&&(s=s.map(function(e){return e.match(/^[A-Z]+$/)?google.maps.MapTypeId[e.toUpperCase()]:e})),"style"===a){var c=n.charAt(0).toUpperCase()+n.slice(1),u=c.replace(/Options$/,"")+"Style";i[a]=google.maps[u][s]}else i[a]="position"===a?google.maps.ControlPosition[s]:s}t[n]=i}catch(l){}}return t};return{camelCase:camelCase,filter:filter,getOptions:getOptions,getEvents:getEvents,getControlOptions:getControlOptions,toOptionValue:toOptionValue,getAttrsToObserve:getAttrsToObserve,orgAttributes:orgAttributes}};Attr2Options.$inject=["$parse","$timeout","NavigatorGeolocation","GeoCoder"],angular.module("ngMap").service("Attr2Options",Attr2Options)}(),function(){"use strict";var e=function(e){return{geocode:function(t){var n=e.defer(),o=new google.maps.Geocoder;return o.geocode(t,function(e,t){t==google.maps.GeocoderStatus.OK?n.resolve(e):n.reject("Geocoder failed due to: "+t)}),n.promise}}};e.$inject=["$q"],angular.module("ngMap").service("GeoCoder",e)}(),function(){"use strict";var e=function(e){return{getCurrentPosition:function(){var t=e.defer();return navigator.geolocation?navigator.geolocation.getCurrentPosition(function(e){t.resolve(e)},function(e){t.reject(e)}):t.reject("Browser Geolocation service failed."),t.promise},watchPosition:function(){return"TODO"},clearWatch:function(){return"TODO"}}};e.$inject=["$q"],angular.module("ngMap").service("NavigatorGeolocation",e)}(),function(){"use strict";var e=function(e){var t=function(t,n){n=n||t.getCenter();var o=e.defer(),r=new google.maps.StreetViewService;return r.getPanoramaByLocation(n||t.getCenter,100,function(e,t){t===google.maps.StreetViewStatus.OK?o.resolve(e.location.pano):o.resolve(!1)}),o.promise},n=function(e,t){var n=new google.maps.StreetViewPanorama(e.getDiv(),{enableCloseButton:!0});n.setPano(t)};return{getPanorama:t,setPanorama:n}};e.$inject=["$q"],angular.module("ngMap").service("StreetView",e)}(),function(){"use strict";angular.module("ngMap").directive("bicyclingLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.BicyclingLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.orgAttributes(o),s=t.filter(r),c=t.getOptions(s),u=t.getEvents(e,s),l=n(c,u);i.addObject("bicyclingLayers",l),i.observeAttrSetObj(a,r,l),o.bind("$destroy",function(){i.deleteObject("bicyclingLayers",l)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("cloudLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.weather.CloudLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.orgAttributes(o),s=t.filter(r),c=t.getOptions(s),u=t.getEvents(e,s),l=n(c,u);i.addObject("cloudLayers",l),i.observeAttrSetObj(a,r,l),o.bind("$destroy",function(){i.deleteObject("cloudLayers",l)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("customControl",["Attr2Options","$compile",function(e,t){var n=e;return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=(n.orgAttributes(o),n.filter(r)),s=n.getOptions(a,e),c=n.getEvents(e,a),u=o[0].parentElement.removeChild(o[0]);t(u.innerHTML.trim())(e);for(var l in c)google.maps.event.addDomListener(u,l,c[l]);i.addObject("customControls",u),e.$on("mapInitialized",function(e,t){var n=s.position;t.controls[google.maps.ControlPosition[n]].push(u)})}}}])}(),function(){"use strict";var e=function(e,t){e.panel&&(e.panel=document.getElementById(e.panel)||document.querySelector(e.panel));var n=new google.maps.DirectionsRenderer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n},t=function(t,n){var o=t,r=new google.maps.DirectionsService,i=function(e,t){var o=t;o.travelMode=o.travelMode||"DRIVING";var i=["origin","destination","travelMode","transitOptions","unitSystem","durationInTraffic","waypoints","optimizeWaypoints","provideRouteAlternatives","avoidHighways","avoidTolls","region"];for(var a in o)-1===i.indexOf(a)&&delete o[a];o.origin&&o.destination&&r.route(o,function(t,o){o==google.maps.DirectionsStatus.OK&&n(function(){e.setDirections(t)})})},a=function(t,n,r,a){var s=o.orgAttributes(n),c=o.filter(r),u=o.getOptions(c),l=o.getEvents(t,c),p=o.getAttrsToObserve(s),g=e(u,l);a.addObject("directionsRenderers",g),p.forEach(function(e){!function(e){r.$observe(e,function(t){if(u[e]!==t){var n=o.toOptionValue(t,{key:e});u[e]=n,i(g,u)}})}(e)}),t.$on("mapInitialized",function(){i(g,u)}),t.$on("$destroy",function(){a.deleteObject("directionsRenderers",g)})};return{restrict:"E",require:"^map",link:a}};t.$inject=["Attr2Options","$timeout"],angular.module("ngMap").directive("directions",t)}(),function(){"use strict";angular.module("ngMap").directive("drawingManager",["Attr2Options",function(e){var t=e;return{restrict:"E",require:"^map",link:function(e,n,o,r){var i=(t.orgAttributes(n),t.filter(o)),a=t.getOptions(i),s=t.getControlOptions(i),c=t.getEvents(e,i),u=new google.maps.drawing.DrawingManager({drawingMode:a.drawingmode,drawingControl:a.drawingcontrol,drawingControlOptions:s.drawingControlOptions,circleOptions:a.circleoptions,markerOptions:a.markeroptions,polygonOptions:a.polygonoptions,polylineOptions:a.polylineoptions,rectangleOptions:a.rectangleoptions}),c=t.getEvents(e,i);for(var l in c)google.maps.event.addListener(u,l,c[l]);r.addObject("mapDrawingManager",u)}}}])}(),function(){"use strict";angular.module("ngMap").directive("dynamicMapsEngineLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.visualization.DynamicMapsEngineLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.filter(r),s=t.getOptions(a),c=t.getEvents(e,a,c),u=n(s,c);i.addObject("mapsEngineLayers",u)}}}])}(),function(){"use strict";angular.module("ngMap").directive("fusionTablesLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.FusionTablesLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.filter(r),s=t.getOptions(a),c=t.getEvents(e,a,c),u=n(s,c);i.addObject("fusionTablesLayers",u)}}}])}(),function(){"use strict";angular.module("ngMap").directive("heatmapLayer",["Attr2Options","$window",function(e,t){var n=e;return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=n.filter(r),s=n.getOptions(a);if(s.data=t[r.data]||e[r.data],!(s.data instanceof Array))throw"invalid heatmap data";s.data=new google.maps.MVCArray(s.data);{var c=new google.maps.visualization.HeatmapLayer(s);n.getEvents(e,a)}i.addObject("heatmapLayers",c)}}}])}(),function(){"use strict";var e=function(e,t,n,o){var r=e,i=function(e,o,r){var i;!e.position||e.position instanceof google.maps.LatLng||delete e.position,i=new google.maps.InfoWindow(e),Object.keys(o).length>0;for(var a in o)a&&google.maps.event.addListener(i,a,o[a]);var s=r.html().trim();if(1!=angular.element(s).length)throw"info-window working as a template must have a container";return i.__template=s.replace(/\s?ng-non-bindable[='"]+/,""),i.__compile=function(e,n){n&&(e["this"]=n);var o=t(i.__template)(e);i.setContent(o[0]),e.$apply()},i.__open=function(e,t,o){n(function(){i.__compile(t,o),o&&o.getPosition?i.open(e,o):o&&o instanceof google.maps.LatLng?(i.open(e),i.setPosition(o)):i.open(e)})},i},a=function(e,t,n,a){t.css("display","none");var s,c=r.orgAttributes(t),u=r.filter(n),l=r.getOptions(u,e),p=r.getEvents(e,u);!l.position||l.position instanceof google.maps.LatLng||(s=l.position);var g=i(l,p,t);s&&a.getGeoLocation(s).then(function(t){g.setPosition(t),g.__open(a.map,e,t);var r=n.geoCallback;r&&o(r)(e)}),a.addObject("infoWindows",g),a.observeAttrSetObj(c,n,g),e.$on("mapInitialized",function(t,n){if(g.visible&&g.__open(n,e),g.visibleOnMarker){var o=g.visibleOnMarker;g.__open(n,e,n.markers[o])}}),e.showInfoWindow=function(t,n,o){var r=a.map.infoWindows[n],i=o?o:this.getPosition?this:null;r.__open(a.map,e,i)},e.hideInfoWindow=e.hideInfoWindow||function(e,t){var n=a.map.infoWindows[t];n.close()}};return{restrict:"E",require:"^map",link:a}};e.$inject=["Attr2Options","$compile","$timeout","$parse"],angular.module("ngMap").directive("infoWindow",e)}(),function(){"use strict";angular.module("ngMap").directive("kmlLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.KmlLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.orgAttributes(o),s=t.filter(r),c=t.getOptions(s),u=t.getEvents(e,s),l=n(c,u);i.addObject("kmlLayers",l),i.observeAttrSetObj(a,r,l),o.bind("$destroy",function(){i.deleteObject("kmlLayers",l)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("mapData",["Attr2Options",function(e){var t=e;return{restrict:"E",require:"^map",link:function(e,n,o){var r=t.filter(o),i=t.getOptions(r),a=t.getEvents(e,r,a);e.$on("mapInitialized",function(t,n){for(var o in i)if(o){var r=i[o];"function"==typeof e[r]?n.data[o](e[r]):n.data[o](r)}for(var s in a)a[s]&&n.data.addListener(s,a[s])})}}}])}(),function(){"use strict";var e,t,n,o,r=function(n,r,i){var a=i.mapLazyLoadParams||i.mapLazyLoad;if(window.lazyLoadCallback=function(){e(function(){r.html(o),t(r.contents())(n)},100)},void 0===window.google||void 0===window.google.maps){var s=document.createElement("script");s.src=a+(a.indexOf("?")>-1?"&":"?")+"callback=lazyLoadCallback",document.body.appendChild(s)}else r.html(o),t(r.contents())(n)},i=function(e,t){return!t.mapLazyLoad&&void 0,o=e.html(),n=t.mapLazyLoad,document.querySelector('script[src="'+n+(n.indexOf("?")>-1?"&":"?")+'callback=lazyLoadCallback"]')?!1:(e.html(""),{pre:r})},a=function(n,o){return t=n,e=o,{compile:i}};a.$inject=["$compile","$timeout"],angular.module("ngMap").directive("mapLazyLoad",a)}(),function(){"use strict";angular.module("ngMap").directive("mapType",["Attr2Options","$window",function(e,t){return{restrict:"E",require:"^map",link:function(e,n,o,r){var i,a=o.name;if(!a)throw"invalid map-type name";if(o.object){var s=e[o.object]?e:t;i=s[o.object],"function"==typeof i&&(i=new i)}if(!i)throw"invalid map-type object";e.$on("mapInitialized",function(e,t){t.mapTypes.set(a,i)}),r.addObject("mapTypes",i)}}}])}(),function(){"use strict";function e(e,t){var n;return e.currentStyle?n=e.currentStyle[t]:window.getComputedStyle&&(n=document.defaultView.getComputedStyle(e,null).getPropertyValue(t)),n}var t=function(t,n,o){var r=t,i=function(t,i,a,s){var c=r.orgAttributes(i);t.google=google;var u=document.createElement("div");u.style.width="100%",u.style.height="100%",i.prepend(u),"false"!==a.defaultStyle&&("block"!=e(i[0],"display")&&i.css("display","block"),e(i[0],"height").match(/^(0|auto)/)&&i.css("height","300px")),i[0].addEventListener("dragstart",function(e){return e.preventDefault(),!1});var l=function(e,r){var i=new google.maps.Map(u,{});i.markers={},i.shapes={},n(function(){google.maps.event.trigger(i,"resize")}),e.zoom=e.zoom||15;var l=e.center;l?l instanceof google.maps.LatLng||(delete e.center,s.getGeoLocation(l).then(function(e){i.setCenter(e);var n=a.geoCallback;n&&o(n)(t)},function(){i.setCenter(g.geoFallbackCenter)})):e.center=new google.maps.LatLng(0,0),i.setOptions(e);for(var p in r)p&&google.maps.event.addListener(i,p,r[p]);s.observeAttrSetObj(c,a,i),s.map=i,s.addObjects(s._objects),t.map=i,t.map.scope=t,google.maps.event.addListenerOnce(i,"idle",function(){t.$emit("mapInitialized",i),a.zoomToIncludeMarkers&&(s.zoomToIncludeMarkers(),"auto"==a.zoomToIncludeMarkers&&t.$on("objectChanged",function(e,t){"markers"==t[0]&&s.zoomToIncludeMarkers()}))})},p=r.filter(a),g=r.getOptions(p,t),d=r.getControlOptions(p),f=angular.extend(g,d),m=r.getEvents(t,p);a.initEvent?t.$on(a.initEvent,function(){!s.map&&l(f,m)}):l(f,m)};return{restrict:"AE",controller:"MapController",link:i}};angular.module("ngMap").directive("map",["Attr2Options","$timeout","$parse",t])}(),function(){"use strict";var e=function(e,t,n,o,r){var i=r,a=this,s=function(e,t,n){e.$observe(t,function(e){if(e){var o=i.camelCase("set-"+t),r=i.toOptionValue(e,{key:t});n[o]&&(t.match(/center|position/)&&"string"==typeof r?a.getGeoLocation(r).then(function(e){n[o](e)}):n[o](r))}})};this.map=null,this._objects=[],this.addObject=function(t,n){if(this.map){this.map[t]=this.map[t]||{};var o=Object.keys(this.map[t]).length;this.map[t][n.id||o]=n,"infoWindows"!=t&&n.setMap&&n.setMap&&n.setMap(this.map),n.centered&&n.position&&this.map.setCenter(n.position),e.$emit("objectChanged",[t,this.map[t]])}else n.groupName=t,this._objects.push(n)},this.deleteObject=function(t,n){if(n.map){var o=n.map[t];for(var r in o)o[r]===n&&delete o[r];n.map&&n.setMap&&n.setMap(null),e.$emit("objectChanged",[t,this.map[t]])}},this.addObjects=function(e){for(var t=0;t<e.length;t++){var n=e[t];n instanceof google.maps.Marker?this.addObject("markers",n):n instanceof google.maps.Circle||n instanceof google.maps.Polygon||n instanceof google.maps.Polyline||n instanceof google.maps.Rectangle||n instanceof google.maps.GroundOverlay?this.addObject("shapes",n):this.addObject(n.groupName,n)}},this.getGeoLocation=function(e){var r=t.defer();return!e||e.match(/^current/i)?n.getCurrentPosition().then(function(e){var t=e.coords.latitude,n=e.coords.longitude,o=new google.maps.LatLng(t,n);r.resolve(o)},function(e){r.reject(e)}):o.geocode({address:e}).then(function(e){r.resolve(e[0].geometry.location)},function(e){r.reject(e)}),r.promise},this.observeAttrSetObj=function(e,t,n){var o=i.getAttrsToObserve(e);Object.keys(o).length;for(var r=0;r<o.length;r++)s(t,o[r],n)},this.zoomToIncludeMarkers=function(){var e=new google.maps.LatLngBounds;for(var t in this.map.markers)e.extend(this.map.markers[t].getPosition());this.map.fitBounds(e)}};e.$inject=["$scope","$q","NavigatorGeolocation","GeoCoder","Attr2Options"],angular.module("ngMap").controller("MapController",e)}(),function(){"use strict";angular.module("ngMap").directive("mapsEngineLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.visualization.MapsEngineLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.filter(r),s=t.getOptions(a),c=t.getEvents(e,a,c),u=n(s,c);i.addObject("mapsEngineLayers",u)}}}])}(),function(){"use strict";var e=function(e,t){var n;if(e.icon instanceof Object){(""+e.icon.path).match(/^[A-Z_]+$/)&&(e.icon.path=google.maps.SymbolPath[e.icon.path]);for(var o in e.icon){var r=e.icon[o];"anchor"==o||"origin"==o?e.icon[o]=new google.maps.Point(r[0],r[1]):("size"==o||"scaledSize"==o)&&(e.icon[o]=new google.maps.Size(r[0],r[1]))}}e.position instanceof google.maps.LatLng||(e.position=new google.maps.LatLng(0,0)),n=new google.maps.Marker(e),Object.keys(t).length>0;for(var i in t)i&&google.maps.event.addListener(n,i,t[i]);return n},t=function(t,n){var o=t,r=function(t,r,i,a){var s,c=o.orgAttributes(r),u=o.filter(i),l=o.getOptions(u,t),p=o.getEvents(t,u);l.position instanceof google.maps.LatLng||(s=l.position);var g=e(l,p);a.addObject("markers",g),s&&a.getGeoLocation(s).then(function(e){g.setPosition(e),l.centered&&g.map.setCenter(e);var o=i.geoCallback;o&&n(o)(t)}),a.observeAttrSetObj(c,i,g),r.bind("$destroy",function(){a.deleteObject("markers",g)})};return{restrict:"E",require:"^map",link:r}};t.$inject=["Attr2Options","$parse"],angular.module("ngMap").directive("marker",t)}(),function(){"use strict";angular.module("ngMap").directive("overlayMapType",["Attr2Options","$window",function(e,t){return{restrict:"E",require:"^map",link:function(e,n,o,r){var i,a=o.initMethod||"insertAt";if(o.object){var s=e[o.object]?e:t;i=s[o.object],"function"==typeof i&&(i=new i)}if(!i)throw"invalid map-type object";e.$on("mapInitialized",function(e,t){if("insertAt"==a){var n=parseInt(o.index,10);t.overlayMapTypes.insertAt(n,i)}else"push"==a&&t.overlayMapTypes.push(i)}),r.addObject("overlayMapTypes",i)}}}])}(),function(){"use strict";var e=function(e,t){var n=e,o=function(e,o,r,i){var a=n.filter(r),s=n.getOptions(a),c=n.getEvents(e,a),u=new google.maps.places.Autocomplete(o[0],s);for(var l in c)google.maps.event.addListener(u,l,c[l]);var p=function(){t(function(){i&&i.$setViewValue(o.val())},100)};google.maps.event.addListener(u,"place_changed",p),o[0].addEventListener("change",p),r.$observe("types",function(e){if(e){var t=n.toOptionValue(e,{key:"types"});u.setTypes(t)}})};return{restrict:"A",require:"?ngModel",link:o}};e.$inject=["Attr2Options","$timeout"],angular.module("ngMap").directive("placesAutoComplete",e)}(),function(){"use strict";var e=function(e){return new google.maps.LatLngBounds(e[0],e[1])},t=function(t,n){var o,r=t.name;if(delete t.name,t.icons)for(var i=0;i<t.icons.length;i++){var a=t.icons[i];a.icon.path.match(/^[A-Z_]+$/)&&(a.icon.path=google.maps.SymbolPath[a.icon.path])}switch(r){case"circle":t.center instanceof google.maps.LatLng||(t.center=new google.maps.LatLng(0,0)),o=new google.maps.Circle(t);break;case"polygon":o=new google.maps.Polygon(t);break;case"polyline":o=new google.maps.Polyline(t);break;case"rectangle":t.bounds&&(t.bounds=e(t.bounds)),o=new google.maps.Rectangle(t);break;case"groundOverlay":case"image":var s=t.url,c=e(t.bounds),u={opacity:t.opacity,clickable:t.clickable,id:t.id};o=new google.maps.GroundOverlay(s,c,u)}for(var l in n)n[l]&&google.maps.event.addListener(o,l,n[l]);return o},n=function(e,n){var o=e,r=function(e,r,i,a){var s,c,u=o.orgAttributes(r),l=o.filter(i),p=o.getOptions(l),g=o.getEvents(e,l);c=p.name,p.center instanceof google.maps.LatLng||(s=p.center);var d=t(p,g);a.addObject("shapes",d),s&&"circle"==c&&a.getGeoLocation(s).then(function(t){d.setCenter(t),d.centered&&d.map.setCenter(t);var o=i.geoCallback;o&&n(o)(e)}),a.observeAttrSetObj(u,i,d),r.bind("$destroy",function(){a.deleteObject("shapes",d)})};return{restrict:"E",require:"^map",link:r}};n.$inject=["Attr2Options","$parse"],angular.module("ngMap").directive("shape",n)}(),function(){"use strict";var e=function(e){var t=e,n=function(e,t,n){var o,r;t.container&&(r=document.getElementById(t.container),r=r||document.querySelector(t.container)),r?o=new google.maps.StreetViewPanorama(r,t):(o=e.getStreetView(),o.setOptions(t));for(var i in n)i&&google.maps.event.addListener(o,i,n[i]);return o},o=function(e,o,r){var i=(t.orgAttributes(o),t.filter(r)),a=t.getOptions(i),s=t.getControlOptions(i),c=angular.extend(a,s),u=t.getEvents(e,i);e.$on("mapInitialized",function(e,t){var o=n(t,c,u);t.setStreetView(o),!o.getPosition()&&o.setPosition(t.getCenter()),google.maps.event.addListener(o,"position_changed",function(){o.getPosition()!==t.getCenter()&&t.setCenter(o.getPosition())});var r=google.maps.event.addListener(t,"center_changed",function(){o.setPosition(t.getCenter()),google.maps.event.removeListener(r)})})};return{restrict:"E",require:"^map",link:o}};e.$inject=["Attr2Options"],angular.module("ngMap").directive("streetViewPanorama",e)}(),function(){"use strict";angular.module("ngMap").directive("trafficLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.TrafficLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.orgAttributes(o),s=t.filter(r),c=t.getOptions(s),u=t.getEvents(e,s),l=n(c,u);i.addObject("trafficLayers",l),i.observeAttrSetObj(a,r,l),o.bind("$destroy",function(){i.deleteObject("trafficLayers",l)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("transitLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.TransitLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.orgAttributes(o),s=t.filter(r),c=t.getOptions(s),u=t.getEvents(e,s),l=n(c,u);i.addObject("transitLayers",l),i.observeAttrSetObj(a,r,l),o.bind("$destroy",function(){i.deleteObject("transitLayers",l)})}}}])}(),function(){"use strict";angular.module("ngMap").directive("weatherLayer",["Attr2Options",function(e){var t=e,n=function(e,t){var n=new google.maps.weather.WeatherLayer(e);for(var o in t)google.maps.event.addListener(n,o,t[o]);return n};return{restrict:"E",require:"^map",link:function(e,o,r,i){var a=t.orgAttributes(o),s=t.filter(r),c=t.getOptions(s),u=t.getEvents(e,s),l=n(c,u);i.addObject("weatherLayers",l),i.observeAttrSetObj(a,r,l),o.bind("$destroy",function(){i.deleteObject("weatherLayers",l)})}}}])}();

'use strict';

//Stations service used to communicate Stations REST endpoints
angular.module('stations').factory('Stations', ['$resource',
	function($resource) {
		return $resource('stations/:stationId', { stationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);