const express = require('express');
const app = express();

const path = __dirname + '/public/';
const port = 80;

app.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path));

app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/registration', (req, res) => {
    res.render('registration');
});

app.listen(port, function () {console.log('Example app is listening on port:' + port);
})