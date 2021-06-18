const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/public/';
const port = 80;

const http = require ('http');
var knockknock = require ('knock-knock-jokes');

router.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', (req, res) => {
    res.sendFile(path + 'index.html')
});

router.get('/hello', function(req,res){
    res.sendFile(path + 'hello.html');
  });

router.get('/testing', function(req,res) {
    res.send('testing works');
});

router.get('/joke', (req, res) =>{
    res.writeHead(200, {'Content-Type':'text/html'});
    const randomJoke = knockknock()
    res.end(randomJoke);
});

router.get('/getform', (req, res) => {
    console.log('reached here');
    var name = req.query.name;
    var quest = req.query.quest;
    res.send("Hi " + name + " I am sure you will " + quest);
});

    
app.post('/postform', (req,res) => {
    const name = req.body.name;
    const quest = req.body.quest;
    res.send('Hi ' + name + " I am sure you will " + quest);
    });

app.use(express.static(path));
app.use('/', router);
app.use(express.urlencoded({extended:true}));

app.listen(port, function () {console.log('Example app is listening on port:' + port);
})