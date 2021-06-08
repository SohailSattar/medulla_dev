var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var swaggerUi = require('swagger-ui-express');
var swaggerDocument = require('./swagger.json');
var bodyParser = require('body-parser')

const index =  require('./routes');
var models = require('./models');

var app = express();

app.use(cors());
global.db = models;
global._ = require('lodash');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(cors());
app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
require('./config/passport');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(__dirname + '/files'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/', express.static(path.join(__dirname, '/')));

app.use('/api/v1/', index);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({"error":err})
  //res.render('error');
});

module.exports = app;
