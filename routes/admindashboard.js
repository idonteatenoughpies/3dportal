var express = require('express')
var router = express.Router()
const session = require('express-session');
const isAdmin = require('./authMiddleware').isAdmin;
const Users = require('../model/user');
const User = require('../model/user');
const ApplicationModel = require('../model/applicationmodel');
const { check } = require('express-validator');
const isAuth = require('./authMiddleware').isAuth;

// define the home page route
router.get('/', isAdmin, async (req, res) => {
  const allUsers = await Users.find({});
  const allApps = await ApplicationModel.find({})

  res.render('admindashboard', { users: allUsers, apps: allApps });
});

// ---------------- user code ------------------

router.post('/getuser', isAdmin, async (req, res) => {
  const user = req.body;
  const selectedUser = await Users.find({ _id: user });
  res.send(selectedUser);
});

let user;

router.post('/', isAuth, [
  check('email').isEmail().normalizeEmail().escape(),
  check('username').isLength({ min: 1 }).trim().escape(),
  check('first').isLength({ min: 2 }).trim().escape(),
  check('last').isLength({ min: 2 }).trim().escape(),
  check('street1').isLength({ min: 3 }).trim().escape(),
  check('street2').isLength({ min: 3 }).trim().escape(),
  check('town').isLength({ min: 3 }).trim().escape(),
  check('county').isLength({ min: 3 }).trim().escape(),
  check('postcode').isLength({ min: 6 }).trim().escape(),

], async (req, res) => {

  const { _id: id, originalUsername: originalUsername, first: first, last: last, email: email, username: username, street1: street1, street2: street2, town: town, county: county, postcode: postcode, admin: admin } = req.body
  try {
    ApplicationModel.updateOne({ submittedBy: originalUsername }, { $set: { username: username } });
    await User.updateOne({ _id: id }, { $set: { first: first, last: last, email: email, username: username, street1: street1, street2: street2, town: town, county: county, postcode: postcode, admin: admin } });

  } catch (error) {
    throw error
  }

  res.json({ status: 'ok', user: req.user })
});

router.post('/deleteuser', isAuth, async (req, res) => {
  const _id = req.body._id;
  const user = req.body.username;
  const placeholder = "Deleted_User";
  let newUserList
  try {
    await ApplicationModel.updateMany({ submittedBy: user }, { $set: { submittedBy: placeholder } }, function (err) {
      if (err) console.log(err);
    });
    await User.deleteOne({ _id }, function (err) {
      if (err) console.log(err);
    });
    newUserList = await User.find({}, function (err) {
      if (err) console.log(err);
    });
  } catch (error) {
    throw error
  }
  res.json({ status: 'ok', newUserList: newUserList })
});

// ---------------application code ----------------------

router.post('/getapp', isAdmin, async (req, res) => {
  const app = req.body;
  const selectedApp = await ApplicationModel.find({ _id: app });
  res.send(selectedApp);
});

router.post('/updateapp', isAuth, [
  check('status').isLength({ min: 1 }).trim().escape(),
  check('title').isLength({ min: 2 }).trim().escape(),
  check('description').isLength({ min: 2 }).trim().escape(),
  check('submittedBy').isLength({ min: 3 }).trim().escape(),
  check('applicantName').isLength({ min: 3 }).trim().escape(),
  check('applicantAddress').isLength({ min: 3 }).trim().escape(),
  check('applicantPostcode').isLength({ min: 3 }).trim().escape(),
  check('applicantPhone').isLength({ min: 6 }).trim().escape(),
  check('agentName').isLength({ min: 3 }).trim().escape(),
  check('agentAddress').isLength({ min: 6 }).trim().escape(),
  check('AgentPostcode').isLength({ min: 6 }).trim().escape(),
  check('agentPhone').isLength({ min: 6 }).trim().escape(),
  check('propertyOwner').isLength({ min: 6 }).trim().escape(),
  check('applicationStreet1').isLength({ min: 3 }).trim().escape(),
  check('aplicationStreet2').isLength({ min: 3 }).trim().escape(),
  check('applicationTown').isLength({ min: 3 }).trim().escape(),
  check('applicationCounty').isLength({ min: 6 }).trim().escape(),
  check('applicationPostcode').isLength({ min: 6 }).trim().escape(),
  check('model').isLength({ min: 4 }).trim().escape(),

], async (req, res) => {

  const { planningID: planningID, title: title, status: status, description: description, 
    submittedBy: submittedBy, applicantName: applicantName, applicantAddress: applicantAddress, 
    applicantPostcode: applicantPostcode, applicantPhone: applicantPhone, agentName: agentName, 
    agentAddress: agentAddress, agentPostcode: agentPostcode, agentPhone: agentPhone, 
    propertyOwner: propertyOwner, applicationStreet1: applicationStreet1, applicationStreet2: applicationStreet2, 
    applicationTown: applicationTown, applicationCounty: applicationCounty, applicationPostcode: applicationPostcode, 
    modelRequired: modelRequired } = req.body

    console.log (agentName);
  try {
    await ApplicationModel.updateOne({ planningID: planningID }, { $set: {title: title, status: status, description: description, 
      submittedBy: submittedBy, applicant:[{name: applicantName}, {address: applicantAddress}, 
      {postcode: applicantPostcode}, {phone: applicantPhone}], agent:[{name: agentName}, 
      {address: agentAddress}, {postcode: agentPostcode}, {phone: agentPhone}], 
      propertyOwner: propertyOwner, application: [{street1: applicationStreet1}, {street2: applicationStreet2}, 
      {town: applicationTown}, {county: applicationCounty}, {postcode: applicationPostcode}], 
      modelRequired: modelRequired } });

  } catch (error) {
    throw error
  }

  res.json({ status: 'ok' })
});

router.post('/deleteapp', isAuth, async (req, res) => {
  const planningID = req.body.planningID;
  let newAppList
  try {
    await ApplicationModel.deleteOne({ planningID:planningID }, function (err) {
      if (err) console.log(err);
    });
    newAppList = await ApplicationModel.find({}, function (err) {
      if (err) console.log(err);
    });
  } catch (error) {
    throw error
  }
  res.json({ status: 'ok', newAppList: newAppList })
});

module.exports = router

