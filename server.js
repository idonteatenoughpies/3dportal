const express = require('express');
const app = express();
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/star_wars_quotes";

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

var db;
    MongoClient.connect(url, function(err, database){
      if(err) throw err;
      db = database;
    });

    app.get('/all', function(req, res) {
        db.collection('quotes').find().toArray(function(err, result) {
          if (err) throw err;
          var output = "<h1>All the quotes</h1>";
          for (var i = 0; i < result.length; i++) {
            output += "<div>"
            output += "<h3>" + result[i].name + "</h3>"
            output += "<p>" + result[i].quote + "</p>"
            output += "</div>"
      }
          res.send(output);
        });
      });
      

app.use(express.static(path));
app.use('/', router);
app.use(express.urlencoded({extended:true}));

app.listen(port, function () {console.log('Example app is listening on port:' + port);
})