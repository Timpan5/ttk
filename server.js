var http = require("http");
var https = require("https");
var fs = require("fs");
var url = require("url");
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var pg = require("pg");
var cheerio = require("cheerio");
var cheerioTableparser = require('cheerio-tableparser');
var rr = require("request");

//Connect to PSQL database and establish client pool
//URL gets reset when powershell closes
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 
app.use(express.static(path.join(__dirname, "public")));

var port = process.env.PORT || 5000;
var server = app.listen(port, function () {
	console.log("Listening: " + server.address().port);
});

//Names of tables holding items in PSQL database
const dbTableName = {
	"wepMelee" : "weapons_melee",
	"head" : "head",
	"cape" : "cape",
	"neck" : "neck",
	"ammo" : "ammo",
	"chest" : "chest",
	"shield" : "shield",
	"legs" : "legs",
	"hands" : "hands",
	"feet" : "feet",
	"ring" : "ring",
};

app.get(/(List)/, function (req, res) { 
	var base = req.path;
	var item = base.split("\/");
	var end = base.indexOf("List");
	
	if (end > 0 && item.length == 2) {
		var target = base.substring(1,end);
		sendList(res, getListQuery(dbTableName[target]));
	}
	else if (end > 0 && item.length == 3) {
		var target = base.substring(1,end);
		var name = decodeURIComponent(item[2]);
		sendStats(name, res, getItemQuery(dbTableName[target]));
	}
	else {
		console.log("List failed");
		res.status(400).send("List failed");
	}	
});

app.get(/(prayer)/, function (req, res) { 
	var base = req.path;
	var item = base.split("\/");
	
	if (item.length == 2) {
		//sendlist
	}
	else if (item.length == 3) {
		var name = decodeURIComponent(item[2]);
		var query = "SELECT * FROM prayer WHERE style=$1";
		
		pool.query(query, [name], function(err, result) {
			var jsonObj = {"data" : result.rows};
			if (!result.rows.length) {
				res.statusMessage = "Item not found";
				res.status(400).end();
			}
			else {
				res.send(jsonObj);
			}
		});
		
	}
	else {
		console.log("List failed");
		res.status(400).send("List failed");
	}	
});

app.get(/(potion)/, function (req, res) { 
	var base = req.path;
	var item = base.split("\/");
	
	if (item.length == 2) {
		//sendlist
	}
	else if (item.length == 3) {
		var name = decodeURIComponent(item[2]);
		var query = "SELECT * FROM potion WHERE style=$1 ORDER BY percentage ASC";
		
		pool.query(query, [name], function(err, result) {
			var jsonObj = {"data" : result.rows};
			if (!result.rows.length) {
				res.statusMessage = "Item not found";
				res.status(400).end();
			}
			else {
				res.send(jsonObj);
			}
		});
		
	}
	else {
		console.log("List failed");
		res.status(400).send("List failed");
	}	
});

app.post("/calculate/roll/melee", function (req, res) {
	var input = req.body;
	console.log(input);
	
	var roll = maxRoll(parseInt(input.visible), parseFloat(input.pAcc), parseInt(input.style), parseFloat(input.v), parseInt(input.bonus), parseFloat(input.gear));
	res.send({roll});
});

app.post("/calculate/hit/melee", function (req, res) {
	var input = req.body;
	console.log(input);
	var hit = maxHit(parseInt(input.visible), parseFloat(input.pStr), parseInt(input.style), parseFloat(input.v), parseInt(input.bonus), parseFloat(input.gear));
	res.send({hit});
});

app.post("/calculate/hit/range", function (req, res) {
	var input = req.body;
	console.log(input);
	var hit = maxHitRange(parseInt(input.visible), parseFloat(input.pStr), parseInt(input.style), parseFloat(input.v), parseInt(input.bonus), parseFloat(input.gear));
	res.send({hit});
});

app.get(/(npc)/, function(req, res) {
	var base = req.path;
	var item = base.split("\/");
	var query;
	
	if (item.length == 2) {
		query = "SELECT name FROM npc";
		pool.query(query, function(err, result) {
			var jsonObj = {"data" : result.rows};
			if (!result.rows.length) {
				res.statusMessage = "Item not found";
				res.status(400).end();
			}
			else {
				res.send(jsonObj);
			}
		});
	}
	else if (item.length == 3) {
		var name = decodeURIComponent(item[2]);
		var query = "SELECT * FROM npc WHERE name=$1";
		var queryName = "npc_name";
		
		pool.query({name : queryName, text : query, values : [name]}, function(err, result) {
			var jsonObj = {"data" : result.rows};
			if (!result.rows.length) {
				res.statusMessage = "Item not found";
				res.status(400).end();
			}
			else {
				res.send(jsonObj);
				//console.log(jsonObj.data);
			}
		});
		
	}
	else {
		console.log("NPC failed");
		res.status(400).send("NPC failed");
	}	

	
});

