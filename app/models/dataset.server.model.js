'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dataset Schema

sifra
ge_dolzina
ge_sirina
kota_0
reka
merilno_mesto
ime_kratko
datum
vodostaj
pretok
pretok_znacilni
temp_vode

 */
var DatasetSchema = new Schema({
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
		type: 'Date',
		default: Date.now
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
	}
});

mongoose.model('Dataset', DatasetSchema);