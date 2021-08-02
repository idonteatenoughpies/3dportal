var express = require('express')
var router = express.Router();
const ApplicationModel = require('../model/applicationmodel');
const UploadedDocument = require('../model/uploadeddocument');


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

router.post('/', async (req, res) => {
    const searchTerm = req.body.search;
    if (searchTerm == "") {
        ApplicationModel.find({}, function (err, result) {
            if (err) {
                console.log(err);
            } else {
            res.json({ status: 'ok', apps: result })
        }
    })
    } else {
    ApplicationModel.find({ $text: { $search: searchTerm } }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.json({ status: 'ok', apps: result })
        }
    })
}
});;


router.get('/viewportal', (req, res) => {
    planningID = decodeURIComponent(req.query.planningID);

    ApplicationModel.find({ planningID: planningID }, function (err, apps) {
        if (err) {
            console.log(err);
        } else {

            UploadedDocument.find({ planningRef: planningID }, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    if (!req.isAuthenticated()) {
                        res.render('viewportal', { user: undefined, apps: apps, docs: docs });
                    } else {
                        res.render('viewportal', { user: req.user, apps: apps, docs: docs });
                    }
                }
            });
        }
    });
});

router.get('/viewmodel/_id/:_id', (req, res) => {
    _id = req.params;
    ApplicationModel.find({ _id }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            if (!req.isAuthenticated()) {
                res.render('viewportal', { user: undefined, apps: result });
            } else {
                res.render('viewportal', { user: req.user, apps: result });
            }
        }
    });

});

module.exports = router;