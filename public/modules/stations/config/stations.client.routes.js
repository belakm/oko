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