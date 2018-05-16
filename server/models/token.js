var mongoose = require('mongoose');

var TokenSchema = mongoose.Schema({
	name: {
		type: String
	},
	token: {
		type: String
	}
});

var Token = module.exports = mongoose.model('Token', TokenSchema);