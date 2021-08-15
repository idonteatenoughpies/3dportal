var express = require('express')
var router = express.Router()
const { check } = require('express-validator');
const passport = require ('passport');
const User = require('../model/user');

let user;

// ---- DEFINE DEFAULT GET ROUTE ----
router.get('/', function (req, res) {
    res.render('../views/login')
  })

router.post('/', [
  check('username').isLength({min:1}).trim().escape()
], 
passport.authenticate('local', { failureRedirect: 'login/failed', successRedirect: '/login/success'}));
  
  // ---- SUCCESS ROUTE ----
router.get('/success', function (req, res, next ) {
  res.json({ status: "ok",  redirect: '/dashboard'})
})

  // ---- FAILURE ROUTE ----
  router.get('/failed', function (req, res, next ) {
    return res.json({ status: 'error' })
  })

  module.exports = router