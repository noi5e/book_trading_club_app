var express = require('express');
var validator = require('validator');
var passport = require('passport');
var router = new express.Router();
var User = require ('../models/user');

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

function validateRegisterForm(formData) {
	const errors = {};
	const name = decodeURIComponent(formData.name);
	const username = decodeURIComponent(formData.username);
	const email = decodeURIComponent(formData.email);
	const password = decodeURIComponent(formData.password);
	const passwordTwo = decodeURIComponent(formData.passwordTwo);

	let isFormValid = true;
	let message = '';

	if (typeof name !== 'string' || validator.isEmpty(name)) {
		isFormValid = false;
		errors.name = "Name is required."
	}

	if (typeof username !== 'string' || validator.isEmpty(username) || !validator.isAlphanumeric(username)) {
		isFormValid = false;
		errors.username = "Username is required, and must contain only letters and numbers."
	}

	if (typeof email !== 'string' || validator.isEmpty(email) || !validator.isEmail(email)) {
		isFormValid = false;
		errors.email = "Please enter a proper e-mail address.";
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