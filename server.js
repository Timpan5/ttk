var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var path = require('path');
var pg = require('pg');
const Pool = require('pg-pool');

var app = express();

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
	console.log(server.address().port);
	console.log(process.env.PORT);
	console.log(process.env.DATABASE_URL);
});

app.get('/', function (req, res) {
   res.send('Hello World');
})