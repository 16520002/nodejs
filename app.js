var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
const flash = require('express-flash-notification');
const session = require('express-session');
const mongoose = require('mongoose');
var expressLayouts = require('express-ejs-layouts');
const pathConfigs = require('./path');
const moment = require('moment')
const passport = require('passport')



global.__base = __dirname + '/'
global.__path_app = __base + pathConfigs.folder_app

global.__configs = __path_app + pathConfigs.folder_configs
global.__shemas = __path_app + pathConfigs.folder_shemas
global.__models = __path_app + pathConfigs.folder_models
global.__helpers = __path_app + pathConfigs.folder_helpers
global.__routesbackend = __path_app + pathConfigs.folder_routes_backend
global.__routesfrontend = __path_app + pathConfigs.folder_routes_frontend
global.__views = __path_app + pathConfigs.folder_views
global.__views_backend = __path_app + pathConfigs.folder_views_backend
global.__views_frontend = __path_app + pathConfigs.folder_views_frontend
global.__public = __base + pathConfigs.folder_public
global.__uploads = __public + pathConfigs.folder_uploads
global.__middleware = __path_app + pathConfigs.folder_middleware

const systemConfig = require(__configs+'system')
const databaseConfig = require(__configs+'database')

mongoose.connect(`mongodb+srv://${databaseConfig.userName}:${databaseConfig.passWord}@cluster0.zl0pw0q.mongodb.net/`);
var db = mongoose.connection
          db.on("error", () => {console.log("Connect Err")});
          db.on("connected", () => {console.log("Connected successfully!")});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', __views_backend + '/backend');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'csjbca',
  resave: false,
  saveUninitialized: true,
  cookie:{maxAge:5*60*10000}
}))

require(__configs + 'passport')(passport)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash(app,{
    viewName:__views_backend+ '/elements/notify'
}));

// setup router
app.locals.systemConfig = systemConfig
app.locals.moment = moment;
app.use(`/${systemConfig.prefixAdmin}`, require(__routesbackend+'index'));
app.use(`/${systemConfig.prefixFrontend}`, require(__routesfrontend+'/index'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(async function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  if(systemConfig.env==='dev'){
    res.status(err.status || 500);
    res.render(__views_backend+'/pages/error', { pageTitle: 'Page Not Found' });
  }

  if(systemConfig.env==='production'){
    res.status(err.status || 500);
    const categoryServer = require(__shemas+'categories')
    const categories = await categoryServer.find({status:'active'})

    res.render( __views_frontend + '/pages/error', { 
      layout:__views_frontend+'/frontend',
      toppost:false,
      slidebar:false,
      categories,
    });


//    res.render(__views_frontend+'/pages/error', { pageTitle: 'Page Not Found' });
  }
  
});

module.exports = app;
