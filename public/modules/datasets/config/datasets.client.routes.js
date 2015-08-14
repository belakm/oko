'use strict';

//Setting up route
angular.module('datasets').config(['$stateProvider',
	function($stateProvider) {
		// Datasets state routing
		$stateProvider.
		state('listDatasets', {
			url: '/datasets',
			templateUrl: 'modules/datasets/views/list-datasets.client.view.html'
		}).
		state('createDataset', {
			url: '/datasets/create',
			templateUrl: 'modules/datasets/views/create-dataset.client.view.html'
		}).
		state('viewDataset', {
			url: '/datasets/:datasetId',
			templateUrl: 'modules/datasets/views/view-dataset.client.view.html'
		}).
		state('editDataset', {
			url: '/datasets/:datasetId/edit',
			templateUrl: 'modules/datasets/views/edit-dataset.client.view.html'
		});
	}
]);