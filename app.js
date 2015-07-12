var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require("express-partials")
var methodOverride = require("method-override");
var session = require("express-session");

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Se usa el el MW del paquete partials
app.use(partials());    

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinamicos:
app.use(function(req, res, next){
    
    // guardar path en session.redir para después del login
    if (!req.path.match(/\/login|\/logout|.css/)) {
        req.session.redir = req.path;
    }

    next();
    
});

app.use(function (req, res, next){
  
   var redirige = false;
   if (!req.path.match(/\/login/)) {    
       if (req.session.user && req.session.lastAccess) {
           var actual = new Date();
           if  (actual.getTime() - req.session.lastAccess > 2 * 60 * 1000) {
               // Se destruye la sesión  y se redirige
               delete req.session.user;
               delete req.session.lastAccess;
               redirige = true;
           } else {
               // Se actualiza
               req.session.lastAccess = actual.getTime();
           }
        } else if (req.session.user){
            req.session.lastAccess = new Date().getTime();
        } 
    } 
    
    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    
    // Si hay que hacer uan redirección se hace
    if (redirige) {
        res.render('sessions/new', {errors : []});
        
        // Se fuerza el retorno para no volver a escribir las cabeceras
        return;
    }
    
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors : []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
