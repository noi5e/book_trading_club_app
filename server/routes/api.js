const express = require('express');
var validator = require('validator');
var router = new express.Router();
const async = require('async');
var Book = require('../models/book');
var User = require('../models/user');
const jwt = require('jsonwebtoken')

router.post('/get_all_books', function(request, response, next) {

	const jsonWebToken = request.headers.authorization.split(" ")[1];

	if (jsonWebToken !== 'null') {

		jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

			if (error) { console.log('error decoding JWT: ' + error); }

			User.findOne({ _id: decodedToken.sub }, (error, user) => {
				if (error) { console.log('error finding user for all books request: ' + error); }
				
				Book.find({}, (error, allBooks) => {
					if (error) { console.log('error generating list of all books: ' + error); }

					const booksForJson = allBooks.map((book) => {

						const userIdString = user._id.toString();

						let usersOwnBook = (userIdString === book.userId) ? true : false;
						let userAlreadyRequested = false;

						for (let i = 0; book.tradeRequests.length > 0 && i < book.tradeRequests.length; i++) {
							if (book.tradeRequests[i] === userIdString) {
								userAlreadyRequested = true;
								break;
							}
						}

						return {
							_id: book._id,
							title: book.title,
							author: book.author,
							userAlreadyRequested: userAlreadyRequested,
							usersOwnBook: usersOwnBook,
						}
					});

					response.status(200).json(booksForJson);
				});

			});
		});	

	} else {

		Book.find({}, (error, allBooks) => {
			if (error) { console.log('error generating list of all books: ' + error); }

			response.status(200).json(allBooks);
		});

	}
 });

router.post('/mark_received_book', function(request, response, next) {
	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

		if (error) { console.log('error decoding JWT: ' + error); }

		User.findOne({ _id: decodedToken.sub }, (error, userWhoReceivedBook) => {
			if (error) { console.log('error finding sending user in mark received book request: ' + error); }

			userWhoReceivedBook.acceptedTradeRequests = userWhoReceivedBook.acceptedTradeRequests.filter((tradeRequest) => {
				return tradeRequest.bookCollectionId !== request.body.bookId;
			});
			userWhoReceivedBook.markModified('books');
			userWhoReceivedBook.save();

			Book.remove({ _id: request.body.bookId }, (error) => {
				if (error) { console.log('error removing book: ' + error); }
			});

			User.findOne({ _id: request.body.userId }, (error, userWhoSentBook) => {
				if (error) { console.log('error finding receiving user in mark received book request: ' + error); }

				userWhoSentBook.books = userWhoSentBook.books.filter((book) => {
					return book.bookCollectionId !== request.body.bookId;
				});
				userWhoSentBook.markModified('acceptedTradeRequests')
				userWhoSentBook.save();

				response.status(200).json({ 
					acceptedTradeRequests: userWhoReceivedBook.acceptedTradeRequests,
					message: 'Sent ' + userWhoSentBook.username + ' a notice that you received their book!'
				});
			});
		});
	});
});

router.post('/accept_trade_request', function(request, response, next) {
	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

		if (error) { console.log('error decoding JWT: ' + error); }

		User.findOne({ _id: decodedToken.sub }, (error, userReceivingRequest) => {
			if (error) { console.log('error finding user for accept trade request: ' + error); }

			for (let i = 0; i < userReceivingRequest.books.length; i++) {

				if (userReceivingRequest.books[i].bookCollectionId === request.body.bookId) {

					for (let j = 0; j < userReceivingRequest.books[i].tradeRequests.length; j++) {
						if (userReceivingRequest.books[i].tradeRequests[j].userId = request.body.userId) {

							userReceivingRequest.books[i].reservedFor = userReceivingRequest.books[i].tradeRequests[j];

							userReceivingRequest.markModified('books');

							userReceivingRequest.save((error) => {
								if (error) { console.log('error saving user books for trade request: ' + error); }
							});

							User.findOne({ _id: userReceivingRequest.books[i].tradeRequests[j].userId }, (error, userMakingRequest) => {
								if (error) { console.log('error finding user making request in accept trade request: ' + error); }

								userMakingRequest.acceptedTradeRequests = userMakingRequest.acceptedTradeRequests.concat([{
									username: userReceivingRequest.username,
									userId: userReceivingRequest._id.toString(),
									title: userReceivingRequest.books[i].title,
									author: userReceivingRequest.books[i].author,
									city: userReceivingRequest.city,
									state: userReceivingRequest.state,
									bookCollectionId: userReceivingRequest.books[i].bookCollectionId
								}]);

								userMakingRequest.markModified('acceptedTradeRequests');
								userMakingRequest.save();

								response.status(200).json({
									message: 'Sent ' + userMakingRequest.username + ' a notice that you accepted their request for ' + userReceivingRequest.books[i].title + '.',
									receivingUser: userReceivingRequest.books[i].tradeRequests[j]
								});
							});


							break;
						}
					}

					break;
				}
			}

		});
	});
});

