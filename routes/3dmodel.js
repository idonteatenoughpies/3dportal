var express = require('express')
var router = express.Router()
const Model = require('../model/model')

// ---- DEFINE DEFAULT GET ROUTE ----
router.get('/', function (req, res) {
  const ref = decodeURIComponent(req.query.ref); //OBTAIN PLANNING ID FROM URL AND DECODE
  Model.find({ planningID: ref }, function (err, model) {
    if (err) {
      console.log(err);
    } else {
      if (!req.isAuthenticated()) {
        res.render('../views/3dmodel', { user: undefined, model: model }) //ENSURE CORRECT NAV BAR SHOWS FOR LOGIN STATUS
      } else {
        res.render('../views/3dmodel', { user: req.user, model: model })
      }
    }
  })
})

module.exports = router