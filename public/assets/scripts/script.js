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

function loadLists() {
	loadEquipmentSlots();
	loadNpcList();
}

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
	var $ticks = $("<td>").append($('<input class="ticks" size="5">'));
	if (shortName != "wep")
		$ticks.children().hide();
	var $str = $("<td>").append($('<input class="str" size="5">'));
	var $r = $("<td>").append($('<input class="r" size="5">'));
	var $m = $("<td>").append($('<input class="m" size="5">'));
	var $st = $("<td>").append($('<input class="st" size="5">'));
	var $sl = $("<td>").append($('<input class="sl" size="5">'));
	var $cr = $("<td>").append($('<input class="cr" size="5">'));
	var $ma = $("<td>").append($('<input class="ma" size="5">'));
	var $ra = $("<td>").append($('<input class="ra" size="5">'));

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
	var $ticks = $("<td>").append($('<input class="ticks" size="5">'));
	var $str = $("<td>").append($('<input class="str" size="5">'));
	var $r = $("<td>").append($('<input class="r" size="5">'));
	var $m = $("<td>").append($('<input class="m" size="5">'));
	var $st = $("<td>").append($('<input class="st" size="5">'));
	var $sl = $("<td>").append($('<input class="sl" size="5">'));
	var $cr = $("<td>").append($('<input class="cr" size="5">'));
	var $ma = $("<td>").append($('<input class="ma" size="5">'));
	var $ra = $("<td>").append($('<input class="ra" size="5">'));
	
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
	var $span1 = $("<span>").html("Atk: ");
	var $atk = $("<input>").attr("id", "baseAtk").val(99);
	var $potAtk = $('<select id="potAtk" />');
	var $span2 = $("<span>").html("Str: ");
	var $str = $("<input>").attr("id", "baseStr").val(99);
	var $potStr = $('<select id="potStr" />');
	getPotList("attack", $potAtk);
	getPotList("strength", $potStr);
	$base.append($span1, $atk, $potAtk, $("<br>"), $span2, $str, $potStr);
	
	var $span3 = $("<span>").html("AS");
	var $form = $("<form>");
	var $span4 = $("<span>").html("Accurate");
	var $radioAccurate = $('<input type="radio" name="as" id="radioAccurate" />').prop( "checked",true);
	var $span5 = $("<span>").html("Aggressive");
	var $radioStrength = $('<input type="radio" name="as" id="radioStrength" />');
	var $span6 = $("<span>").html("Controlled");
	var $radioControlled = $('<input type="radio" name="as" id="radioControlled" />');
	$form.append($span4, $radioAccurate, $span5, $radioStrength, $span6, $radioControlled, $("<br>"));
	var $span7 = $("<span>").html("St");
	var $radioStab = $('<input type="radio" name="st" id="radioStab" />').prop( "checked",true);
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
	var $none = $("<option>").text("No Potion");
	$potList.append($none);
	
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

//@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@



$("#testButton").click(function() {
	getMeleeAccuracy();
	getMeleeMax();
	getDefRoll();
});

$("#calc").click(function() {
	getHitChance();
});

$("#simulate").click(function() {
	simulate(1000);
});

//@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@


