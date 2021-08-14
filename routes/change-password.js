var express = require('express')
var router = express.Router()
const session = require('express-session');
const User = require('../model/user');
const isAuth = require('./authMiddleware').isAuth;
const genPassword = require ('../lib/passwordUtils').genPassword;

let user;

// define the home page route

router.post('/processChange', isAuth, async (req, res) => {
  if (!req.isAuthenticated()) { res.redirect('/login') }

  const { password: password } = req.body;

  if (!password || typeof password !== 'string') {
      return res.json({ status: 'error', error: 'Invalid password' })
  }
  if (password.length < 8) {
      return res.json({ status: 'error', error: 'Password must be at least 8 characters long' })
  }
  if (password === 'password' || password === '12345678') {
      return res.json({ status: 'error', error: "Please try a more secure password." })
  }


  try {
      const username = req.user.username; 
      const saltHash = genPassword (password);
      const salt = saltHash.salt;
      const hash = saltHash.hash;

      await User.updateOne(
          { username }, {
          $set: { hash:hash, salt:salt}
      }
      )
      res.json({ status: 'ok' })

  } catch (error) {
      res.json({ status: 'error', error: 'Authenication failure' })
  }
});

router.post('/processChangeAdmin', isAuth, async (req, res) => {
    if (!req.isAuthenticated()) { res.redirect('/login') }
  
    const { password: password } = req.body;
    
  
    if (!password || typeof password !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }
    if (password.length < 8) {
        return res.json({ status: 'error', error: 'Password must be at least 8 characters long' })
    }
    if (password === 'password' || password === '12345678') {
        return res.json({ status: 'error', error: "Please try a more secure password." })
    }
  
  
    try {
        const _id = req.body._id; 
        const saltHash = genPassword (password);
        const salt = saltHash.salt;
        const hash = saltHash.hash;
  
        await User.updateOne(
            { _id:_id }, {
            $set: { hash:hash, salt:salt}
        }
        )
        res.json({ status: 'ok' })
  
    } catch (error) {
        res.json({ status: 'error', error: 'Authenication failure' })
    }
  });

module.exports = router