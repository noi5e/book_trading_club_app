const User = require ('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken')

module.exports = new PassportLocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false,
	passReqToCallback: true
}, (request, username, password, done) => {
	const userData = {
		username: username.trim(),
		password: password.trim()
	};

	return User.findOne({ username: userData.username }, (error, user) => {

		if (error) { return done(error); }

		if (!user) {
			const error = new Error('Incorrect username or password.');
			error.name = 'IncorrectCredentialsError';

			return done(error);
		}

		return User.comparePassword(userData.password, user.password, (passwordError, isMatch) => {
			if (error) { return done(error); }

			if (!isMatch) {
				const error = new Error('Incorrect username or password.');
				error.name = 'IncorrectCredentialsError';

				return done(error);
			}

			const payload = {
				sub: user._id
			};

			const token = jwt.sign(payload, process.env.JWT_KEY);
			const data = {
				username: user.username
			};

			return done(null, token, data);
		});
	});
});