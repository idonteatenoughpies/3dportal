var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const passport = require ('passport');
const User = require('../model/user');

let user;

// define the login page route
router.get('/', function (req, res) {
    res.render('../views/login')
  })

// check for username & password combination
router.post('/', [
  check('username').isLength({min:1}).trim().escape()
], 
passport.authenticate('local', { failureRedirect: 'login/failed', successRedirect: '/login/success'}));
  
  // define the success route 
router.get('/success', function (req, res, next ) {
  res.json({ status: "ok",  redirect: '/dashboard'})
})

  // define the failure  route
  router.get('/failed', function (req, res, next ) {
    return res.json({ status: 'error' })
  })

  module.exports = router