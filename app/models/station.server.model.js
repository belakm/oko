'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var random = require('mongoose-simple-random');

/**
 * Station Schema
 */
var StationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Station name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	info: []
});

StationSchema.plugin(random); 

mongoose.model('Station', StationSchema);