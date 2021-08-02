var express = require('express')
var router = express.Router()
const Model = require('../model/model')

// define the home page route
router.get('/', function (req, res) {
  const ref = decodeURIComponent(req.query.ref);
  Model.find({ planningID: ref }, function (err, model) {
    if (err) {
      console.log(err);
    } else {
      if (!req.isAuthenticated()) {
        res.render('../views/3dmodel', { user: undefined, model: model })
      } else {
        res.render('../views/3dmodel', { user: req.user, model: model })
      }
    }
  })
})

  module.exports = router