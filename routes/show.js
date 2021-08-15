var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;


// ---- DEFINE DEFAULT GET ROUTE TO DISPLAY DOCUMENT----
router.get('/', (req, res) => {
  const file = req.query.file;
  res.render('../views/show', { file: file, user: req.user })
})

module.exports = router;