var express = require('express');
var router = express.Router();
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../model/user');
const genPassword = require ('../lib/passwordUtils').genPassword;

// define the home page route
router.get('/', (req, res) => {
  if (req.isAuthenticated()) { res.redirect('/') }
  else {
  res.render('../views/register')}
})

router.post('/checkUser', async (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.json({ status: 'ok' })
  }
  User.findOne({ username }, function (err, result) {
    if (err) throw err;
    if (!result) {
      return res.json({ status: 'ok' })
    } else { res.json({ status: 'error' }) }
  });
});

router.post('/processregister', [
  check('email').isEmail().normalizeEmail().escape(),
  check('username').isLength({min:1}).trim().escape(),
  check('first').isLength({min:2}).trim().escape(),
  check('last').isLength({min:2}).trim().escape(),
  check('street1').isLength({min:3}).trim().escape(),
  check('street2').isLength({min:3}).trim().escape(),
  check('town').isLength({min:3}).trim().escape(),
  check('county').isLength({min:3}).trim().escape(),
  check('postcode').isLength({min:6}).trim().escape(),

], async (req, res) => {

  const { username: username, password:password, first:first, last:last, email:email, number:number, street1:street1, street2:street2, town:town, county:county, postcode:postcode } = req.body
  const saltHash = genPassword (password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  const admin = false;

  if (!username || typeof username !== 'string') {
    return res.json({ status: 'error', error: 'Invalid username' })
  }
  if (!password || typeof password !== 'string') {
    return res.json({ status: 'error', error: 'Invalid password' })
  }
  if (password.length < 8) {
    return res.json({ status: 'error', error: 'Password must be at least 8 characters long' })
  }
  if (password === 'password' || password === '12345678') {
    return res.json({ status: 'error', error: "Please try a more secure password." })
  }
const newUser = new User({username, hash, salt, first, last, number, street1, street2, town, county, postcode, admin, email})
  
try {
  newUser.save();
  
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ status: 'error', error: 'username is already in use' })
    }
    throw error
  }
  res.json({ status: 'ok' })
});

module.exports = router