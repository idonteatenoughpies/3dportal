var express = require('express')
var router = express.Router();
const ApplicationModel = require('../model/applicationmodel');


// define the view all applications page route
router.get('/', (req, res) => {
    ApplicationModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (!req.isAuthenticated()) {
                res.render('../views/viewapplications', { user: undefined, apps: result });
            } else {
                res.render('../views/viewapplications', { user: req.user, apps: result });
            }
        }
    });
});

router.get('/viewportal', (req, res) => {
    if (!req.isAuthenticated()) {
        res.render('viewportal', { user: undefined});
    } else {
        res.render('viewportal', { user: req.user});
    }
});

module.exports = router;