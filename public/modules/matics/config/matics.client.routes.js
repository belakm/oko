'use strict';

//Setting up route
angular.module('matics').config(['$stateProvider',
	function($stateProvider) {
		// Matics state routing
		$stateProvider.
		state('listMatics', {
			url: '/matics',
			templateUrl: 'modules/matics/views/list-matics.client.view.html'
		}).
		state('createMatic', {
			url: '/matics/create',
			templateUrl: 'modules/matics/views/create-matic.client.view.html'
		}).
		state('viewMatic', {
			url: '/matics/:maticId',
			templateUrl: 'modules/matics/views/view-matic.client.view.html'
		}).
		state('editMatic', {
			url: '/matics/:maticId/edit',
			templateUrl: 'modules/matics/views/edit-matic.client.view.html'
		});
	}
]);