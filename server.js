const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const { connect } = require('http2');
const favicon = require('serve-favicon');
const User = require('./model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 80;
const JWT_SECRET = 'dsfh*&^HDIYKJ*YONSusdks*(&BS%kjhlha&^&YOHJLAS(*QWY(*Qjbfkdf98y';

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
const conn = mongoose.createConnection(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

//Middleware
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));


let db;
MongoClient.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, database) => {
    if (err) throw err;
    db = database.db;
    app.listen(port, () => console.log(`App is listening on port: ${port}`));
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
app.get('/change-password', (req, res) => {
    res.render('change-password');
});

app.get('/dashboard', checkToken, (req,res) => {
        jwt.verify(req.token, JWT_SECRET, (err, authorizedData) => {
            if(err){
                //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the autorized data 
                res.json({
                    message: 'Successful log in',
                    authorizedData
                });
                res.render('dashboard');
            }
        })
    });


app.get('/application', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            res.render('application', { files: false });
        } else {
            files.map(file => {
                if (file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
                    file.isImage = true;
                } else {
                    file.isImage = false;
                }
            });
            res.render('application', { files: files });
        }
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/application')
});

// GET /files/:
// Displays all files in json
app.get('/files', (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
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
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if files
        if (!file || file.length === 0) {
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
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if files
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exist'
            });
        }
        // Check if image
        if (file.contentType === 'image/jpeg' || file.contentType === 'img/png') {
            // Read output to browser
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({ err: 'Not an Image' })
        }
    });
});

//route DELETE/files/:id
// Delete file
app.delete('/files/:id', (req, res) => {
    gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        res.redirect('/application');
    });
});

app.post('/register', async (req, res) => {
    const { username, password: plainTextPassword, first, last, number, street1, street2, town, county, postcode } = req.body

    if (!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username' })
    }
    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }
    if (plainTextPassword.length < 8) {
        return res.json({ status: 'error', error: 'Password must be at least 8 characters long' })
    }
    if (plainTextPassword === 'password' || plainTextPassword === '12345678') {
        return res.json({ status: 'error', error: "Please try a more secure password." })
    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        await User.create({
            username, password, first, last, number, street1, street2, town, county, postcode
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'username is already in use' })
        }
        throw error
    }
    res.json({ status: 'ok' })
});


// check for username & password combination
app.post('/processlogin', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean(); //lean strips much of the mongoose detail out of the response

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password' });
    }

    if (await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user._id, username: user.username}, JWT_SECRET);
        res.json({ status: 'ok', data: token });
    } else {
    res.json({ status: 'error', error: 'Invalid username/password' });
    }
});

app.post('/change-password', async (req, res) => {
    const { token, newpassword:plainTextPassword } = req.body;

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password' })
    }
    if (plainTextPassword.length < 8) {
        return res.json({ status: 'error', error: 'Password must be at least 8 characters long' })
    }
    if (plainTextPassword === 'password' || plainTextPassword === '12345678') {
        return res.json({ status: 'error', error: "Please try a more secure password." })
    }


    try {
        const user = jwt.verify(token, JWT_SECRET)
        const _id = user.id;
        const password = await bcrypt.hash(plainTextPassword,10);
        await User.updateOne(
            { _id }, {
                $set: { password: password }
        }
        )
        res.json({status: 'ok'})

    } catch (error) {
        res.json({ status: 'error', error: 'Authenication failure' })
    }
});


//route@profile
// check for logged in status
app.get('/profile', (req, res) => {
    if (!req.session.loggedin) { res.redirect('/login'); return; }

    const username = req.query.username;

    db.collection('users').findOne({ "login.username": username }, (err, result) => {
        if (err) throw err;

        res.render('/pages/profile', { user: result })

    });
});

app.get('/dashboard', function (req, res) {
    //if the user is not logged in redirect them to the login page
    if (!req.session.loggedin) { res.redirect('/login'); return; }

    const username = req.query.username;

    db.users.findOne({
        "login.username": username
    }, function (err, result) {
        if (err) throw err;

        res.render('dashboard', {
            user: result
        })
    });

});

app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});
