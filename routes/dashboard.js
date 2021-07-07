var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;

// define the home page route
router.get('/', isAuth, (req, res, next) => {
 
  res.render('../views/dashboard', {user:req.user})
})

  module.exports = router