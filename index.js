var express = require('express');
var app = express();

var path = require ('path');
var bodyParser = require('body-parser');
var passport = require('passport');

var mongo = require('mongodb').MongoClient;
var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/database');
mongoose.connect(process.env.MONGODB_URI);

// look for static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./server/static'));
app.use(express.static('./client/dist'));

// parse HTTP body messages
app.use(bodyParser.urlencoded({ extended: false }));

// pass the passport middleware
app.use(passport.initialize());

// load passport strategies
const localRegisterStrategy = require('./server/passport/local-register');
passport.use('local-register', localRegisterStrategy);
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-login', localLoginStrategy);

// authentication checker middleware
// const authCheckMiddleware = require('./server/middleware/auth-check');
// app.use('/api', authCheckMiddleware);

const api = require('./server/routes/api');
app.use('/api', api);
const auth = require('./server/routes/auth');
app.use('/auth', auth);

app.get('*', function(request, response, next) {
	console.log('Request: [GET]', request.originalUrl);
	response.redirect('/');
});

// app.set('port', 3000);

// var server = app.listen(app.get('port'), function() {
// 	var port = server.address().port;
// 	console.log('Now listening at port ' + port);
// });

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port 8080!');
});