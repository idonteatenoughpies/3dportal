const express = require('express');
const app = express();

const http = require ('http');
var knockknock = require ('knock-knock-jokes');

const path = require('path');

app.set('port', (process.nextTick.PORT || 80))
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.sendFile('index.html', {root : path.join(__dirname, '/public')});
});

app.get('/joke', (req, res) =>{
    res.writeHead(200, {'Content-Type':'text/html'});
    const randomJoke = knockknock()
    res.end(randomJoke);
});

app.get('/getform', (req, res) => {
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

app.listen(app.get('port'), function () {console.log('Example app is listening on port:' + app.get('port'));
})