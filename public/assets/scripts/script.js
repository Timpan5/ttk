//Datalist constants
//Section id, list id, server url, dbURL
const slotNames = [
	["W", "wep", "wList", "wepMeleeList", "stats\/wep\/melee"],
	["H", "head", "hList", "headList", "stats\/armor\/head"],
	["C", "cape", "cList", "capeList", "stats\/armor\/cape"],
	["N", "neck", "nList", "neckList", "stats\/armor\/neck"],
	["A", "ammo", "aList", "ammoList", "stats\/wep\/ammo"],
	["Ch", "chest", "chList", "chestList", "stats\/armor\/chest"],
	["S", "shield", "sList", "shieldList", "stats\/armor\/shield"],
	["L", "legs", "lList", "legsList", "stats\/armor\/legs"],
	["Ha", "hands", "haList", "handsList", "stats\/armor\/hands"],
	["F", "feet", "fList", "feetList", "stats\/armor\/feet"],
	["R", "ring", "rList", "ringList", "stats\/armor\/ring"],
];

function loadEquipmentSlots() {
	slotNames.forEach(function(item){
		makeSlot(item[0], item[1], item[2], item[4]);
		loadDatalist(item[2], item[3]);
	});
}

function makeSlot(symbol, shortName, datalist, url) {
	var $tr = $("<tr>").attr("id", shortName);
	var $symbol = $("<td>").html(symbol);
	var $name = $("<td>").append($("<input>").attr({"class" : "name", "list" : datalist}));
	var $ticks = $("<td>").append($("<input>").addClass("ticks"));
	var $str = $("<td>").append($("<input>").addClass("str"));
	var $r = $("<td>").append($("<input>").addClass("r"));
	var $m = $("<td>").append($("<input>").addClass("m"));
	var $st = $("<td>").append($("<input>").addClass("st"));
	var $sl = $("<td>").append($("<input>").addClass("sl"));
	var $cr = $("<td>").append($("<input>").addClass("cr"));
	var $ma = $("<td>").append($("<input>").addClass("ma"));
	var $ra = $("<td>").append($("<input>").addClass("ra"));

	$name.find(".name").change(function() {
		ajaxStats($tr, url);
	}); 
	
	$tr.append($symbol, $name, $ticks, $str, $r, $m, $st, $sl, $cr, $ma, $ra);
	$("#equipment").append($tr); //hardcoded table id
}

function loadDatalist(listName, url) {
	var $datalist = $("<datalist>");
	$datalist.attr("id", listName);
	$("body").append($datalist);
	
	$.ajax({
        url: url, 
        method: "GET",
        dataType: "json"
    })
    .done(function(jsondata){
		var data = jsondata.data;
		
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			$option.text(data[i].name).val(data[i].name);
			$datalist.append($option);
		}
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}

function ajaxStats($piece, url) {
	var load = {"name" : $piece.find(".name").val()};
	$.ajax({
		url: url,
		method: "POST",
		data: load,
		dataType: "json"
	})
	.done(function(jsondata){
		var data = jsondata.data[0];
		var speed = data.speed;
		var ticks = 10 - speed;
		var stats = data.stats;
		
		$piece.find(".ticks").val(ticks);
		$piece.find(".str").val(stats[10]);
		$piece.find(".r").val(stats[11]);
		$piece.find(".m").val(stats[12]);
		$piece.find(".st").val(stats[0]);
		$piece.find(".sl").val(stats[1]);
		$piece.find(".cr").val(stats[2]);
		$piece.find(".ma").val(stats[3]);
		$piece.find(".ra").val(stats[4]);
	})
	.fail(function(jqXHR, textStatus, errorThrown){
		alert("Request failed: " + errorThrown);
	});
}