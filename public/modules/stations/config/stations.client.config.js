'use strict';

// Configuring the Articles module
angular.module('stations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Stations', 'stations', 'dropdown', '/stations(/create)?', true);
		Menus.addMenuItem('topbar', 'Random station', 'stations/random', true);
		Menus.addSubMenuItem('topbar', 'stations', 'List Stations', 'stations', true);
	}
]);