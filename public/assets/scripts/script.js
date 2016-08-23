//Datalist constants
const dbList = [
	["wList", "wepList"],
	["hList", "headList"],
];

function loadInputList() {
	dbList.forEach(function(item){
		loadDatalist(item[0], item[1]);
	});
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
$(function() {
	
	$("#wep").find(".name").change(function() {
		ajaxStats($("#wep"), dbURL.wepMelee);
	}); 
	
	$("#head").find(".name").change(function() {
		ajaxStats($("#head"), dbURL.head);
	}); 
	
});

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

