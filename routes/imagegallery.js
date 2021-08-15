var express = require('express')
var router = express.Router()

// ---- ROUTE TO LOAD IMAGES FOR USER EVALUATION ----
router.get('/', function (req, res) {
  
    res.render('../views/imagegallery')
  })

  module.exports = router