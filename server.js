const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/public/';
const port = 80;


router.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', (req, res) => {
    res.sendFile(path + 'index.html')
});

const http = require ('http');
var knockknock = require ('knock-knock-jokes');

//const path = require('path');

//app.set('port', (process.nextTick.PORT || 80))





router.get('/joke', (req, res) =>{
    res.writeHead(200, {'Content-Type':'text/html'});
    const randomJoke = knockknock()
    res.end(randomJoke);
});

router.get('/testing', function(req,res) {
    res.writeHead(200, {'Content-Type':'text/html'});  
    res.end('testing works');
});

router.get('/hello', (req, res) => {
    res.sendFile('hello.html', {root : path.join(__dirname, '/public')});
});

router.get('/getform', (req, res) => {
    console.log('reached here');
    var name = req.query.name;
    var quest = req.query.quest;
    res.send("Hi " + name + " I am sure you will " + quest);
});

    
/*app.post('/postform', (req,res) => {
    const name = req.body.name;
    const quest = req.body.quest;
    res.send('Hi ' + name + " I am sure you will " + quest);
    });
 */   

app.use ((req, res, next) => {
    res.sendFile('404.html', {root : path.join(__dirname, '/public')});
});

app.use(express.static(path));
app.use('/', router);
app.use(express.urlencoded({extended:true}));

app.listen(port, function () {console.log('Example app is listening on port:' + port);
})