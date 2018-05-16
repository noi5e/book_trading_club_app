var mongoose = require('mongoose');

var BusinessSchema = mongoose.Schema({
	yelp_id: {
		type: String,
		unique: true
	},
	city: {
		type: String
	},
	checkin_list: {
		type: Array
	}
});

var Business = module.exports = mongoose.model('Business', BusinessSchema);

module.exports.createBusiness = function(newBusiness, callback) {
	newBusiness.save(callback);
}