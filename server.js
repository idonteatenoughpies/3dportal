const express = require('express');
const path = require('path');
const crypto = require ('crypto');
const mongoose = require ('mongoose');
const multer = require ('multer');
const {GridFsStorage} = require ('multer-gridfs-storage');
const Grid = require ('gridfs-stream');
const methodOverride = require ('method-override');
const bodyParser = require ('body-parser');
const { connect } = require('http2');

const app = express();
const port = 80;


//create mongo connection
const MONGO_USERNAME = 'astruthers';
const MONGO_PASSWORD = '3dportal';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = '3dportal';

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const conn = mongoose.createConnection(mongoURL);

//Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
//app.use(express.static(path));
app.use(express.urlencoded({extended:true}));

//Initialise the stream
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

//Create storage engine
const storage = new GridFsStorage({
    url: mongoURL,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });
 
//const path = __dirname + '/public/';

/*
app.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});
*/

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/application', (req, res) => {
    res.render('application');
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/application') 
});

// GET /files/:
// Displays all files in json
app.get('/files', (req, res) => {
gfs.files.find().toArray((err, files) =>{
// Check if files
if(!files || files.length === 0) {
    return res.status(404).json({
        err: 'No files exist'
    });
}
// Files exist
return res.json(files);
});
});


// GET /files/:filename
// Displays all files in json
app.get('/files/"filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
// Check if files
if(!file || file.length === 0) {
    return res.status(404).json({
        err: 'No file exist'
    });
}
// File exists
return res.json(file);
    });
});
    

app.listen(port,  () => console.log(`App is listening on port: ${port}`));