router.post('/make_book_request', function(request, response, next) {
	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

		if (error) { console.log('error decoding JWT: ' + error); }

		Book.findOne({ _id: request.body.bookId }, (error, book) => {

			if (error) { console.log('error finding book for trade book request: ' + error); }

			book.tradeRequests = book.tradeRequests.concat([decodedToken.sub]);

			book.save((error) => {
				if (error) { console.log('error saving book for trade request: ' + error); }
			});

			User.findOne({ _id: decodedToken.sub }, (error, userMakingRequest) => {

				User.findOne({ _id: book.userId }, (error, userReceivingRequest) => {
					if (error) { console.log('error finding user for trade book request: ' + error); }

					for (let i = 0; i < userReceivingRequest.books.length; i++) {
						if (userReceivingRequest.books[i].bookCollectionId === request.body.bookId.toString()) {
							userReceivingRequest.books[i].tradeRequests = userReceivingRequest.books[i].tradeRequests.concat([{
								firstName: userMakingRequest.firstName,
								lastName: userMakingRequest.lastName, 
								username: userMakingRequest.username, 
								userId: decodedToken.sub, 
								street: userMakingRequest.street,
								city: userMakingRequest.city, 
								state: userMakingRequest.state,
								zipCode: userMakingRequest.zipCode
							}]);

							userReceivingRequest.markModified('books');

							userReceivingRequest.save((error) => {
								if (error) { console.log('error saving user books for trade request: ' + error); }
							})
						}
					}

					response.status(200).json({ 
						success: true,
						message: 'Sent ' + userReceivingRequest.username + ' a request for their book!'
					});
				});


			});

		});

	});
});

function validateBookForm(formData) {
	const errors = {};
	let isFormValid = true;
	let message = '';

	if (!formData || typeof formData.title !== 'string' || formData.title.trim().length === 0) {
		isFormValid = false;
		errors.title = 'Please provide a title for this book.';
	}

	if (!formData || typeof formData.author !== 'string' || formData.author.trim().length === 0) {
		isFormValid = false;
		errors.author = 'Please provide an author for this book.';
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

router.post('/add_new_book', function(request, response, next) {
	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

		const validationResult = validateBookForm(request.body);

		if (!validationResult.success) {
			return response.status(400).json({
				success: false,
				message: validationResult.message,
				errors: validationResult.errors
			});
		}

		if (error) { console.log('error decoding JWT: ' + error); }

		User.findOne({ _id: decodedToken.sub }, (error, user) => {
			if (error) { 
				console.log('couldn\'t find user token in mongo, for add new book request: ' + error); 
			} else {
				const newBookData = {
					title: request.body.title,
					author: request.body.author,
					tradeRequests: [],
					userId: user._id
				};

				const newBook = new Book(newBookData);

				newBook.save((error, book) => {
					if (error) { console.log('error saving new book: ' + error); }

					user.books = user.books.concat([{
						title: request.body.title,
						author: request.body.author,
						tradeRequests: [],
						reservedFor: undefined,
						bookCollectionId: book._id.toString()
					}]);

					user.save((error, updatedUser) => {
						if (error) { console.log('error saving booklist for user: ' + error); }

						response.status(200).json({
							books: user.books,
							message: 'Added ' + request.body.title + ' by ' + request.body.author + ' to your list of books.'
						});
					});
				});
			}
		});

	});
});

router.post('/get_user_books', function(request, response, next) {

	const jsonWebToken = request.headers.authorization.split(" ")[1];

	jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {

		if (error) { console.log('error decoding JWT: ' + error); }

		User.findOne({ _id: decodedToken.sub }, (error, user) => {
			if (error) { 
				console.log('couldn\'t find user token in mongo, for get user books request: ' + error); 
			} else {
				response.status(200).json({
					books: user.books,
					acceptedTradeRequests: user.acceptedTradeRequests
				});
			}
		});

	});

});

module.exports = router;