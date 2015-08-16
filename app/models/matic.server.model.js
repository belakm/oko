'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Matic Schema
 */
var MaticSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Matic name',
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

mongoose.model('Matic', MaticSchema);