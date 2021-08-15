var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;
const ApplicationModel = require('../model/applicationmodel');


// ---- DEFINE DEFAULT GET ROUTE ----
router.get('/', isAuth, (req, res, next) => {
  username = req.user.username;
  ApplicationModel.find({ submittedBy: username }, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render('../views/dashboard', { user: req.user, apps: result }) //SEND USER DETAILS AND ASSOCIATED APPLICATIONS TO DASHBOARD
    }
  }
  )
})

module.exports = router