'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dataset Schema
 */
var DatasetSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Dataset name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Dataset', DatasetSchema);