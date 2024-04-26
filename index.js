let dotenv = require('dotenv');
dotenv.config();
let db = require('./config/mongoose');
let path = require('path');
let express = require('express');
const bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
let port = process.env.PORT;
let passport = require('./config/passportLocal');
let controller = require('./controller');
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',controller.auth);
app.use('/dashboard',controller.dashboard);
app.get('/*',function(req,res){
  res.redirect('/dashboard');
})
app.listen(port,()=>{
    console.log(`Server is running at PORT:${port}`);
});

module.exports = app;
