var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	username: {
		type: String,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	street: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	zipCode: {
		type: String
	},
	password: {
		type: String
	},
	books: [],
	acceptedTradeRequests: []
});

UserSchema.pre('save', function saveHook(next) {
	const user = this;

	if (!user.isModified('password')) return next();

	return bcrypt.genSalt((saltError, salt) => {
		if (saltError) { return next(saltError); }

		return bcrypt.hash(user.password, salt, (hashError, hash) => {
			if (hashError) { return next(hashError); }

			user.password = hash;

			return next();
		});
	});
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function comparePassword(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, callback);
};