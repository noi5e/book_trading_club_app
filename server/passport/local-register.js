const User = require ('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false,
	passReqToCallback: true
}, (request, username, password, done) => {
	const userData = {
		name: request.body.name.trim(),
		username: username.trim(),
		email: request.body.email.trim(),
		password: password
	};

	const newUser = new User(userData);

	newUser.save((error) => {
		if (error) { return done(error); }

		return done(null);
	});
});