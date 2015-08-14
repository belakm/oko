'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	url = require('url'),
	FacebookStrategy = require('passport-facebook').Strategy,
	config = require('../config'),
	users = require('../../app/controllers/users.server.controller');

module.exports = function() {
	// Use facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.facebook.clientID,
			clientSecret: config.facebook.clientSecret,
			callbackURL: config.facebook.callbackURL,
			passReqToCallback: true,
			enableProof: true,
			profileFields: ['emails', 'displayName']
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			console.log(profile);

			var displayName = profile.username || profile.displayName;
            displayName = displayName.trim();
            var iSpace = displayName.indexOf(' '); // index of the whitespace following the firstName
			var firstName =  iSpace !== -1 ? displayName.substring(0, iSpace) : displayName;
            var lastName = iSpace !== -1 ? displayName.substring(iSpace + 1) : '';

			// Create the user OAuth profile
			var providerUserProfile = {
				firstName: firstName,
                lastName: lastName,
                displayName: displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'facebook',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};