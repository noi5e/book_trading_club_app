const User = require ('../models/user');
const PassportLocalStrategy = require('passport-local').Strategy;

module.exports = new PassportLocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false,
	passReqToCallback: true
}, (request, username, password, done) => {
	const userData = {
		firstName: request.body.firstName.trim(),
		lastName: request.body.lastName.trim(),
		username: username.trim(),
		email: request.body.email.trim(),
		street: request.body.street.trim(),
		city: request.body.city.trim(),
		state: request.body.state.trim(),
		zipCode: request.body.zipCode.trim(),
		password: password
	};

	const newUser = new User(userData);

	newUser.save((error) => {
		if (error) { return done(error); }

		return done(null);
	});
});