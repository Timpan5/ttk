var http = require('http');
var https = require("https");
var fs = require('fs');
var url = require('url');
var express = require('express');
var path = require('path');
var pg = require('pg');
var cheerio = require("cheerio");
var cheerioTableparser = require('cheerio-tableparser');
var rr = require("request");

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


	rr({url : 'http://2007.runescape.wikia.com/api/v1/Articles/List?category=Melee+weapons&limit=1'}, function (error, res, body) {
	if (!error && res.statusCode == 200) {
		//console.log(JSON.parse(body));
		
		var base = JSON.parse(body).basepath;
		
		for (i = 0; i < (JSON.parse(body).items).length; i++) {
			var page = base + (JSON.parse(body).items)[i]["url"];
			var id = (JSON.parse(body).items)[i]["id"];
			var title = (JSON.parse(body).items)[i]["title"];
			
			getWStats(id, title, page);
			
		}
	}
});



});

app.get('/', function (req, res) {
   res.send(process.env.DATABASE_URL);
})


function getWStats(id, title, page) {
	rr({url : page}, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			$ = cheerio.load(body);

			$("table").each(function() {
				var row = $('tr', this).text();
				
				if (row.indexOf("Attack bonus") != -1) {
					var pattern = /([\+\-]?\d+\%?)/g;
					var stats = row.substr(row.indexOf("Attack bonus")).match(pattern);
					
					var speed = "";
					$("tr th span img", this).each(function() {
						if (this["attribs"]["alt"].match(/\d/)) {
							speed = this["attribs"]["alt"].match(/\d/)[0];
						}
					});
					
					console.log(id);
					console.log(title);
					console.log(stats);
					console.log(speed);
				}
			});
		};
	});
}
