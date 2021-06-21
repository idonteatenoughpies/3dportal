const express = require('express');
const app = express();
const db = require('./db');

const path = __dirname + '/public/';
const port = 80;

app.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});

app.set('view engine', 'ejs');
app.use(express.static(path));

app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.get('/application', (req, res) => {
    res.render('application');
});

app.listen(port,  () => console.log(`App is listening on port: ${port}`));
