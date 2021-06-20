const express = require('express');
const app = express();
const router = express.Router();

const path = __dirname + '/public/';
const port = 80;

app.set('view engine', 'ejs');

router.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});

router.get('/', (req, res) => {
    res.render(path + 'index')
});

router.get('/hello', function(req,res){
    res.sendFile(path + 'hello.html');
  });

  router.get('/testing', function(req,res) {
    res.send('testing works');
});

app.use(express.static(path));
app.use('/', router);
app.use(express.urlencoded({extended:true}));

app.listen(port, function () {console.log('Example app is listening on port:' + port);
})