var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;


// define the main application route
router.get('/', (req, res) => {
    const file = req.query.file;
    console.log(file);
  res.render('../views/show', { file: file, user: req.user })
})

module.exports = router;