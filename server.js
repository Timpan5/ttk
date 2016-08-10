var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var path = require('path');
var pg = require('pg');

//Connect to PSQL database and establish client pool
const Pool = require('pg-pool');
var pgConfig = process.env.DATABASE_URL.split(":");
const config = {
	user: pgConfig[1].substr(2),
	password: pgConfig[2].split("@")[0],
	host: pgConfig[2].split("@")[1],
	port: pgConfig[3].split("/")[0],
	database: pgConfig[3].split("/")[1],
	ssl: true
};
var pool = new Pool(config);

var app = express();

var port = process.env.PORT || 5000;
var server = app.listen(port, function () {
	console.log("Listening: " + server.address().port);
	
	console.log(process.env.DATABASE_URL);

pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\'', function(err, result) {
				console.log(result);
			});


	
});

app.get('/', function (req, res) {
   res.send(process.env.DATABASE_URL);
})


