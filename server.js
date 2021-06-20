const express = require('express');
const app = express();
//const router = express.Router();

const path = __dirname + '/public/';
const port = 80;

app.use (function (req,res,next) {
    console.log('/' + req.method);
    next();
});

app.set('view engine', 'ejs');
app.use(express.static(path));
//app.use('/', router);
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.render('index');
});

/*router.get('/hello', function(req,res){
    res.sendFile(path + 'hello.html');
  });

  router.get('/testing', function(req,res) {
    res.send('testing works');
});
*/



app.listen(port, function () {console.log('Example app is listening on port:' + port);
})