var express = require('express')
var router = express.Router()

// define the home page route
  router.get('/', function (req, res) {
   req.logout();
    res.redirect('/');
});

  module.exports = router