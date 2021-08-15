var express = require('express')
var router = express.Router();
const ApplicationModel = require('../model/applicationmodel');
const UploadedDocument = require('../model/uploadeddocument');
require('express-validator');

// ---- DEFINE DEFAULT GET ROUTE TO DISPLAY LIST OF ALL APPLICATIONS----
router.get('/', (req, res) => {
    ApplicationModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (!req.isAuthenticated()) { // LOGICAL TEST FOR LOGGED IN STATUS TO DISPLAY APPROPRIATE NAV BAR
                res.render('../views/viewapplications', { user: undefined, apps: result });
            } else {
                res.render('../views/viewapplications', { user: req.user, apps: result });
            }
        }
    });
});

// ---- POST ROUTE FOR SEARCH FUNCTION ----
router.post('/', async (req, res) => {
    const searchTerm = (req.body.search);
    if (searchTerm == "") { //IF SEARCH TERM IS BLANK, RETURN ALL APPLICATIONS
        ApplicationModel.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json({ status: 'ok', apps: result })
            }
        })
    } else { //SEARCH COLLECYTION INDEX FOR THE KEYWORD 
        ApplicationModel.find({ $text: { $search: searchTerm } }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.json({ status: 'ok', apps: result })
            }
        })
    }
});;

// ---- ROUTE TO VIEW DETAILS ABOUT SPECIFIC APPLICATION ----
router.get('/viewportal', (req, res) => {
    planningID = decodeURIComponent(req.query.planningID); // EXTRACT PLANNING ID FROM URL AND DECODE

    //SEARCH DATABASE 'APPLICATIONS' COLLECTION FOR APPLICATION DETAILS MATCHING THE PLANNINGID
    ApplicationModel.find({ planningID: planningID }, function (err, apps) {
        if (err) {
            console.log(err);
        } else {
// SEARCH DATABASE 'UPLOADS' COLLECTION FOR DOCUMENTS THAT MATCH PLANNING ID
            UploadedDocument.find({ planningRef: planningID }, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    if (!req.isAuthenticated()) { //LOGICAL TEST FOR LOGIN TO DISPLAY APPROPRIATE NAV BAR 
                        res.render('viewportal', { user: undefined, apps: apps, docs: docs });
                    } else {
                        res.render('viewportal', { user: req.user, apps: apps, docs: docs });
                    }
                }
            });
        }
    });
});

module.exports = router;