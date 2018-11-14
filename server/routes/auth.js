var express = require('express');
var validator = require('validator');
var passport = require('passport');
var router = new express.Router();
var User = require ('../models/user');
const jwt = require ('jsonwebtoken');
const async = require('async');

router.post('/get_user_info', function(request, response, next) {
	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {
		if (error) { console.log(error) }

		User.findOne({ _id: decodedToken.sub }, (error, user) => {
			if (error) { console.log(error) }

			return response.json({
				success: true,
				message: 'Profile has been found!',
				userInfo: {
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username,
					email: user.email,
					street: user.street,
					city: user.city,
					state: user.state,
					zipCode: user.zipCode
				}
			});
		});
	});
});

function validateLoginForm(formData) {
	const errors = {};
	let isFormValid = true;
	let message = '';

	if (!formData || typeof formData.username !== 'string' || formData.username.trim().length === 0) {
		isFormValid = false;
		errors.username = 'Please provide your username.';
	}

	if (!formData || typeof formData.password !== 'string' || formData.password.trim().length === 0) {
		isFormValid = false;
		errors.password = 'Please provide your password.';
	}

	if (!isFormValid) {
		message = 'Check the form for errors.';
	}

	return {
		success: isFormValid,
		message,
		errors
	}
}

router.post('/login', function(request, response, next) {
	var validationResult = validateLoginForm(request.body);

	if (!validationResult.success) {
		return response.status(400).json({
			success: false,
			message: validationResult.message,
			errors: validationResult.errors
		});
	}

	return passport.authenticate('local-login', function(error, token, userData) {
		const errors = {};

		if (error) {
			if (error.name === 'IncorrectCredentialsError') {
				errors.login = error.message;

				return response.status(400).json({
					success: false,
					message: "Couldn't find username/password in database.",
					errors: errors
				});
			}

			errors.server = "Server couldn\'t process the form."

			return response.status(400).json({
				success: false,
				message: "Couldn\'t process the form.",
				errors: errors
			});
		}

		return response.json({
			success: true,
			message: 'You have successfully logged in!',
			token,
			user: userData
		});
	}) (request, response, next);
});

function validateEditProfileForm(formData) {
	const errors = {};
	const firstName = decodeURIComponent(formData.firstName);
	const lastName = decodeURIComponent(formData.lastName);
	const username = decodeURIComponent(formData.username);
	const email = decodeURIComponent(formData.email);
	const street = decodeURIComponent(formData.street);
	const city = decodeURIComponent(formData.city);
	const state = decodeURIComponent(formData.state);
	const zipCode = decodeURIComponent(formData.zipCode);

	let isFormValid = true;
	let message = '';

	if (typeof firstName !== 'string' || validator.isEmpty(firstName)) {
		isFormValid = false;
		errors.firstName = "First name is required."
	}

	if (typeof lastName !== 'string' || validator.isEmpty(lastName)) {
		isFormValid = false;
		errors.lastName = "Last name is required."
	}

	if (typeof username !== 'string' || validator.isEmpty(username) || !validator.isAlphanumeric(username)) {
		isFormValid = false;
		errors.username = "Username is required, and must contain only letters and numbers."
	}

	if (typeof email !== 'string' || validator.isEmpty(email) || !validator.isEmail(email)) {
		isFormValid = false;
		errors.email = "Please enter a proper e-mail address.";
	}

	if (typeof street !== 'string' || validator.isEmpty(street)) {
		isFormValid = false;
		errors.city = "Street is required."
	}

	if (typeof city !== 'string' || validator.isEmpty(city)) {
		isFormValid = false;
		errors.city = "City is required."
	}

	if (typeof state !== 'string' || validator.isEmpty(state)) {
		isFormValid = false;
		errors.state = "State is required."
	}

	if (typeof city !== 'zipCode' || validator.isEmpty(zipCode)) {
		isFormValid = false;
		errors.city = "Zipcode is required."
	}

	if (!isFormValid) {
		message = "Check the form for errors.";
	}

	return {
			success: isFormValid,
			message: message,
			errors: errors
	};
}

