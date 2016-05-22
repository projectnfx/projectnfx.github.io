var express = require('express');
var routes = require('./controllers/routes.js');

var app = express();
routes.setup(express, app);
var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('bit-stream listening at http://%s:%s', host, port);
});
