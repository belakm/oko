'use strict';

// Configuring the Articles module
angular.module('matics').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Matics', 'matics', 'dropdown', '/matics(/create)?');
		Menus.addSubMenuItem('topbar', 'matics', 'List Matics', 'matics');
		Menus.addSubMenuItem('topbar', 'matics', 'New Matic', 'matics/create');
	}
]);