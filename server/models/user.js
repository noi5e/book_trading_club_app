var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
	name: {
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
	password: {
		type: String
	}
});

UserSchema.pre('save', function saveHook(next) {
	const user = this;

	console.log("This is being triggered!");

	// if (!user.isModified('password')) return next();

	return bcrypt.genSalt((saltError, salt) => {
		if (saltError) { return next(saltError); }

		return bcrypt.hash(user.password, salt, (hashError, hash) => {
			if (hashError) { return next(hashError); }

			user.password = hash;

			console.log(user.password);

			return next();
		});
	});
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function comparePassword(candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, callback);
};

// module.exports.createUser = function(newUser, callback) {
// 	bcrypt.genSalt(10, function(error, salt) {
// 		bcrypt.hash(newUser.password, salt, function(error, hash) {
// 			newUser.password = hash;
// 			newUser.save(callback);
// 		});
// 	});
// }

// module.exports.getUserByUsername = function(username, callback) {
// 	var query = {username: username};
// 	User.findOne(query, callback);
// }

// module.exports.getUserById = function(id, callback) {
// 	User.findById(id, callback);
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback) {
// 	bcrypt.compare(candidatePassword, hash, function(error, isMatch) {
// 		if (error) throw error;
// 		callback(null, isMatch); 
// 	});
// }