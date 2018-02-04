require('./config/config.js');

var express = require('express');
var path = require('path');
const hbs = require('hbs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var index = require('./routes/index');
var users = require('./routes/users');

var {mongoose} = require('./db/mongoose');
var {Post} = require('./models/post');
var {loggedIn} = require('./middleware/loggedIn')

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(username, password, cb) {
    users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

 // Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

hbs.registerHelper('ifUser', (user,options) => {

  if(user){
      return options.fn(this);
    } else {
      return options.inverse(this);
    }

});

app.get('/', function(req,res) {
	res.render('index',{user: req.user});
});

// app.use('/users', users);

app.route('/login')
  .get(function (req, res) {
    res.render('login', {layout: 'login_layout.hbs'})
  })
  .post(passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
          res.redirect('/');
  });

//  Admin section 

app.get('/admin', function(req,res) {
  res.render('admin/index',{layout: 'admin_layout/layout.hbs',user: req.user});
});

app.get('/admin/flot', function(req,res) {
  res.render('admin/flot',{layout: 'admin_layout/flot_layout.hbs',user: req.user});
});

app.get('/admin/morris', function(req,res) {
  res.render('admin/morris',{layout: 'admin_layout/flot_layout.hbs',user: req.user});
});

app.get('/admin/tables', function(req,res) {
  res.render('admin/tables',{user: req.user});
});
















// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
