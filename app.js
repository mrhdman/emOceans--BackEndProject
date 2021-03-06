var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var helmet = require('helmet');
app.use(helmet());

const config = require('./config');

var expressSession = require('express-session');
const sessionOptions = {
  secret: config.sessionSecret,
  resave: false,
  saveUnitialized: true,
  // cookie: {secure: true}
};
app.use(expressSession(sessionOptions))

app.use('*', (req, res, next) => {
  if (req.session.loggedIn) {
    res.locals.firstName = req.session.firstName
    res.locals.lastName = req.session.lastName
    res.locals.email = req.session.name
    res.locals.uid = req.session.uid
    res.locals.loggedIn = true;
  } else {
    res.locals.firstName = "";
    res.locals.lastName = "";
    res.locals.email = "";
    res.locals.id = "";
    res.locals.loggedIn = false;
  }
  next();
})

var moment = require('moment');
moment().format();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
