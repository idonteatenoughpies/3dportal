var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;

let user;

// define the home page route
router.get('/', isAuth, function (req, res) {
    res.render('../views/accountdetails', {user: req.user})
  })

  module.exports = router