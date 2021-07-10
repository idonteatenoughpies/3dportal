var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;
const ApplicationModel = require('../model/applicationmodel');
const fileUpload = require('express-fileupload');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');


// define the main application route
router.get('/', isAuth, (req, res) => {
  if (!req.isAuthenticated()) { res.redirect('/login') }
  res.render('../views/application', { user: req.user })
})

// define the new application route
router.post('/newApplication', isAuth, async (req, res) => {
  if (!req.isAuthenticated()) { res.redirect('/login') }
  else {
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

    let currentCount
    try {
      
      await ApplicationModel.countDocuments({}, function (err, count) {
        if (err) return res.json({ status: 'error', error: error })
        currentCount = count;
        console.log(currentCount);
        newCount = (currentCount + 1)
      });
      const planningID = yearCreated.concat("/", newCount);

      try {
        await ApplicationModel.create({
          planningID: planningID,
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
      } catch (error) {

        return res.json({ status: 'error', error:  "model creation failed " + error })
      }
      res.json({ status: 'ok', ref: planningID})
    }
    catch (error) {
      return res.json({ status: 'error', error: "Count docs failed " + error })
    }
 
  }
});

router.get('/applicationupload', isAuth, (req, res) => {
  if (!req.isAuthenticated()) { res.redirect('/login') }
  const name = req.query.ref;
  res.render('../views/applicationupload', { user: req.user, ref: name })
})

router.post('/applicationupload', isAuth, (req, res) => {

  if (!req.isAuthenticated()) {
    res.redirect('/login')
  } else {
    try {
      if (!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {
          let document = req.files.documentinput0;

          console.log(document);

          //create a unique id
          const uid= uuidv4(document.name);
          const ext=document.name.slice((Math.max(0, document.name.lastIndexOf(".")) || Infinity) + 1);

          //move photo to uploads directory
          document.mv('./uploads/' + uid + "." + ext);

          data = {
            name: document.name,
            mimetype: document.mimetype,
            size: document.size
          };

        const id=req.body.planningID; 
        console.log(id);

        //return response
        res.send({
          status: true,
          message: 'Files are uploaded',
          data: data
        })
      }
    } catch (err) {
      res.status(500).send(err);
    }
  };
});


module.exports = router