const express = require('express');
var router = new express.Router();
const https = require('https');
var querystring = require('querystring');
const async = require('async');
var Token = require('../models/token');
var User = require('../models/user');
var Business = require('../models/business');
const jwt = require('jsonwebtoken')

const clientId = encodeURIComponent(process.env.YELP_CLIENT_ID);
const clientSecret = encodeURIComponent(process.env.YELP_CLIENT_SECRET);

function getYelpNightclubData(token, location, userMongoId, httpResponseCallback) {

	const queryString = '?categories=nightlife&location=' + encodeURIComponent(location);

	const options = {
		hostname: 'api.yelp.com',
		path: '/v3/businesses/search' + queryString,
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + token
		}
	};

	return https.get(options, (response) => {
		let data = '';

		response.on('data', (chunk) => {
			data += chunk;
		});

		response.on('end', () => {
			parsedData = JSON.parse(data);

			// check if data is a yelp API lookup error. if so, immediately send it back to client.
			if (parsedData.hasOwnProperty('error')) {
				return httpResponseCallback(parsedData);
			}

			// if not an error, parse JSON data down to the essentials.
			let yelpBusinessData = parsedData.businesses.map((item) => {
				return {
					id: item.id,
					name: item.name,
					image_url: item.image_url,
					url: item.url,
					review_count: item.review_count,
					rating: item.rating,
					city: item.location.city,
					checkins: null,
					userIsCheckedIn: false
				};
			});

			// async call to the database to determine how many users have checked into each location.
			async.each(yelpBusinessData, (item, callback) => {

				Business.findOne({ city: item.city, yelp_id: item.id }, 'yelp_id checkin_list', (error, business) => {
					if (error) { callback('error finding business in mongo.') }

					// if the business doesn't exist in the database, create a new entry for it.
					if (!business) {
						Business.createBusiness(new Business({ yelp_id: item.id, city: item.city, checkin_list: [] }), (error, newBusiness) => {
							if (error) { console.log(error) }

							for (var i = 0; i < yelpBusinessData.length; i++) {
								if (yelpBusinessData[i].id === newBusiness.yelp_id) {
									yelpBusinessData[i].checkins = 0;
								}
							}

							callback();
						});

					// if the business does exist, then get the number of checkins from the database and add it to the data.
					} else {
						for (var i = 0; i < yelpBusinessData.length; i++) {
							if (yelpBusinessData[i].id === business.yelp_id) {

								yelpBusinessData[i].checkins = business.checkin_list.length;

								// iterate through the checkin list to check if the user's mongoID is on that list.
								if (userMongoId) {
									for (var j = 0; j < business.checkin_list.length; j++) {
										if (business.checkin_list[j] === userMongoId) {
											yelpBusinessData[i].userIsCheckedIn = true;
										} 
									}
								}
							}
						}

						callback();
					}
				});
			}, (error) => {
				if (error) { console.log(error) }

				return httpResponseCallback(yelpBusinessData);
			});
		});
	}).on('error', (error) => {
		console.log('error: ' + error);
		return error;
	});
}

function getYelpApiToken(searchTerm, userMongoId, response) {

	// yelp authentication tokens expire on january 13, 2038. if it's before then, use the cached token stored in the app's mongodb to call the yelp API.
	if (Date.now() < 2150092800000) {
		Token.findOne({ name: 'token' }).then((document) => {

			getYelpNightclubData(document.token, searchTerm, userMongoId, (data) => {
				return response.json(data);
			});
		});
	} else {
	// if it's after january 13, 2038, the yelp authentication token is expired. call the yelp API to get a new auth token and store it in mongodb.

		const options = {
			method: 'POST',
			hostname: 'api.yelp.com',
			path: '/oauth2/token',
			port: null,
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			}
		}

		const newTokenRequest = https.request(options, (tokenResponse) => {
			let chunks = [];

			tokenResponse.on('data', (chunk) => {
				chunks.push(chunk);
			})

			tokenResponse.on('end', () => {
				const body = Buffer.concat(chunks);

				Token.findOne({ name: 'token' }, (error, document) => {
					document.token = JSON.parse(body.toString()).access_token;
					document.save();

					getYelpNightclubData(JSON.parse(body.toString()).access_token, userMongoId, request.body.searchTerm, (data) => {
						return response.json(data);
					});
				});
			});
		});

		newTokenRequest.write(querystring.stringify({
			grant_type: 'client_credentials',
			client_id: clientId,
			client_secret: clientSecret
		}));

		newTokenRequest.end();

	}
}

// router.post('/', function(request, response, next) {
// 	console.log("yay!");
// });

router.post('/', function(request, response, next) {

	const authorizationHeader = request.headers.authorization;

	if (authorizationHeader) {
		const jsonWebToken = authorizationHeader.split(" ")[1];

		if (jsonWebToken !== 'null') {
			jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {
				if (error) { console.log(error) }

				getYelpApiToken(request.body.searchTerm, decodedToken.sub, response);	
			});
		} else {
			getYelpApiToken(request.body.searchTerm, null, response);
		}
	} else {
		getYelpApiToken(request.body.searchTerm, null, response);
	}
});

router.post('/checkin_checkout', function(request, response, next) {

	const authorizationHeader = request.headers.authorization;

	if (typeof authorizationHeader !== 'undefined') {
		const jsonWebToken = authorizationHeader.split(" ")[1];

		if (jsonWebToken !== 'null') {
			jwt.verify(jsonWebToken, process.env.JWT_KEY, (error, decodedToken) => {
				if (error) { console.log(error) }

				let userIsCheckedIn = undefined;

				Business.findOne({ yelp_id: request.body.businessId }, 'checkin_list', (error, business) => {

					if (business.checkin_list.indexOf(decodedToken.sub) < 0) {

						business.checkin_list = business.checkin_list.concat([decodedToken.sub]);
						business.save((error, updatedBusiness) => {
							if (error) { console.log(error) }
						});

						userIsCheckedIn = true;
					} else {
						for (var i = 0; i < business.checkin_list.length; i++) {
							if (business.checkin_list[i] === decodedToken.sub) {
								business.checkin_list.splice(i, 1);

								business.save((error, updatedBusiness) => {
									if (error) { console.log(error) }
								});

								userIsCheckedIn = false;
							}
						}
					}

					return response.json({ id: request.body.businessId, checkins: business.checkin_list.length, userIsCheckedIn: userIsCheckedIn });
				});
			});
		}
	} else {
		return response.status(400).json({
			success: false,
			message: "Request didn't include user login token.",
			errors: {}
		});
	}

});

module.exports = router;