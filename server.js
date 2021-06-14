const express = require('express');
const app = express();

app.get('/', function (req,res){
    res.send("Hello World! by express");
});

app.get('/test', function (req,res){
    res.send("This is route 2");
});

app.listen(8080);