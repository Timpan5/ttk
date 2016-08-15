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

app.use(express.static("/"));

var port = process.env.PORT || 5000;
var server = app.listen(port, function () {
	console.log("Listening: " + server.address().port);



	
});


app.get('/', function (req, res) {
   res.send(process.env.DATABASE_URL);
})



function getNpcStats(id, title, page) {
	rr({url : page}, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			$ = cheerio.load(body);

			$("table table").each(function() {
				var row = $('tr', this).text();
				
				if (row.indexOf("Combat info") != -1) {
					
					console.log(id + " " + title);
					
					var hp = row.match(/(Hitpoints)[\s]*[\d]*/g);
					var maxHp = 0;
					if (hp[0].match(/([\d]+)/) != null)
						maxHp = hp[0].match(/([\d]+)/)[0];
					
					var base = row.match(/(Combat stats[\s\S]*Aggressive stats)/g);
					var baseStats = base[0].match(/([^a-zA-Z \n]*)/g);
					
					var offense = row.match(/(Aggressive stats[\s\S]*Defensive stats)/g);
					var offenseStats = offense[0].match(/([^a-zA-Z \n]*)/g);
					
					var defense = row.match(/(Defensive stats[\s\S]*Other bonuses)/g);
					var defenseStats = defense[0].match(/([^a-zA-Z \n]*)/g);
					
					//hardcoded table name
					pool.query('INSERT INTO npc VALUES ($1, $2, $3, $4, $5, $6)', [id, title, maxHp, npcStats(baseStats), npcStats(offenseStats), npcStats(defenseStats)], function(err) {});
				}
			});
		};
	});
}

function npcStats(stats) {
	var len = stats.length;
	
	for (i = 0; i < len; i++)
		if (stats[i] != "")
			stats.push(stats[i].replace(/\s+/g, ''));
	
	stats.splice(0, len);
	
	if (stats[stats.length - 1] == "") {
		stats.pop();
	}
	
	return stats;
}

function maxHit() {
	var visible = 118;
	var prayer = 1.23;
	var step1 = Math.floor(visible * prayer);
	var stance = 3;
	var step2 = step1 + stance + 8;
	var v = 1;
	var A = Math.floor(step2 * v);
	
	var B = 100;
	
	var maxHitBase = Math.floor(0.5 + A * (B+64)/640);
	
	var gear = 7/6;
	var step3 = Math.floor(maxHitBase * gear);
	var special = 1;
	var step4 = Math.floor(step3 * special);
	var pvp = 1;
	var step5 = Math.floor(step4 * pvp);
	
	var weaponEffect = 1;
	var verac = 0; //ONLY on special activation
	
	var maxHit = Math.floor(step5 * weaponEffect + verac);
	
	console.log(maxHit);
}

function hitChance(rollA, rollD) {
	var chance = 0;
	if (rollA > rollD) {
		chance = 1 - (rollD + 2) / (2 * (rollA + 1));
	}
	else {
		chance = rollA / (2 * (rollD + 1));
	}
}

function maxRoll() {
	var visible = 100;
	var prayer = 1.2;
	var step1 = Math.floor(visible * prayer);
	var stance = 3;
	var step2 = step1 + stance + 8;
	var v = 1;
	var A = Math.floor(step2 * v);
	
	var B = 200;
	
	var maxRollBase = A * (B + 64);
	
	var gear = 7/6;
	var step3 = Math.floor(maxRollBase * gear);
	var special = 1;
	
	var maxRoll = Math.floor(step3 * special);
	
	console.log(maxRoll);
}

function getStats(id, title, page) {
	rr({url : page}, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			$ = cheerio.load(body);

			$("table").each(function() {
				var row = $('tr', this).text();
				
				if (row.indexOf("Attack bonus") != -1) {
					var pattern = /([\+\-]?\d+\%?)/g;
					var stats = row.substr(row.indexOf("Attack bonus")).match(pattern);
					
					var speed = 0;
					$("tr th span img", this).each(function() {
						if (this["attribs"]["alt"].match(/\d/)) {
							speed = this["attribs"]["alt"].match(/\d/)[0];
						}
					});
					
					//hardcoded table name
					pool.query('INSERT INTO shield VALUES ($1, $2, $3, $4)', [id, title, stats, speed], function(err) {console.log("ERROR " + title);});
					console.log(id);
					/*
					console.log(title);
					console.log(stats);
					console.log(speed);
					*/
					
				}
			});
		};
	});
}

	//Slot tables on wiki holds all items for slot
	//create table head(id integer, name text, stats text[], speed integer, primary key(id));
	//create table neck(id integer, name text, stats text[], speed integer, primary key(id));
	//create table cape(id integer, name text, stats text[], speed integer, primary key(id));
	//create table ammo(id integer, name text, stats text[], speed integer, primary key(id));
	//create table chest(id integer, name text, stats text[], speed integer, primary key(id));
	//create table shield(id integer, name text, stats text[], speed integer, primary key(id));
	//create table legs(id integer, name text, stats text[], speed integer, primary key(id));
	//create table hands(id integer, name text, stats text[], speed integer, primary key(id));
	//create table feet(id integer, name text, stats text[], speed integer, primary key(id));
	//create table ring(id integer, name text, stats text[], speed integer, primary key(id));

	/*
	rr({url : 'http://2007.runescape.wikia.com/api/v1/Articles/List?category=Shield+slot+items&limit=9999'}, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			
			var base = JSON.parse(body).basepath;
			for (i = 0; i < (JSON.parse(body).items).length; i++) {
				var page = base + (JSON.parse(body).items)[i]["url"];
				var id = (JSON.parse(body).items)[i]["id"];
				var title = (JSON.parse(body).items)[i]["title"];
				
				getStats(id, title, page); //hardcoded table name
			}
		}
	});
	*/

	/*
		var myVar = setInterval(function() {
		rr({url : 'http://2007.runescape.wikia.com/api/v1/Articles/List?category=Bestiary&limit=999'}, function (error, res, body) {
			if (!error && res.statusCode == 200) {
				
				var base = JSON.parse(body).basepath;
				for (i = 0; i < (JSON.parse(body).items).length; i++) {
					var page = base + (JSON.parse(body).items)[i]["url"];
					var id = (JSON.parse(body).items)[i]["id"];
					var title = (JSON.parse(body).items)[i]["title"];
					
					getNpcStats(id, title, page);

				}
			}
		});
	}, 150000);
	*/