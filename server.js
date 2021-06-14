const express = require('express');
const app = express();

const http = require ('http');
var knockknock = require ('knock-knock-jokes');


app.get('/', (req, res) => {
    res.send("Hello World! by express");
});

app.get('/test', (req, res) =>{
    res.send("This is route 2");
});

app.get('/joke', (req, res) =>{
    res.writeHead(200, {'Content-Type':'text/html'});
    const randomJoke = knockknock()
    res.end(randomJoke);
});

app.listen(8080);