app.post("/calculate/chance", function (req, res) {
	var input = req.body;
	console.log(input);
	var chance = hitChance(parseInt(input.A), parseInt(input.B));
	console.log(chance);
	res.send({chance});
});

app.get("/spells", function(req, res) {
		var query = "SELECT * FROM spell";
		
		pool.query(query, function(err, result) {
			var jsonObj = {"data" : result.rows};
			if (!result.rows.length) {
				res.statusMessage = "Item not found";
				res.status(400).end();
			}
			else {
				res.send(jsonObj);
			}
		});
});


app.get("*", function(req, res) {
	console.log("*: " + req.path);
});

function getItemQuery(tableName) {
	return "SELECT * FROM " + tableName + " WHERE name=$1";
}

function getListQuery(tableName) {
	return "SELECT name FROM " + tableName + " ORDER BY name ASC";
}

function sendList(res, query) {
	pool.query(query, function(err, result) {
		var jsonObj = {"data" : result.rows};
		res.send(jsonObj);
	});
}

function sendStats(name, res, query) {
	if (/[^a-z\s\d\(\)']/gi.test(name)) { 
		res.status(400).send("Invalid item name");
	}
	
	else {
		pool.query(query, [name], function(err, result) {
			var jsonObj = {"data" : result.rows};
			if (!result.rows.length) {
				res.statusMessage = "Item not found";
				res.status(400).end();
			}
			else {
				res.send(jsonObj);
			}
		});
	}
}

function getNpcStats(id, title, page) {
	rr({url : page}, function (error, res, body) {
		if (!error && res.statusCode == 200) {
			$ = cheerio.load(body);

			$("table table").each(function() {
				var row = $("tr", this).text();
				
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

function maxHit(visible, prayer, stance, v, B, gear) {
	var step1 = Math.floor(visible * prayer);
	var step2 = step1 + stance + 8;
	var A = Math.floor(step2 * v);

	var maxHitBase = Math.floor(0.5 + A * (B+64)/640);
	var step3 = Math.floor(maxHitBase * gear);
	
	var special = 1;
	var step4 = Math.floor(step3 * special);
	
	var pvp = 1;
	var step5 = Math.floor(step4 * pvp);
	
	var weaponEffect = 1;
	var maxHit = Math.floor(step5 * weaponEffect);
	
	return maxHit;
}

function maxHitRange(visible, prayer, stance, v, B, gear) {
	var step1 = Math.floor(visible * prayer);
	var step2 = step1 + stance + 8;
	var A = Math.floor(Math.floor(step2 * v) * v);

	var maxHitBase = Math.floor(0.5 + A * (B+64)/640);
	var step3 = Math.floor(maxHitBase * gear);
	
	var special = 1;
	var step4 = Math.floor(step3 * special);
	
	var pvp = 1;
	var step5 = Math.floor(step4 * pvp);
	
	var weaponEffect = 1;
	var maxHit = Math.floor(step5 * weaponEffect);
	
	return maxHit;
}

function hitChance(rollA, rollD) {
	var chance = 0;
	if (rollA > rollD) {
		chance = 1 - (rollD + 2) / (2 * (rollA + 1));
	}
	else {
		chance = rollA / (2 * (rollD + 1));
	}
	return chance;
}

function maxRoll(visible, prayer, stance, v, B, gear) {

	var step1 = Math.floor(visible * prayer); 
	var step2 = step1 + stance + 8;
	
	console.log("1: " + step2);
	
	var A = Math.floor(step2 * v);
	
	var maxRollBase = A * (B + 64);
	
	console.log("2: " + maxRollBase);
	
	var step3 = Math.floor(maxRollBase * gear);
	var special = 1; //weapon
	
	var maxRoll = Math.floor(step3 * special);
	
	console.log("3: " + maxRoll);
	return maxRoll;
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
					pool.query('INSERT INTO weapons_melee VALUES ($1, $2, $3, $4)', [id, title, stats, speed], function(err) {console.log("ERROR " + title);});
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
	rr({url : 'http://2007.runescape.wikia.com/api/v1/Articles/List?category=Magic+weapons&limit=9999'}, function (error, res, body) {
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