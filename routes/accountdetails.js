var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;
const User = require('../model/user');

let user;

// define the home page route
router.get('/', isAuth, function (req, res) {
    res.render('../views/accountdetails', {user: req.user})
  })


  router.post('/', async (req, res) => {

    const { first:first, last:last, email: email, username: username, street1:street1, street2:street2, town:town, county:county, postcode:postcode } = req.body
    const _id =req.user._id;
  try {
    await User.updateOne({_id}, { $set: { first:first, last:last, email: email, username: username, street1:street1, street2:street2, town:town, county:county, postcode:postcode } });
    
    } catch (error) {
      throw error
    }
    res.json({ status: 'ok' })
  });

  module.exports = router