var express = require('express')
var router = express.Router()
const session = require('express-session');
const { check } = require('express-validator');
const isAuth = require('./authMiddleware').isAuth;
const ApplicationModel = require('../model/applicationmodel');
const UploadedDocument = require('../model/uploadeddocument')
const PlanningID = require('../model/planningID')
const Model = require('../model/model')
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid'); // USED TO GENERATE UNIQUE ID'S FOR UPLOADS

// ---- DEFINE DEFAULT GET ROUTE ----
router.get('/', isAuth, (req, res) => {
  res.render('../views/application', { user: req.user })
})

// ---- DEFINE THE NEW PLANNING APPLICATION ROUTE ----
/* IMPLEMENT EXPRESS VALIDATOR TO TRIM INPUT AND ESCAPE SPECIAL CHARACTERS FOR SECURITY. 
MINIMUM LENGTH IMPLEMENTED TO ENSURE VALID INOUTS ARE INPUT */
router.post('/newApplication', isAuth, [
  check('title').isLength({ min: 1 }).trim().escape(),
  check('description').isLength({ min: 1 }).trim().escape(),
  check('applicantName').isLength({ min: 1 }).trim().escape(),
  check('applicantAddress').isLength({ min: 1 }).trim().escape(),
  check('applicantPostcode').isLength({ min: 1 }).trim().escape(),
  check('agentName').isLength({ min: 1 }).trim().escape(),
  check('agentAddress').isLength({ min: 1 }).trim().escape(),
  check('agentPhone').isLength({ min: 1 }).trim().escape(),
  check('propertyOwner').isLength({ min: 1 }).trim().escape(),
  check('applicationStreet1').isLength({ min: 1 }).trim().escape(),
  check('applicationStreet2').isLength({ min: 1 }).trim().escape(),
  check('applicationTown').isLength({ min: 1 }).trim().escape(),
  check('applicationCounty').isLength({ min: 1 }).trim().escape(),
  check('applicationPostcode').isLength({ min: 1 }).trim().escape(),
  check('modelRequired').isBoolean().trim().escape(),

], async (req, res) => {
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
  const status = 'submitted'; //HARD CODE ALL NEW APPLICATIONS TO BE CREATED WITH 'SUBMITTED' STATUS
  const dateCreated = new Date();
  const yearCreated = dateCreated.getFullYear().toString(); //EXTRACT YEAR FROM DATE CREATED TO AID IN DATABASE SEARCHING

  let currentCount;
  let newCount;
  let planningID;
  try {
    // ---- COUNT DOCUMENTS IN PLANNINGIDS COLLECTION THAT MATCH THE CURRENT YEAR TO GENERATE NEW ID NUMBER ----
    await PlanningID.countDocuments({ year: yearCreated }, async function (err, count) {
      if (err) return res.json({ status: 'error', error: error })
      currentCount = count;
      newCount = (currentCount + 1).toString();
      newCount = newCount.padStart(4, '0'); // ADD PADDING TO CREATE 4 DIGIT NUMERICAL ELEMENT
      const submittedBy = req.user.username;
      planningID = "APP/".concat(yearCreated.concat("/", newCount)); //COMBINE ELEMTNS TO CREATE FULL PLANNING REFERENCE

      // CLEAR CURRENT INDEXES FOR COLLECTION 
      ApplicationModel.collection.dropIndexes(function (err) {
        if (err) {

          return res.json({ status: 'error', error: error })
        }
      });
      // CREATE NEW ENTRY (SCHEMA WILL GENERATE NEW SEARCHABLE INDEX)
      try {
        await PlanningID.create({
          year: yearCreated,
          count: newCount
        })

        await ApplicationModel.create({
          planningID: planningID,
          submittedBy: submittedBy,
          dateCreated: dateCreated,
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

        return res.json({ status: 'error', error: "model creation failed " + error })
      }
    })
  } catch (error) {
    return res.json({ status: 'error', error: "Count docs failed " + error })
  }
  res.json({ status: 'ok', ref: planningID })
});

// ---- GET ROUTE TO DOCUMENT UPLOAD PAGE ----
router.get('/applicationupload', isAuth, (req, res) => {
  const name = req.query.ref;
  var modelsuccess = req.query.modelsuccess; // NEEDED TO ESTABLISH WHETHER A SUCCESSFUL UPLOAD MESSAGE SHOULD BE SHOWN ON THE DOCUMENT PAGE
  res.render('../views/applicationupload', { user: req.user, ref: name, modelsuccess: modelsuccess })
})

// ---- GET ROUTE TO MODEL UPLOAD PAGE ----
router.get('/modelupload', isAuth, (req, res) => {
  const name = req.query.ref;
  res.render('../views/modelupload', { user: req.user, ref: name })
})

// ---- POST ROUTE FOR DOCUMENT UPLOAD ----
router.post('/applicationupload', isAuth, (req, res) => {
  try {
    //CHECK IF ANY FILES INCLUDED
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let length = parseInt(req.body.count);
      //FOR EVERY FILE, LOOP THROUGH AND EXTRACT FILE WITH APPROPRIATE NAME
      for (let i = 0; i < length; i++) {
        let document = req.files["documentinput" + i];

        //CREATE UNIQUE FILENAME - CODE COURTESY OF VisioN & PedroZorus: https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
        const uid = uuidv4(document.name);
        const ext = document.name.slice((Math.max(0, document.name.lastIndexOf(".")) || Infinity) + 1); 

        //MOVE FILE TO UPLOADS FOLDER
        document.mv('./uploads/' + uid + "." + ext);

        data = {
          name: document.name,
          mimetype: document.mimetype,
          size: document.size
        };

        //SAVE PATH AND FILENAME TO DATABASE
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
      //REDIRECT ON SUCCESS TO APPLICATION DETAIL PAGE
      var string = encodeURIComponent(req.body.planningID);
      res.redirect('../viewApplications/viewportal?planningID=' + string);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// ---- POST ROUTE FOR MODEL UPLOAD ----
router.post('/modelupload', isAuth, async (req, res) => {
  try {
    //CHECK IF ANY FILES INCLUDED
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let length = parseInt(req.body.count);
      //FOR EVERY FILE, LOOP THROUGH AND EXTRACT FILE WITH APPROPRIATE NAME
      for (let i = 0; i < length; i++) {
        let document = req.files["modelInput" + i];

   //CREATE UNIQUE FILENAME - CODE COURTESY OF VisioN & PedroZorus: https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
        const uid = uuidv4(document.name);
        const ext = document.name.slice((Math.max(0, document.name.lastIndexOf(".")) || Infinity) + 1);

        if (ext.toLowerCase() !== "obj" &&
          ext.toLowerCase() !== "mtl" &&
          ext.toLowerCase() !== "gltf" &&
          ext.toLowerCase() !== "3ds" &&
          ext.toLowerCase() !== "stl" &&
          ext.toLowerCase() !== "ply" &&
          ext.toLowerCase() !== "glb" &&
          ext.toLowerCase() !== "3dm" &&
          ext.toLowerCase() !== "off"
        ) { return res.json({ status: 'error', error: "unsupported file format " }) }
        //MOVE FILE TO UPLOADS FOLDER
        document.mv('./models/' + uid + "." + ext);

        data = {
          name: document.name,
          mimetype: document.mimetype,
          size: document.size
        };

        //SAVE PATH AND FILENAME TO DATABASE
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
          const update = await ApplicationModel.findOne({ planningID: id })
          update.modelRequired = true;
          await update.save();

        } catch (error) {
          return res.json({ status: 'error', error: "database upload failed " + error })
        }
      }
      //REDIRECT ON SUCCESS TO APPLICATION DETAIL PAGE
      var id = encodeURIComponent(req.body.planningID);
      var modelsuccess = true;
      res.redirect(`/application/applicationupload?ref=${id}&modelsuccess=${modelsuccess}`);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


module.exports = router