function getMeleeAccuracy() {
	var baseAtk = parseInt($("#baseAtk").val());
	var potAtk = $("#potAtk option:selected").text();
	var percentage = 0;
	var constant = 0

	if (potAtk.indexOf("No Potion")) {
		percentage = parseInt(potAtk.substr(potAtk.search(/([\d]+%)/)));
		constant = parseInt(potAtk.substr(potAtk.search(/( [\d]+)/)));
	}
	var visible = Math.floor(baseAtk + baseAtk * percentage / 100) + constant;

	var p1 = $("#p1").val() || "1";
	var pAcc = parseFloat(p1.substr(p1.search(/([\d]\.?[\d]*)/)));
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 3; }
    else if($("#radioControlled").is(':checked')) { style = 1; }
	else if($("#radioStrength").is(':checked')) { style = 0; }
	else { alert("No style"); }
	
	
	var v = 1;
	if($("#checkVoid").is(':checked')) {
		v = 1.1;
	}
	
	var gear = 1;
	
	if($("#checkSalve").is(':checked')) {
		gear = 1.2;
	}
	else if($("#checkSlay").is(':checked')) {
		gear = 7/6;
	}
	
	/*
	var v = 1;
	if ($("#head").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#chest").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#legs").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#hands").find(".name").val().toLowerCase().indexOf("void") != -1
		) {v = 1.1;}
		
	*/
	
	var bonus = 0;
	if($("#radioStab").is(':checked')) { bonus = $("#total").find(".st").val() || "0"; }
    else if($("#radioSlash").is(':checked')) { bonus = $("#total").find(".sl").val() || "0"; }
	else if($("#radioCrush").is(':checked')) { bonus = $("#total").find(".cr").val() || "0"; }
	else { alert("No equip bonus"); }
	
	/*
	var gear = 1;
	
	if($("#checkSlay").is(':checked')) {
		if ($("#head").find(".name").val().toLowerCase().indexOf("slayer") != -1
		 || $("#head").find(".name").val().toLowerCase().indexOf("black mask") != -1) {
			gear = 7/6;
		}
	};
	
	if($("#checkSalve").is(':checked')) {
		if ($("#neck").find(".name").val().toLowerCase().indexOf("salve amulet (e)") != -1) {
			gear = 1.2;
		}
		else if ($("#neck").find(".name").val().toLowerCase().indexOf("salve amulet") != -1) {
			gear = 7/6;
		}
	};
	*/

	var load = {visible, pAcc, style, v, bonus, gear};

	$.ajax({
        url: "\/calculate\/roll\/melee", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .done(function(jsondata){
		var data = jsondata.roll;
		$("#attackRoll").html(data);

    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}

function getMeleeMax() {
	var baseStr = parseInt($("#baseStr").val());
	var potStr = $("#potStr option:selected").text();
	var percentage = 0;
	var constant = 0
	if (potStr.indexOf("No Potion")) {
		percentage = parseInt(potStr.substr(potStr.search(/([\d]+%)/)));
		constant = parseInt(potStr.substr(potStr.search(/( [\d]+)/)));
	}
	var visible = Math.floor(baseStr + baseStr * percentage / 100) + constant;

	var p2 = $("#p2").val() || "1";
	var pStr = parseFloat(p2.substr(p2.search(/([\d]\.?[\d]*)/)));
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 0; }
    else if($("#radioControlled").is(':checked')) { style = 1; }
	else if($("#radioStrength").is(':checked')) { style = 3; }
	else { alert("No style"); }
	
	var v = 1;
	if($("#checkVoid").is(':checked')) {
		v = 1.1;
	}
	
	/*
	if ($("#head").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#chest").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#legs").find(".name").val().toLowerCase().indexOf("void") != -1
		&& $("#hands").find(".name").val().toLowerCase().indexOf("void") != -1
		) {v = 1.1;}
	*/
	
	var bonus = $("#total").find(".str").val() || 0;
	
	var gear = 1;
	
	if($("#checkSalve").is(':checked')) {
		gear = 1.2;
	}
	else if($("#checkSlay").is(':checked')) {
		gear = 7/6;
	}

	/*
	if($("#checkSlay").is(':checked')) {
		if ($("#head").find(".name").val().toLowerCase().indexOf("slayer") != -1
		 || $("#head").find(".name").val().toLowerCase().indexOf("black mask") != -1) {
			gear = 7/6;
		}
	};
	
	
	if($("#checkSalve").is(':checked')) {
		if ($("#neck").find(".name").val().toLowerCase().indexOf("salve amulet (e)") != -1) {
			gear = 1.2;
		}
		else if ($("#neck").find(".name").val().toLowerCase().indexOf("salve amulet") != -1) {
			gear = 7/6;
		}
	};
	*/

	var load = {visible, pStr, style, v, bonus, gear};
	
	$.ajax({
        url: "\/calculate\/hit\/melee", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .done(function(jsondata){
		var data = jsondata.hit;
		$("#maxHit").html(data);

    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });	
}

function loadNpcList() {
	var $section = $("#enemy");
	var $datalist = $('<datalist id="npcList"/>');
	$section.append($datalist);
	
	$.ajax({
        url: "\/npc", 
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

function getNpcStats() {
	var name = $("#npcName").val();
	
	if (name != "") {
		$.ajax({
			url: "\/npc\/" + name, 
			method: "GET",
			dataType: "json"
		})
		.done(function(jsondata){
			var data = jsondata.data[0];
			
			$("#npcHp").val(data.hp);
			$("#npcDef").val(data.base[2]);
			$("#npcM").val(data.base[4]);
			
			$("#npcSt").val(data.defense[0]);
			$("#npcSl").val(data.defense[1]);
			$("#npcCr").val(data.defense[2]);
			$("#npcMa").val(data.defense[3]);
			$("#npcRa").val(data.defense[4]);
		})
		.fail(function(jqXHR, textStatus, errorThrown){
			alert( "Request failed: " + errorThrown );
		});
	}
}

function getDefRoll() {
	
	var visible = $("#npcDef").val();
	
	var pAcc = 1;
	var style = 1;
	var v = 1;
	var gear = 1;
	
	var bonus = 0;
	if($("#radioStab").is(':checked')) { bonus = $("#npcSl").val() || "0"; }
    else if($("#radioSlash").is(':checked')) { bonus = $("#npcSl").val() || "0"; }
	else if($("#radioCrush").is(':checked')) { bonus = $("#npcCr").val() || "0"; }
	else { alert("No equip bonus"); }
	
	var load = {visible, pAcc, style, v, bonus, gear};

	$.ajax({
        url: "\/calculate\/roll\/melee", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .done(function(jsondata){
		var data = jsondata.roll;
		$("#defRoll").html(data);

    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}

function getHitChance() {
	var A = $("#attackRoll").html();
	var B = $("#defRoll").html();
	var load = {A,B};
	
	//alert(JSON.stringify(load));
	
	$.ajax({
        url: "\/calculate\/chance", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .done(function(jsondata){
		var data = jsondata.chance;
		//alert(data);
		$("#hitChance").html(data);
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}

function simulate(num) {
	var hp = parseInt($("#npcHp").val());
	var count = 0;
	var results = [];
	
	for (i = 0; i < num; i++) {
		var current = hp;
		count = 0;
		while(current > 0) {
			var hit = 0;
			if (Math.random() <= $("#hitChance").html()) {
				hit = Math.floor(Math.random() * $("#maxHit").html());
			}
			current = current - hit;
			count++;
		}
		results.push(count);
	}
	makeChart(results);
}

function makeChart(hitCounts) {
	
	var interval = parseInt($("#total").find(".ticks").val());
	var ticks = [];
	var count = [];
	var avg = 0;
	
	hitCounts.sort(function(a, b){return a-b});
	var begin = parseInt(hitCounts[0]);
	var end = parseInt(hitCounts.slice(-1)[0]);
	
	for (i = 0; i <= end - begin; i++) {
		ticks.push(i + begin);
		count.push(0);
	}

	for (i = 0; i < ticks.length; i++) {
		ticks[i] *= interval;
	}
	
	for (j = 0; j < hitCounts.length; j++) {
		var h = hitCounts[j]; 
		var slot = h - begin;
		count[slot]++;
		avg += h;
	}
	
	avg = avg / hitCounts.length;
	
	var $avg = $("#avg");
	$avg.empty();
	var $p1 = $("<p>").html("Total number of simulations: " + hitCounts.length);
	var $p2 = $("<p>").html("Average ticks to kill: " + avg * interval);
	var $p3 = $("<p>").html("Average weapon hits to kill: " + avg);
	var $p4 = $("<p>").html("Average seconds to kill: " + avg * interval * 0.6);
	$avg.append($p1, $p2, $p3, $p4);
	
	
	var graph = $("#graph");
	var g = new Chart(graph, {
		type: 'bar',
		data: {
			labels: ticks,
			datasets: [{
				label: "Number of Simulations",
				data: count,
				backgroundColor: "rgba(27,212,232,1)",
				borderColor: "rgba(232,143,27,1)",
				borderWidth: 0
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					},
					scaleLabel: {
                    display: true,
                    labelString: 'Number of simulations (Higher is better)'
                  }
				}],
				xAxes: [{
					scaleLabel: {
                    display: true,
                    labelString: 'Ticks to kill (Lower is faster)'
                  }
				}]
			}
		}
	});
}