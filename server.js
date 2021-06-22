const express = require('express');
const session = require ('express-session');
const path = require('path');
const crypto = require ('crypto');
const mongoose = require ('mongoose');
const MongoClient = require('mongodb').MongoClient;
const multer = require ('multer');
const {GridFsStorage} = require ('multer-gridfs-storage');
const Grid = require ('gridfs-stream');
const methodOverride = require ('method-override');
const bodyParser = require ('body-parser');
const { connect } = require('http2');
const favicon = require ('serve-favicon');

const app = express();
const port = 80;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


//create mongo connection
const MONGO_USERNAME = 'astruthers';
const MONGO_PASSWORD = '3dportal';
const MONGO_HOSTNAME = '127.0.0.1';
const MONGO_PORT = '27017';
const MONGO_DB = '3dportal';

const mongoURL = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
const conn = mongoose.createConnection(mongoURL, { useNewUrlParser: true });

//Middleware
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(express.urlencoded({extended:true}));
app.use(session({ 
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: false,
  }));

  var db;
MongoClient.connect(mongoURL, function(err, database) {
  if (err) throw err;
  db = database;
});


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

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/application', (req, res) => {
    gfs.files.find().toArray((err, files) =>{
        // Check if files
        if(!files || files.length === 0) {
     res.render('application', {files: false});
        } else {
            files.map(file => {
                if(file.contentType === 'image/jpeg' || file.contentType === 'image png'){
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('application', {files: files});
        }
        });
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
// Displays single file object
app.get('/files/:filename', (req, res) => {
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

// GET /image/:filename
// Displays image
app.get('/image/:filename', (req, res) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
// Check if files
if(!file || file.length === 0) {
    return res.status(404).json({
        err: 'No file exist'
    });
}
// Check if image
if(file.contentType === 'image/jpeg' || file.contentType === 'img/png'){
// Read output to browser
const readstream = gfs.createReadStream(file.filename);
readstream.pipe(res);
} else {
    res.status(404).json({err: 'Not an Image'})
}
    });
});
    
//route DELETE/files/:id
// Delete file
app.delete('/files/:id', (req,res) => {
gfs.remove({_id: req.params.id, root: 'uploads'}, (err, gridStore) => {
if(err){
    return res.status(404).json({err:err});
}
res.redirect('/application');
});
});

//route@login
// check for username & password combination
app.post('/processlogin', (req,res) => {
const username = req.body.username;
const password = req.body.password;

db.collection('users').findOne({"login.username":username}, (err, result) => {
    if (err) throw err;
    if (!result){res.redirect('/login'); return}
    if(result.login.password === password){ req.session.loggedin = true; res.redirect('/dashboard')}
    else {res.redirect('/login')}
});
});

//route@profile
// check for logged in status
app.get('/profile', (req,res) => {
    if(!req.session.loggedin){res.redirect('/login'); return;}

    const username = req.query.username;

    db.collection('users').findOne({"login.username":username}, (err, result) => {
        if (err) throw err;
       
        res.render('/pages/profile', {user: result})
    
    });
    });

    app.post('/adduser', (req,res) => {
        if(!req.session.loggedin){res.redirect('/login');return;}

        const datatostore = {
            "name":{"title":req.body.title,"first":req.body.first,"last":req.body.last},
            "location":{"number":req.body.number,"street1":req.body.street1,"street2":req.body.street2,"town":req.body.town,"county":req.body.county,"postcode":req.body.postcode},
            "email":req.body.email,
            "login":{"username":req.body.username, "password":req.body.password},
        }
db.collection('users').insertOne(datatostore, (err,result) => {
    if (err) throw err;
    console.log('saved to database')
    res.redirect('/')
})
    });

    app.get('/dashboard', function(req, res) {
        //if the user is not logged in redirect them to the login page
        if(!req.session.loggedin){res.redirect('/login');return;}
      
        const username = req.query.username;

        db.collection('users').findOne({
          "login.username": username
        }, function(err, result) {
          if (err) throw err;

          res.render('dashboard', {
            user: result
          })
        });
      
      });

      app.get('/logout', function(req, res) {
        req.session.loggedin = false;
        req.session.destroy();
        res.redirect('/');
      });


app.listen(port,  () => console.log(`App is listening on port: ${port}`));
