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