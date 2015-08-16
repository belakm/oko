'use strict';

//Matics service used to communicate Matics REST endpoints
angular.module('matics').factory('Matics', ['$resource',
	function($resource) {
		return $resource('matics/:maticId', { maticId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);