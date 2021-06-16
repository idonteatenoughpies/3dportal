const express = require('express');
const app = express();

const http = require ('http');
var knockknock = require ('knock-knock-jokes');

const path = require('path');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.send("Hello World! by express");
});

app.get('/test', (req, res) => {
    res.send("This is route 2");
});

app.use ((req, res, next) => {
    res.sendFile('404.html', {root : path.join(__dirname, '/public')});
});

app.listen(80, () => console.log('Example app is listening on port 80.'));