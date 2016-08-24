//Datalist constants
//Section id, list id, server url
const slotNames = [
	["W", "wep", "wList", "wepList"],
	["H", "head", "hList", "headList"],
];

function loadEquipmentSlots() {
	slotNames.forEach(function(item){
		makeSlot(item[0], item[1], item[2]);
		loadDatalist(item[2], item[3]);
	});
	detectItem();
}

function makeSlot(symbol, shortName, datalist) {
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



const dbURL = {
	"wepMelee" : "stats\/wep\/melee",
	"head" : "stats\/armor\/head",
};

//use $target.change() to trigger manually
function detectItem() {
	
	$("#wep").find(".name").change(function() {
		ajaxStats($("#wep"), dbURL.wepMelee);
	}); 
	
	$("#head").find(".name").change(function() {
		ajaxStats($("#head"), dbURL.head);
	}); 
};

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

