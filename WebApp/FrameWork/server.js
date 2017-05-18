var path = require('path');
var express = require("express");
var request = require('request');
var qs = require('querystring');
var async = require('async');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var logger = require('morgan');
var config = require('./config');
var argv = require('yargs').argv;

var app = express();
var port = process.env.PORT || (argv.port || 8008);
var dir = argv.dir || '';
var assetPath = path.join(__dirname, dir);
//var PROXY_DOMAIN = 'http://imsbackend.azurewebsites.net';

GLOBAL.ROOTPATH = assetPath;

// Config
app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static(assetPath));


// Load utils
require('./server/utils');

// Initialize routes
require('./server/routes')(app);

//var dataResp = {};
//app.post('/opc', function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/html' });
//    dataResp = req.body;
//    //var obj = { 'status': true };
//    res.write(JSON.stringify(dataResp));
//    res.end();
//});
//app.get('/opc', function (req, res) {
//    res.writeHead(200, { 'Content-Type': 'text/html' });
//    res.write(JSON.stringify(dataResp));
//    res.end();
//});

//app.post('/api*', function(req, res) {
//  var url = PROXY_DOMAIN + '/api' + req.params[0];
//  if(qs.stringify(req.query) !== "") {
//    url += '?' + qs.stringify(req.query);
//  }
//
//  req.pipe(request({
//    url: url,
//    method: req.method,
//    json: req.body//,
//    //headers: req.headers
//  }, function(error, response, body) {
//    if(error && error.code === 'ECONNREFUSED') {
//      console.error('Refused connection');
//    } else {
//      throw error;
//    }
//  }), {end: false}).pipe(res);
//});
//
//app.get('/api*', function(req, res) {
//  var url = PROXY_DOMAIN + '/api' + req.params[0];
//  if(qs.stringify(req.query) !== "") {
//    url += '?' + qs.stringify(req.query);
//  }
//
//  req.pipe(request({
//    url: url,
//    method: req.method,
//    json: req.body//,
//    //headers: req.headers
//  }, function(error, response, body) {
//    if(error && error.code === 'ECONNREFUSED') {
//      console.error('Refused connection');
//    } else {
//      throw error;
//    }
//  }), {end: false}).pipe(res);
//});

app.get('/', function (req, res){
  res.sendFile("index.html");
});

app.listen(app.get('port'), function (){
  console.log('Express server listening on port ' + app.get('port'));
});

process.on('uncaughtException', function (err){
  if (err) {
    console.error('uncaughtException: ' + err.message);
    console.error(err.stack);
    //process.exit(1);             // exit with error
  }
});
