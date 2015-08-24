'use strict';

module.exports = {
	app: {
		title: 'Oko',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.VCAP_APP_PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/nvd3/nv.d3.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/module',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'//maps.googleapis.com/maps/api/js?sensor=false?v3',
	            'public/lib/lodash/lodash.min.js',
	            'public/lib/angular-google-maps/dist/angular-google-maps.js',
	            'public/lib/d3/d3.js',
	            'public/lib/nvd3/nv.d3.min.js',
	            'public/lib/angular-nvd3/dist/angular-nvd3.min.js',
	            'public/modules/stations/js/ng-map.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};