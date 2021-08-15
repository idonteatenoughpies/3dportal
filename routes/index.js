var express = require('express');
var router = express.Router();


// ---- DEFINE DEFAULT GET HOMEPAGE ROUTE ----
router.get('/', (req, res) => {
  if (!req.isAuthenticated()) { // LOGICAL TEST FOR LOGGED IN STATUS TO DISPLAY APPROPRIATE NAV BAR
    res.render('index', { user: undefined }); 
  } else {
    res.render('index', { user: req.user });
  }
})
module.exports = router;
