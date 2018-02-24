var express = require('express');
var port = 8888;
var app = express;
var server = require('http').createServer(app).lister(port, function () {
  console.log(`server on ${port}`);
});

app.use(static);
