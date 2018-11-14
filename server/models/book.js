var mongoose = require('mongoose');

var BookSchema = mongoose.Schema({
	author: {
		type: String
	},
	title: {
		type: String
	},
	userId: {
		type: String
	},
	tradeRequests: []
});

var Book = module.exports = mongoose.model('Book', BookSchema);