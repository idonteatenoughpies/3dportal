var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('index', { user: undefined });
  } else {
    res.render('index', { user: req.user });
  }
})
module.exports = router;
