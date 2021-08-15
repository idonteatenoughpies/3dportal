var express = require('express')
var router = express.Router()
const session = require('express-session');
const { check } = require('express-validator');
const isAuth = require('./authMiddleware').isAuth;
const User = require('../model/user');
const ApplicationModel = require('../model/applicationmodel');

let user; // DEFINE USER TO BE ACCESSED THROUGHOUT MULTIPLE ROUTES

// ---- DEFINE DEFAULT GET ROUTE ----
router.get('/', isAuth, function (req, res) {
  res.render('../views/accountdetails', { user: req.user })
})

// ---- POST ROUTE ---- 

/* IMPLEMENT EXPRESS VALIDATOR TO TRIM INPUT AND ESCAPE SPECIAL CHARACTERS FOR SECURITY. 
MINIMUM LENGTH IMPLEMENTED TO ENSURE VALID INOUTS ARE INPUT */
router.post('/', isAuth, [
  check('email').isEmail().normalizeEmail().escape(),
  check('username').isLength({ min: 1 }).trim().escape(),
  check('first').isLength({ min: 2 }).trim().escape(),
  check('last').isLength({ min: 2 }).trim().escape(),
  check('street1').isLength({ min: 3 }).trim().escape(),
  check('street2').isLength({ min: 3 }).trim().escape(),
  check('town').isLength({ min: 3 }).trim().escape(),
  check('county').isLength({ min: 3 }).trim().escape(),
  check('postcode').isLength({ min: 6 }).trim().escape(),

], async (req, res) => {

  const { first: first, last: last, email: email, username: username, street1: street1, street2: street2, town: town, county: county, postcode: postcode } = req.body
  const _id = req.user._id;
  const originalUsername = req.user.username;

  // UPDATE APPLICABLE APPLICATIONS WITH NEW USERNAME BEFORE AMENDING USER RECORD TO AVOID LOSING ACCESS TO THEM
  try {
    ApplicationModel.updateOne({ submittedBy: originalUsername }, { $set: { username: username } }, function (err) {
      if (err) console.log(err);
    });
    await User.updateOne({ _id }, { $set: { first: first, last: last, email: email, username: username, street1: street1, street2: street2, town: town, county: county, postcode: postcode } });

  } catch (error) {
    throw error
  }

  res.json({ status: 'ok', user: req.user })
});

// ---- DELETE USER ROUTE ----
router.post('/deleteuser', isAuth, async (req, res) => {
  const _id = req.user._id;
  const user = req.user.username;
  const placeholder = "Deleted_User";
  // UPDATE USERNAME IN APPLICATIONS TO 'DELETED-USER' BEFORE DELETING USER ACCOUNT
  try {
    await ApplicationModel.updateMany({ submittedBy: user }, { $set: { submittedBy: placeholder } }, function (err) {
      if (err) console.log(err);
    });
    await User.deleteOne({ _id }, function (err) {
      if (err) console.log(err);
    });
  } catch (error) {
    throw error
  }

  res.json({ status: 'ok', redirect: '/logout' })
});

module.exports = router