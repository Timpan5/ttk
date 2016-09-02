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
	["R", "ring", "rList", "ringList", "stats\/armor\/ring"]
];

function loadEquipmentSlots() {
	
	slotNames.forEach(function(item){
		makeSlot(item[0], item[1], item[2], item[3]);
		loadDatalist(item[2], item[3]);
	});
	makeTotal();
}

function makeSlot(symbol, shortName, datalist, url) {
	var $tr = $("<tr>").attr("id", shortName);
	var $symbol = $("<td>").html(symbol);
	var $name = $("<td>").append($("<input>").attr({"class" : "name", "list" : datalist}));
	var $ticks = $("<td>").append($("<input>").addClass("ticks"));
	if (shortName != "wep")
		$ticks.children().hide();
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

function makeTotal() {
	var $tr = $("<tr>").attr("id", "total");
	var $symbol = $("<td>").html("");
	var $name = $("<td>").html("<b>Total</b>");
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
	
	updateTotal();
}

const sumSlots = [
	".str",
	".r",
	".st",
	".sl",
	".cr",
	".ma",
	".ra"
];

function updateTotal() {
	$("#wep").find(".ticks").change(function() {
		$("#total").find(".ticks").val($("#wep").find(".ticks").val());
	}); 

	for (var i = 0; i < sumSlots.length; i++) {
		setChangeFn(sumSlots[i]);
	}

}

function setChangeFn(slot) {
	$(slot).each(function(){
		$(this).change(function() {
			sumStatTotal(slot);
		});
	});
	$("#total").find("*").off("change");
}

function calculateAllTotals() {
	for (var i = 0; i < sumSlots.length; i++) {
		sumStatTotal(sumSlots[i]);
	}
	
	if ($("#wep").find(".ticks").val() != "") {
		$("#total").find(".ticks").val($("#wep").find(".ticks").val());
	}
}

function sumStatTotal(statClass) {
	var sum = 0;
	var fields = $(statClass);	
	for(var i = 0; i < fields.length - 1; i++){
		if (fields[i].value != "") {
			sum += parseInt(fields[i].value);
		}
	}
	$("#total").find(statClass).val(sum);
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
	if ($piece.find(".name").val() != "") {
		var find = url + "\/" + $piece.find(".name").val();
		$.ajax({
			url: find,
			method: "GET",
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
			
			calculateAllTotals();
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			alert("Request failed: " + errorThrown);
		});
	}
}

function pickMelee() {
	emptyStyle();
	
	var $base = $("#baseStats");
	
	var $potA = $("<datalist>").attr("id", "potA");
	var $potS = $("<datalist>").attr("id", "potS");
	getPotList("attack", $potA);
	getPotList("strength", $potS);
	$base.append($potA, $potS);
	
	var $span1 = $("<span>").html("Atk: ");
	var $atk = $("<input>").attr("id", "baseAtk");
	var $potAtk = $('<input id="potAtk" list="potA" size="30" />');
	var $span2 = $("<span>").html("Str: ");
	var $str = $("<input>").attr("id", "baseStr");
	var $potStr = $('<input id="potStr" list="potS" size="30" />');
	$base.append($span1, $atk, $potAtk, $("<br>"), $span2, $str, $potStr);
	
	var $span3 = $("<span>").html("AS");
	var $form = $("<form>");
	var $span4 = $("<span>").html("Accurate");
	var $radioAccurate = $('<input type="radio" name="as" id="radioAccurate" />');
	var $span5 = $("<span>").html("Aggressive");
	var $radioStrength = $('<input type="radio" name="as" id="radioStrength" />');
	var $span6 = $("<span>").html("Controlled");
	var $radioControlled = $('<input type="radio" name="as" id="radioControlled" />');
	$form.append($span4, $radioAccurate, $span5, $radioStrength, $span6, $radioControlled, $("<br>"));
	var $span7 = $("<span>").html("St");
	var $radioStab = $('<input type="radio" name="st" id="radioStab" />');
	var $span8 = $("<span>").html("Sl");
	var $radioSlash = $('<input type="radio" name="st" id="radioSlash" />');
	var $span9 = $("<span>").html("Cr");
	var $radioCrush = $('<input type="radio" name="st" id="radioCrush" />');
	$form.append($span7, $radioStab, $span8, $radioSlash, $span9, $radioCrush, $("<br>"));
	$("#attackStyle").append($span3, $form);
	
	var $span10 = $("<span>").html("P");
	var $pAccuracy = $("<datalist>").attr("id", "acc");
	var $pStrength = $("<datalist>").attr("id", "str");
	var $p1 = $('<input id="p1" list="acc" size="40" />');
	var $p2 = $('<input id="p2" list="str" size="40" />');
	$("#prayer").append($span10, $("<br>"), $pAccuracy, $pStrength, $p1, $("<br>"), $p2);
	
	
	var style = "melee";
	$.ajax({
        url: "\/prayer\/" + style, 
        method: "GET",
        dataType: "json"
    })
    .done(function(jsondata){
		var data = jsondata.data;
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			
			if (data[i].accuracy > 1) {
				var buff = data[i].name + " (" + data[i]["accuracy"] + ")";
				$option.text(buff);
				$pAccuracy.append($option.clone());
			}
			if (data[i].strength > 1) {
				var buff = data[i].name + " (" + data[i]["strength"] + ")";
				$option.text(buff);
				$pStrength.append($option.clone());
			}
		}
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
	
	
}

function pickRange() {
	emptyStyle();
}

function pickMagic() {
	emptyStyle();
}

function emptyStyle() {
	$(".pick").each(function(){
		$(this).empty();
	});
}

function getPotList(potStyle, $potList) {
	$.ajax({
        url: "\/potion\/" + potStyle, 
        method: "GET",
        dataType: "json"
    })
    .done(function(jsondata){
		var data = jsondata.data;
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			var boost = data[i].name + " (" + data[i]["percentage"] + "% + " + data[i]["static"] + ")";
			$option.text(boost);
			$potList.append($option);
		}
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}



$('#testButton').click(function() {
	alert("IN A");
	getMeleeAccuracy();
});



function getMeleeAccuracy() {
	var baseAtk = parseInt($("#baseAtk").val());
	var potAtk = $("#potAtk").val();
	var percentage = 0;
	var constant = 0
	if (potAtk != "") {
		percentage = parseInt(potAtk.substr(potAtk.search(/([\d]+%)/)));
		constant = parseInt(potAtk.substr(potAtk.search(/( [\d]+)/)));
	}
	var visible = Math.floor(baseAtk + baseAtk * percentage / 100) + constant;

	var p1 = $("#p1").val() || "1";
	var p2 = $("#p2").val() || "1";
	var pAcc = parseFloat(p1.substr(p1.search(/([\d]\.?[\d]*)/)));
	var pStr = parseFloat(p2.substr(p2.search(/([\d]\.?[\d]*)/)));
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 3; }
    else if($("#radioControlled").is(':checked')) { style = 1; }
	else if($("#radioStrength").is(':checked')) { style = 0; }
	else { alert("No style"); }
	
	var v = 1;
	if ($("#head").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#chest").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#legs").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#hands").find(".name").val().toLowerCase().indexOf("void") != -1
		) {v = 1.1;}
	
	var bonus = 0;
	if($("#radioStab").is(':checked')) { bonus = $("#total").find(".st").val() || "0"; }
    else if($("#radioSlash").is(':checked')) { bonus = $("#total").find(".sl").val() || "0"; }
	else if($("#radioCrush").is(':checked')) { bonus = $("#total").find(".cr").val() || "0"; }
	else { alert("No equip bonus"); }
	
	
	var gear = 1;
	
	if ($("#head").find(".name").val().toLowerCase().indexOf("slayer") != -1
	 || $("#head").find(".name").val().toLowerCase().indexOf("black mask") != -1) {
		gear = 7/6;
	}
	
	if ($("#neck").find(".name").val().toLowerCase().indexOf("salve amulet (e)") != -1) {
		gear = 1.2;
	}
	
	else if ($("#neck").find(".name").val().toLowerCase().indexOf("salve amulet") != -1) {
		gear = 7/6;
	}

	var load = {visible, pAcc, style, v, bonus, gear};
	
	$.ajax({
        url: "\/calculate\/roll", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .done(function(jsondata){
		var data = jsondata.data;

    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
	

}


