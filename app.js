//RESHWAP SERVER

//all requires
var express = require("express");//basic app functioning
const mongoose = require("mongoose");//for database management
var morgan = require("morgan");//potentially useless
var upload = require("express-fileupload");//for image uploading
var busboy = require('connect-busboy');//for image uploading
var bodyParser = require("body-parser");//to read information from forms
var cookieParser = require("cookie-parser");//to read information from cookies
var session = require('express-session');//to store information between links from user
var MongoStore = require('connect-mongo')(session);
var mongoStore = new MongoStore({url: 'mongodb://localhost/reshwap'});
//passport requires
var passport = require("passport");//for identification
var flash = require("connect-flash");//for sending messages between pages

//database stuff, must come before routes
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/reshwap", {
  useMongoClient: true
});
//configures passport to authenticate login attempts
require("./config/passport.js")(passport);

//first major step in setting up app
var app = express();

//*****these activate require files
app.use(busboy());//let us upload files
app.use(upload());//let us upload files
app.use(morgan('dev'));
app.use( cookieParser());
//to read forms
var urlencoderParser = bodyParser.urlencoded({extended:false});//let us read forms
app.use(urlencoderParser);
app.use(session({//set up session to our specifications
  secret: 'secret',
  store: mongoStore,
  saveUninitialized: true,
  resave: true,
  cookie : { secure : false, maxAge : (2 * 60 * 60 * 1000) }
}));//for authenticating users
app.use(passport.initialize());//starts passport
app.use(passport.session());//allows authentication info to pass between pages
app.use(flash());

app.set("view engine", "ejs");
//*****end of activate require files

app.use(express.static(__dirname+"/public"));//make public files static
app.use(express.static(__dirname+"/userImages"));//make public files static

//define routes for user:
var routes = require("./routes/routes.js");//passes app and passport through;
app.use("/", routes);

//404 page
app.use(function(req, res){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url});
    return;
  }

});

//app begins
app.listen(5000);

console.log("*****MJG*****");
console.log("Reshwap is online");
console.log("*****MJG*****");
