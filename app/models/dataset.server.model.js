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
	},
	sifra: {
		type: 'String',
		default: '',
		trim: true
	},
	ge_dolzina: {
		type: 'String',
		default: '',
		trim: true
	},
	ge_sirina: {
		type: 'String',
		default: '',
		trim: true
	},
	kota_0: {
		type: 'String',
		default: '',
		trim: true
	},
	reka: {
		type: 'String',
		default: '',
		trim: true
	},
	merilno_mesto: {
		type: 'String',
		default: '',
		trim: true
	},
	ime_kratko: {
		type: 'String',
		default: '',
		trim: true
	},
	datum: {
		type: 'String',
		default: '',
		trim: true
	},
	vodostaj: {
		type: 'String',
		default: '',
		trim: true
	},
	pretok: {
		type: 'String',
		default: '',
		trim: true
	},
	pretok_znacilni: {
		type: 'String',
		default: '',
		trim: true
	},
	temp_vode: {
		type: 'String',
		default: '',
		trim: true
	},
	date: {
		type: 'Date',
		default: Date.now
	}
});

mongoose.model('Dataset', DatasetSchema);