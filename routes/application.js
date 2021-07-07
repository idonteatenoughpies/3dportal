var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAuth = require('./authMiddleware').isAuth;
const ApplicationModel = require('../model/applicationmodel');


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
  

    try {
      let currentCount
      await ApplicationModel.countDocuments({}, function (err, count) {
        if (err) return res.json({ status: 'error', error: error })
        currentCount = count;
        currentCount = (currentCount + 1)
      });
      const planningID = yearCreated.concat("/", currentCount);

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

        return res.json({ status: 'error', error: error })
      }
    }
    catch (error) {
      return res.json({ status: 'error', error: error })
    }
    res.json({ status: 'ok' })
  }
});


module.exports = router