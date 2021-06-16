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

app.get('/joke', (req, res) =>{
    res.writeHead(200, {'Content-Type':'text/html'});
    const randomJoke = knockknock()
    res.end(randomJoke);
});

app.get('/add', (req, res) => {
    const x = parseInt(req.query.x);
    const y = parseInt(req.query.y);
    res.send("X + Y= " + (x+y));
});

app.get('/calc', (req, res) => {
    const x = parseInt(req.query.x);
    const y = parseInt(req.query.y);
    var operator = (req.query.operator);
    switch(operator){
        case 'add': var operatorA = 'add';
        answer = x+y;
        break;
        case 'sub': var operatorA = 'minus';
        answer = x-y;
        break;
        case 'mul': var operatorA = 'multiplied by';
        answer = x*y;
        break;
        case 'div': var operatorA ='divided by';
        answer = x/y;
        break;
    }
    res.send("X " + operatorA + " Y= " + answer );
});

app.get('/getform', (req, res) => {
const name = req.query.name;
const quest = req.query.quest;
res.send('Hi ' + name + " I am sure you will " + quest);
});

app.post('/postform', (req,res) => {
const name = req.body.name;
const quest = req.body.quest;
res.send('Hi ' + name + " I am sure you will " + quest);
});

app.get ('/user/:userid/books/:bookid', (req, res) =>{
var userID = req.params.userid;
var bookID = req.params.bookid;
res.send ("Hi user "+ userID + ", you've checked out book number " + bookID);
});


app.use ((req, res, next) => {
    res.sendFile('404.html', {root : path.join(__dirname, '/public')});
});

app.listen(8080, () => console.log('Example app is listening on port 8080.'));