const express = require('express');
const db = require('./db');
const path = require('path');
const crypto = require ('crypto');
const mongoose = require ('mongoose');
const multer = require ('multer');
const GridFSStorage = require ('multer-gridfs-storage');
const Grid = require ('gridfs-stream');
const methodOverride = require ('method-override');
const bodyParser = require ('body-parser');
const { connect } = require('http2');

const app = express();
const conn = db();
const port = 80;

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
    res.json({file: req.file});
});

app.listen(port,  () => console.log(`App is listening on port: ${port}`));
