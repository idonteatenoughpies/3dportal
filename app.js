const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require ('passport');
require('dotenv').config();

const app = express();

//  ---- VIEW ENGINE SETUP -----
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//  ---- DATABASE CONNECTION ----
const MONGO_USERNAME = process.env.MONGO_USERNAME;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME;
const MONGO_PORT = process.env.MONGO_PORT;
const MONGO_DB = process.env.MONGO_DB;
mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/3dportal'
  }),
  cookie: {maxAge: 1000 * 60 ^ 60 * 24}
}));

//  ---- PASSPORT AUTHENTICATION ---
require('./config/passport'); 
app.use(passport.initialize());
app.use(passport.session());

// ---- SOME DEBUGGING CODE ----
app.use((req, res, next) => {
  console.log(req.session);
  console.log(req.user);
  next()
});

//  ---- ROUTERS -----
const indexRouter = require('./routes/index');
const adminDashboardRouter = require('./routes/admindashboard');
const changePasswordRouter = require('./routes/change-password');
const dashboardRouter = require('./routes/dashboard');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const threedmodelRouter = require('./routes/3dmodel');
const applicationRouter = require('./routes/application');
const viewapplicationsRouter = require('./routes/viewapplications');

app.use('/', indexRouter);
app.use('/admindashboard', adminDashboardRouter);
app.use('/change-password', changePasswordRouter);
app.use('/dashboard', dashboardRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', registerRouter);
app.use('/3dmodel', threedmodelRouter);
app.use('/application', applicationRouter);
app.use('/viewapplications', viewapplicationsRouter);




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

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
