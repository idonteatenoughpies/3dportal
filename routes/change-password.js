var express = require('express')
var router = express.Router()
const session = require('express-session');
const User = require('../model/user');
const isAuth = require('./authMiddleware').isAuth;
const isAdmin = require('./authMiddleware').isAdmin;
const genPassword = require('../lib/passwordUtils').genPassword;

// ---- POST ROUTE TO CHANGE PASSWORD ----
router.post('/', isAuth, async (req, res) => {
    if (!req.isAuthenticated()) { res.redirect('/login') }

    const { password: password } = req.body;

    if (!password || typeof password !== 'string') { // SERVER-SIDE CHECK FOR STRING PASSWORD
        return res.json({ status: 'error', error: 'Invalid password' })
    }
    if (password.length < 8) { // SERVER-SIDE CHECK FOR PASSWORD LENGTH
        return res.json({ status: 'error', error: 'Password must be at least 8 characters long' })
    }
    if (password.includes('password') || password.includes('12345678')) { //SERVER-SIDE CHECK FOR FORBIDDEN STRINGS
        return res.json({ status: 'error', error: "Please try a more secure password." })
    }

    try {
        const username = req.user.username; //TAKE USERNAME FROM SESSION FOR SECURITY
        const saltHash = genPassword(password); // CREATE SALT AND HASH FROM PASSWORD
        const salt = saltHash.salt; // SAVE SALT TO VARIABLE
        const hash = saltHash.hash; // SAVE HASH TO VARIABLE
        // SAVE SALT AND HASH TO USER'S DOCUMENT IN DATABASE
        await User.updateOne(
            { username }, {
            $set: { hash: hash, salt: salt }
        }
        )
        res.json({ status: 'ok' })

    } catch (error) {
        res.json({ status: 'error', error: 'Authenication failure' })
    }
});

// ---- ROUTE TO UPDATE PASSWORD FROM ADMIN DASHBOARD ----
router.post('/Admin', isAdmin, async (req, res) => {
    if (!req.isAuthenticated()) { res.redirect('/login') }

    const { password: password } = req.body; // OBTAIN PASSWORD FROM POST BODY

    if (!password || typeof password !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' }) //SERVER-SIDE CHECK FOR STRING PASSWORD
    }
    if (password.length < 8) {
        return res.json({ status: 'error', error: 'Password must be at least 8 characters long' }) // SERVER-SIDE CHECK FOR PASSWORD LENGTH
    }
    if (password.includes('password') || password.includes('12345678')) {
        return res.json({ status: 'error', error: "Please try a more secure password." })//SERVER-SIDE CHECK FOR FORBIDDEN STRINGS
    }

    try {
        const _id = req.body._id; // TAKE USERNAME FROM POST REQUEST (ROUTE SHOULD BE PROTECTED BY isAdmin)
        const saltHash = genPassword(password); // GENERATE SALT AND HASH FROM PASSWORD
        const salt = saltHash.salt; // SAVE SALT TO VARIABLE
        const hash = saltHash.hash; // SAVE HASH TO VARIABLE

        // UPDATE USER DOCUMENT IN DATABASE 
        await User.updateOne(
            { _id: _id }, {
            $set: { hash: hash, salt: salt }
        }
        )
        res.json({ status: 'ok' })

    } catch (error) {
        res.json({ status: 'error', error: 'Authenication failure' })
    }
});

module.exports = router