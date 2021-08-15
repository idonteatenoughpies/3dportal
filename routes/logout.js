var express = require('express')
var router = express.Router()

// ---- DEFINE DEFAULT GET ROUTE ----
  router.get('/', function (req, res) {
   req.logout();
    res.redirect('/');
});

  module.exports = router