router.post('/edit_profile', function(request, response, next) {
	const jsonWebToken = request.headers.authorization.split(" ")[1];
	var validationResult = validateEditProfileForm(request.body);

	if (!validationResult.success) {
		return response.status(400).json({
			success: false,
			message: validationResult.message,
			errors: validationResult.errors
		});
	} else {
		jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

			if (error) { console.log('error decoding JWT: ' + error) }

			User.findOne({ _id: decodedToken.sub }, (error, user) => {
				if (error) { console.log('couldn\'t find user token in mongo, for edit profile request: ' + error) }

				var authenticationResult = {
					success: false,
					message: 'Check the form for errors.',
					errors: {}
				};

				async.each([ 'username', 'email' ], (field, callback) => {

					const mongoQuery = {}
					mongoQuery[field] = request.body[field];

					User.find(mongoQuery, (error, documents) => {
						if (error) { console.log('error checking for ' + field + ' dupe while editing profile: ' + error) }

						if (documents.length > 0 && documents[0][field] !== user[field]) {
							authenticationResult.errors[field] = 'This ' + field + ' is already taken.';
						}

						callback();
					});
				}, (error) => {

					if (error) { console.log('error checking for email & username dupes: ' + error); }

					if (Object.keys(authenticationResult.errors).length === 0 && authenticationResult.errors.constructor === Object) {

						for (property in request.body) {
							if (request.body[property] !== user[property]) {
								user[property] = request.body[property];
							}
						}

						user.save((error) => {
							if (error) { 
								console.log('error saving user\s updated profile: ' + error); 
							} else {
								return response.status(200).json({
									success: true,
									message: 'Saved the changes to your profile.'
								});
							}
						})
					} else {
						return response.status(409).json(authenticationResult);
					}

				});
			});
		});
	}
});

function validateRegisterForm(formData) {
	const errors = {};
	const firstName = decodeURIComponent(formData.firstName);
	const lastName = decodeURIComponent(formData.lastName);
	const username = decodeURIComponent(formData.username);
	const email = decodeURIComponent(formData.email);
	const street = decodeURIComponent(formData.street);
	const city = decodeURIComponent(formData.city);
	const state = decodeURIComponent(formData.state);
	const zipCode = decodeURIComponent(formData.zipCode);
	const password = decodeURIComponent(formData.password);
	const passwordTwo = decodeURIComponent(formData.passwordTwo);

	let isFormValid = true;
	let message = '';

	if (typeof firstName !== 'string' || validator.isEmpty(firstName)) {
		isFormValid = false;
		errors.firstName = "First name is required."
	}

	if (typeof lastName !== 'string' || validator.isEmpty(lastName)) {
		isFormValid = false;
		errors.lastName = "Last name is required."
	}

	if (typeof username !== 'string' || validator.isEmpty(username) || !validator.isAlphanumeric(username)) {
		isFormValid = false;
		errors.username = "Username is required, and must contain only letters and numbers."
	}

	if (typeof email !== 'string' || validator.isEmpty(email) || !validator.isEmail(email)) {
		isFormValid = false;
		errors.email = "Please enter a proper e-mail address.";
	}

	if (typeof street !== 'string' || validator.isEmpty(street)) {
		isFormValid = false;
		errors.street = "Street is required."
	}

	if (typeof city !== 'string' || validator.isEmpty(city)) {
		isFormValid = false;
		errors.city = "City is required."
	}

	if (typeof state !== 'string' || validator.isEmpty(state)) {
		isFormValid = false;
		errors.state = "State is required."
	}

	if (typeof zipCode !== 'string' || validator.isEmpty(zipCode)) {
		isFormValid = false;
		errors.zipCode = "Zipcode is required."
	}

	if (typeof password !== 'string' || validator.isEmpty(password)) {
		isFormValid = false;
		errors.password = "Password is required.";
	}

	if (typeof passwordTwo !== 'string' || validator.isEmpty(passwordTwo) || !(password === passwordTwo)) {
		isFormValid = false;
		errors.passwordTwo = "Confirmed password doesn't match.";
	}

	if (!isFormValid) {
		message = "Check the form for errors.";
	}

	return {
			success: isFormValid,
			message: message,
			errors: errors
	};

}

router.post('/register', function(request, response, next) {
	var validationResult = validateRegisterForm(request.body);

	if (!validationResult.success) {
		return response.status(400).json({
			success: false,
			message: validationResult.message,
			errors: validationResult.errors
		});
	}

	return passport.authenticate('local-register', (error) => {

		if (error) {
			var authenticationResult = {
				success: false,
				message: 'Check the form for errors.',
				errors: {}
			};

			if (error.name === 'MongoError' && error.code === 11000 && error.message.indexOf('username_1') > 0) {
				authenticationResult.errors.username = 'This username is already taken.';
			}

			if (error.name === 'MongoError' && error.code === 11000 && error.message.indexOf('email_1') > 0) {
				authenticationResult.errors.email = 'This e-mail address is already taken.';
			}

			return response.status(409).json(authenticationResult);
		}

		return response.status(200).json({
			success: true,
			message: 'You successfully created an account! Please login.'
		});
	}) (request, response, next);
});

module.exports = router;