// ----- IMPORTING MODULES -----
const express = require('express');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require ('passport');
const cors = require('cors');
require('dotenv').config();
const app = express();

//  ---- VIEW ENGINE SETUP ----
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---- INSTRUCTIONS TO USE MIDDLEWARE ----
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/models", express.static(path.join(__dirname, 'models')));
app.use(cors());

// ---- ENABLE FILE UPLOAD ----
app.use(fileUpload({
  createParentPath: true
}));

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

  // ---- IMPLEMENTING SESSIONS ----
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoURL
  }),
  cookie: {maxAge: 1000 * 60 * 60 * 24} // SET SESSION COOKIE VALIDITY LIFETIME OF 24 HOURS
}));

//  ---- PASSPORT AUTHENTICATION ----
require('./config/passport'); 
app.use(passport.initialize());
app.use(passport.session());

//  ---- CREATING ROUTERS -----
const indexRouter = require('./routes/index');
const adminDashboardRouter = require('./routes/admindashboard');
const changePasswordRouter = require('./routes/change-password');
const dashboardRouter = require('./routes/dashboard');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const threedmodelRouter = require('./routes/3dmodel');
const applicationRouter = require('./routes/application');
const viewapplicationsRouter = require('./routes/viewApplications');
const showRouter = require('./routes/show');
const accountRouter = require('./routes/accountdetails');
const imageGalleryRouter = require('./routes/imagegallery');

// ---- IMPLEMENTING ROUTERS ----
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
app.use('/show', showRouter);
app.use('/accountdetails', accountRouter);
app.use('/imagegallery', imageGalleryRouter);

// ---- SET APP TO LISTEN ON PORT 3000 ----
const port = 3000;
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

module.exports = app;
