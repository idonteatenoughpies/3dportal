var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAdmin = require('./authMiddleware').isAdmin;

// define the home page route
router.get('/', isAdmin, (req, res) => {
     res.render('admindashboard', {user:req.user}); 
    });

module.exports = router