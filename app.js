var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



// Database
var mongo = require('mongodb');
var monk = require('monk');
//var db = monk('localhost:27017/TechnoparkDB');
var db = monk('mongodb://wajdi:wajdi97347426@ds133328.mlab.com:33328/technoparkdb');

//routes
var routes = require('./routes/index');
var users = require('./routes/car');
var log = require('./routes/login');
var home = require('./routes/home');
var register= require('./routes/register');
var async= require('./routes/async');
var control= require('./routes/control');

//resultat de l'autorisation
var resultat="";




var app = express();
server = require('http').createServer(app)
io = require('socket.io').listen(server)
/*app.post('/register', function (req, res) {    
    //console.log(res.params) //Look at the POST params
    

});*/

// Websocket
io.sockets.on('connection', function (socket) {
    console.log('done');
    //Here I want get the data
    io.sockets.on('param', function (data){
        console.log(data);
    });
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configuration ===============================================================
app.use(passport.initialize());
require('./config/passport')(passport); // pass passport for configuration
require('./app/routes')(app, passport); // load our routes and pass in our app and fully configured passport


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});




app.use('/', routes);
app.use('/users', users);
app.use('/login', log);
app.use('/register', register  );
app.use('/', home);
app.use('/',async);
app.use('/control',control);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());



// routes ======================================================================
// mongoose
//mongoose.connect('mongodb://localhost/passport');
mongoose.connect('mongodb://wajdi:wajdi97347426@ds133438.mlab.com:33438/passport1');



module.exports = app;
