var express = require('express')
var router = express.Router()
const session = require('express-session');
const { check } = require('express-validator');
const isAuth = require('./authMiddleware').isAuth;
const ApplicationModel = require('../model/applicationmodel');
const UploadedDocument = require('../model/uploadeddocument')
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');
const Model = require('../model/model')


// define the main application route
router.get('/', isAuth, (req, res) => {
  res.render('../views/application', { user: req.user })
})

// define the new application route
router.post('/newApplication', isAuth,  [
  check('title').isLength({min:1}).trim().escape(),
  check('description').isLength({min:1}).trim().escape(),
  check('applicantName').isLength({min:1}).trim().escape(),
  check('applicantAddress').isLength({min:1}).trim().escape(),
  check('applicantPostcode').isLength({min:1}).trim().escape(),
  check('agentName').isLength({min:1}).trim().escape(),
  check('agentAddress').isLength({min:1}).trim().escape(),
  check('agentPhone').isLength({min:1}).trim().escape(),
  check('propertyOwner').isLength({min:1}).trim().escape(),
  check('applicationStreet1').isLength({min:1}).trim().escape(),
  check('applicationStreet2').isLength({min:1}).trim().escape(),
  check('applicationTown').isLength({min:1}).trim().escape(),
  check('applicationCounty').isLength({min:1}).trim().escape(),
  check('applicationPostcode').isLength({min:1}).trim().escape(),
  check('modelRequired').isBoolean().trim().escape(),

],async (req, res) => {
    const { title,
      description,
      applicantName,
      applicantAddress,
      applicantPostcode,
      applicantPhone,
      agentName,
      agentAddress,
      agentPostcode,
      agentPhone,
      propertyOwner,
      applicationStreet1,
      applicationStreet2,
      applicationTown,
      applicationCounty,
      applicationPostcode,
      modelRequired } = req.body
    const status = 'submitted';
    const dateCreated = new Date();
    const yearCreated = dateCreated.getFullYear().toString();

    let currentCount;
    let newCount;
    let planningID;
    try {

      await ApplicationModel.countDocuments({}, async function (err, count) {
        if (err) return res.json({ status: 'error', error: error })
        currentCount = count;
        newCount = (currentCount + 1)
        const submittedBy = req.user.username;
        planningID = yearCreated.concat("/", newCount);

        try {
          await ApplicationModel.create({
            planningID: planningID,
            submittedBy: submittedBy,
            dateCreated: dateCreated,
            yearCreated: yearCreated,
            status: status,
            title: title,
            description: description,
            applicant: {
              name: applicantName,
              address: applicantAddress,
              postcode: applicantPostcode,
              phone: applicantPhone
            },
            agent: {
              name: agentName,
              address: agentAddress,
              postcode: agentPostcode,
              phone: agentPhone
            },
            propertyOwner: propertyOwner,
            applicationAddress: {
              street1: applicationStreet1,
              street2: applicationStreet2,
              town: applicationTown,
              county: applicationCounty,
              postcode: applicationPostcode,
            },
            modelRequired: modelRequired
          })
          ApplicationModel.collection.dropIndexes(function (err) {
            if (err) {

              return res.json({ status: 'error', error: error })
            }
          });

        } catch (error) {

          return res.json({ status: 'error', error: "model creation failed " + error })
        }
      })
    } catch (error) {
      return res.json({ status: 'error', error: "Count docs failed " + error })
    }
    res.json({ status: 'ok', ref: planningID })
  
});


router.get('/applicationupload', isAuth, (req, res) => {
  const name = req.query.ref;
  var modelsuccess = req.query.modelsuccess;
  res.render('../views/applicationupload', { user: req.user, ref: name, modelsuccess: modelsuccess })
})

router.get('/modelupload', isAuth, (req, res) => {
  const name = req.query.ref;
  res.render('../views/modelupload', { user: req.user, ref: name})
})


router.post('/applicationupload', isAuth, (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let length = parseInt(req.body.count);

      for (let i = 0; i < length; i++) {

        let document = req.files["documentinput" + i];

        //create a unique id
        const uid = uuidv4(document.name);
        const ext = document.name.slice((Math.max(0, document.name.lastIndexOf(".")) || Infinity) + 1);

        //move photo to uploads directory
        document.mv('./uploads/' + uid + "." + ext);

        data = {
          name: document.name,
          mimetype: document.mimetype,
          size: document.size
        };

        //save location to database
        try {
          const id = req.body.planningID;
          const filepath = "/uploads/";
          const filename = uid + "." + ext;
          const originalName = document.name;
          const text = req.body['documenttext' + i];
          UploadedDocument.create({
            planningRef: id,
            filepath: filepath,
            filename: filename,
            originalName: originalName,
            description: text
          })
        } catch (error) {
          return res.json({ status: 'error', error: "database upload failed " + error })
        }
      }
      //return response
      var string = encodeURIComponent(req.body.planningID);
      res.redirect('../viewApplications/viewportal?planningID=' + string);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/modelupload', isAuth, async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let length = parseInt(req.body.count);

      for (let i = 0; i < length; i++) {

        let document = req.files["modelInput" + i];

        //create a unique id
        const uid = uuidv4(document.name);
        const ext = document.name.slice((Math.max(0, document.name.lastIndexOf(".")) || Infinity) + 1);

        //move photo to uploads directory
        document.mv('./models/' + uid + "." + ext);

        data = {
          name: document.name,
          mimetype: document.mimetype,
          size: document.size
        };

        //save location to database
        try {
          const id = req.body.planningID;
          const filepath = "/models/";
          const filename = uid + "." + ext;
          const originalName = document.name;
   
          await Model.create({
            planningID: id,
            filepath: filepath,
            filename: filename,
            originalName: originalName,
           
          })
          const update = await ApplicationModel.findOne({planningID:id})
          update.modelRequired = true;
          await update.save();

        } catch (error) {
          return res.json({ status: 'error', error: "database upload failed " + error })
        }
      }
      //return response
      var id = encodeURIComponent(req.body.planningID);
      var modelsuccess = true;
      res.redirect(`/application/applicationupload?ref=${id}&modelsuccess=${modelsuccess}`);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router