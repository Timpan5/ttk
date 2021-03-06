/*
* Constants for equipment slots.
* Holds slot itentifier, name, datalist name, element id, and server url.
* Equipment slots are generated using these constants.
*/
const slotNames = [
	["W", "wep", "wList", "weaponsList", "stats\/wep\/melee"],
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

/**
* Load datalists for inputs.
* Allows users to search by name and autofill inputs.
 */
function loadLists() {
	loadEquipmentSlots();
	loadNpcList();
}

/**
* Creates equipment slots using values defined in constant 'slotNames' 
* Makes input boxes and gets data to create datalist for equipment slots. 
 */
function loadEquipmentSlots() {
	slotNames.forEach(function(item){
		makeSlot(item[0], item[1], item[2], item[3]);
		loadDatalist(item[2], item[3]);
	});
	makeTotal();
}

/**
* Creates one row of equipment slot inputs.
* Makes input boxes and gets data to create datalist for equipment slots. 
* @param {string} symbol - Identifier for this slot.
* @param {string} shortName - Abbreviated name for this slot.
* @param {string} datalist - Datalist containing names for this slot.
* @param {string} url - Server url to GET equipment when searched for.
 */
function makeSlot(symbol, shortName, datalist, url) {
	//Create inputs for data fields
	var $tr = $("<tr>").attr("id", shortName);
	var $symbol = $("<td>").append($("<img>").attr("src", "/assets/images/" + shortName + ".png"));
	var $name = $("<td>").append($("<input>").attr({"class" : "name", "list" : datalist}));
	var $ticks = $("<td>").append($('<input class="ticks" size="5">'));
	if (shortName != "wep")
		$ticks.children().hide();
	var $str = $("<td>").append($('<input class="str" size="5">'));
	var $st = $("<td>").append($('<input class="st" size="5">'));
	var $sl = $("<td>").append($('<input class="sl" size="5">'));
	var $cr = $("<td>").append($('<input class="cr" size="5">'));
	var $mm = $('<td class="mm" />');
	var $m = $('<td>').append($('<input class="m" size="5">'));
	var $ma = $('<td>').append($('<input class="ma" size="5">'));
	var $mr = $('<td class="mr" />');
	var $r = $('<td>').append($('<input class="r" size="5">'));
	var $ra = $('<td>').append($('<input class="ra" size="5">'));

	//Set data fields to be updated if name search field is changed
	$name.find(".name").change(function() {
		ajaxStats($tr, url);
	}); 
	
	//Append results to the section
	$tr.append($symbol, $name, $ticks, $str, $st, $sl, $cr, $mm, $m, $ma, $mr, $r, $ra);
	$("#equipment").append($tr);
}

/**
* Creates the 'total' row of the equipment table.
* This row contains the summed values of all entered data.
* It is updated when any input changes values.
 */
function makeTotal() {
	var $tr = $("<tr>").attr("id", "total");
	var $symbol = $("<td>").html("");
	var $name = $("<td>").html("<b>Total</b>");
	var $ticks = $("<td>").append($('<input class="ticks" size="5">'));
	var $str = $("<td>").append($('<input class="str" size="5">'));
	var $st = $("<td>").append($('<input class="st" size="5">'));
	var $sl = $("<td>").append($('<input class="sl" size="5">'));
	var $cr = $("<td>").append($('<input class="cr" size="5">'));
	var $mm = $('<td class="mm" />');
	var $m = $('<td class="equipLeftM">').append($('<input class="m" size="5">'));
	var $ma = $('<td class="equipRightM">').append($('<input class="ma" size="5">'));
	var $mr = $('<td class="mr" />');
	var $r = $('<td class="equipLeftR">').append($('<input class="r" size="5">'));
	var $ra = $('<td class="equipRightR">').append($('<input class="ra" size="5">'));
	
	$tr.append($symbol, $name, $ticks, $str, $st, $sl, $cr, $mm, $m, $ma, $mr, $r, $ra);
	$("#equipment").append($tr);
	
	updateTotal();
}

/*
* Constants to determine which values should be summed.
* Inputs with these classes will be summed into the 'total' row.
*/
const sumSlots = [
	".str",
	".r",
	".st",
	".sl",
	".cr",
	".m",
	".ma",
	".ra"
];

/**
* Sets change function for inputs to facilitate summing in 'total' row.
 */
function updateTotal() {
	$("#wep").find(".ticks").change(function() {
		$("#total").find(".ticks").val($("#wep").find(".ticks").val());
	}); 

	for (var i = 0; i < sumSlots.length; i++) {
		setChangeFn(sumSlots[i]);
	}
}

/**
* Sets a class of inputs to be summed into the correct spot in the 'total' row. 
* @param {string} slot - Class of the slot.
 */
function setChangeFn(slot) {
	//Set all input fields to trigger resumming the total
	$(slot).each(function(){
		$(this).change(function() {
			sumStatTotal(slot);
		});
	});
	$("#total").find("*").off("change");
}

/**
* Sums values of every class of inputs into the 'total' row. 
 */
function calculateAllTotals() {
	for (var i = 0; i < sumSlots.length; i++) {
		sumStatTotal(sumSlots[i]);
	}
	
	if ($("#wep").find(".ticks").val() != "") {
		$("#total").find(".ticks").val($("#wep").find(".ticks").val());
	}
}

/**
* Calculate and set the value for one class.
* @param {string} statClass - The class of values to sum.
 */
function sumStatTotal(statClass) {
	var sum = 0;
	var fields = $(statClass);	
	for (var i = 0; i < fields.length - 1; i++){
		if (fields[i].value != "") {
			sum += parseInt(fields[i].value);
		}
	}
	$("#total").find(statClass).val(sum);
}

/**
* Get the options for a datalist.
* @param {string} listName  - Name of the list to get datalist for.
* @param {string} url - Url to use to send GET request.
 */
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

/**
* Send GET request for a searched result and set the returned data.
* @param {<tr>} $piece  - Row to set data in.
* @param {string} url - Url to use to send GET request.
 */
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

/**
* Get the prayer options for a combat style.
* @param {string} style  - Combat style to get prayers for.
 */
function getPrayer(style) {
	var ret = $.ajax({
        url: "\/prayer\/" + style, 
        method: "GET",
        dataType: "json"
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
	
	return ret;
}

/**
* Select melee as the combat style.
* Create options related to melee combat.
 */
function pickMelee() {
	//Set new input and simulation settings
	emptyStyle();
	$("#sim").off();
	$("#sim").click(simulateMelee);

	//Base stat settings
	var $base = $("#baseStats");
	var $span1 = $("<span>").html("Attack Level: ");
	var $atk = $("<input>").attr("id", "baseAtk").val(99);
	var $potAtk = $('<select id="potAtk" />');
	var $span2 = $("<span>").html("Strength Level: ");
	var $str = $("<input>").attr("id", "baseStr").val(99);
	var $potStr = $('<select id="potStr" />');
	getPotList("attack", $potAtk);
	getPotList("strength", $potStr);
	$base.append($span1, $atk, $potAtk, $("<br>"), $span2, $str, $potStr);
	
	//Attack style settings
	var $span3 = $("<span>").html("");
	var $form = $("<form>");
	var $span4 = $("<span>").html("Accurate");
	var $radioAccurate = $('<input type="radio" name="as" id="radioAccurate" />').prop( "checked",true);
	var $span5 = $("<span>").html("Aggressive");
	var $radioStrength = $('<input type="radio" name="as" id="radioStrength" />');
	var $span6 = $("<span>").html("Controlled");
	var $radioControlled = $('<input type="radio" name="as" id="radioControlled" />');
	$form.append($radioAccurate, $span4, $("<br>"), $radioStrength, $span5, $("<br>"), $radioControlled, $span6, $("<br>"));
	
	//Attack type settings
	var $form1 = $("<form>");
	var $span7 = $("<span>").html("Stab");
	var $radioStab = $('<input type="radio" name="st" id="radioStab" />').prop( "checked",true);
	var $span8 = $("<span>").html("Slash");
	var $radioSlash = $('<input type="radio" name="st" id="radioSlash" />');
	var $span9 = $("<span>").html("Crush");
	var $radioCrush = $('<input type="radio" name="st" id="radioCrush" />');
	$form1.append($("<br>"), $radioStab, $span7, $("<br>"), $radioSlash, $span8, $("<br>"), $radioCrush, $span9, $("<br>"));
	$("#attackStyle").append($span3, $form, $form1);
	
	//Buff settings
	var $span10 = $("<span>").html("Prayer");
	var $p1 = $('<select id="p1" />');
	var $p2 = $('<select id="p2" />');
	$("#prayer").append($span10, $("<br>"), $p1, $("<br>"), $p2);
	
	var $o1 = $("<option>").text("No Atk Prayer");
	var $o2 = $("<option>").text("No Str Prayer");
	$p1.append($o1);
	$p2.append($o2);
	
	getPrayer("melee").done(function(jsondata){
		var data = jsondata.data;
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			
			if (data[i].accuracy > 1) {
				var buff = data[i].name + " (" + data[i]["accuracy"] + ")";
				$option.text(buff);
				$p1.append($option.clone());
			}
			if (data[i].strength > 1) {
				var buff = data[i].name + " (" + data[i]["strength"] + ")";
				$option.text(buff);
				$p2.append($option.clone());
			}
		}
    });
}

/**
* Select range as the combat style.
* Create options related to range combat.
 */
function pickRange() {
	//Set new input and simulation settings
	emptyStyle();
	$("#sim").off();
	$("#sim").click(simulateRange);
	
	//Base stat settings
	var $base = $("#baseStats");
	var $span1 = $("<span>").html("Range Level: ");
	var $range = $("<input>").attr("id", "baseRange").val(99);
	var $potRange = $('<select id="potRange" />');
	getPotList("range", $potRange);
	$base.append($span1, $range, $potRange);
	
	//Attack style settings
	var $span2 = $("<span>").html("Attack Style");
	var $form = $("<form>");
	var $span3 = $("<span>").html("Accurate");
	var $radioAccurate = $('<input type="radio" name="as" id="radioAccurate" />').prop( "checked",true);
	var $span4 = $("<span>").html("Rapid");
	var $radioRapid = $('<input type="radio" name="as" id="radioRapid" />');
	var $span5 = $("<span>").html("Longrange");
	var $radioLongrange = $('<input type="radio" name="as" id="radioLongrange" />');
	$form.append($span2, $("<br>"), $radioAccurate, $span3, $("<br>"), $radioRapid, $span4, $("<br>"), $radioLongrange, $span5, $("<br>"));
	$("#attackStyle").append($form);
	
	//Buff settings
	var $span6 = $("<span>").html("Prayer");
	var $p1 = $('<select id="p1" />');
	$("#prayer").append($span6, $("<br>"), $p1);
	
	var $o1 = $("<option>").text("No Prayer");
	$p1.append($o1);
	
	getPrayer("range").done(function(jsondata){
		var data = jsondata.data;
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			var buff = data[i].name + " (" + data[i]["accuracy"] + ")";
			$option.text(buff);
			$p1.append($option);
		}
    });
}

/**
* Select magic as the combat style.
* Create options related to magic combat.
 */
function pickMagic() {
	//Set new input and simulation settings
	emptyStyle();
	$("#sim").off();
	$("#sim").click(simulateMagic);
	
	//Base stat settings
	var $base = $("#baseStats");
	var $span1 = $("<span>").html("Magic Level: ");
	var $magic = $("<input>").attr("id", "baseMagic").val(99);
	var $potMagic = $('<select id="potMagic" />');
	getPotList("magic", $potMagic);
	$base.append($span1, $magic, $potMagic);
	
	//Spell selection
	var $span2 = $("<span>").html("Spell Base Damage: ");
	var $spell = $('<select id="spell" />');
	
	//Weapon spell selection
	var $wepSpell = $('<select id="wepSpell" />');
	var $s1 = $("<option>").text("Weapon Spells");
	var $s2 = $("<option>").text("Trident");
	var $s3 = $("<option>").text("Swamp Trident");
	var $s4 = $("<option>").text("Black Salamander");
	$wepSpell.append($s1, $s2, $s3, $s4);
	
	var $maxHit = $('<input id="spellMax" size="5" />');
	$("#attackStyle").append($span2, $("<br>"), $spell, $wepSpell, $maxHit);
	
	var $noSpell = $("<option>").text("Casted Spells");
	$spell.append($noSpell);
	
	$.ajax({
        url: "\/spells", 
        method: "GET",
        dataType: "json"
    })
    .done(function(jsondata){
		var data = jsondata.data;
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			var spell = data[i].name + " (" + data[i].max + ")";
			$option.text(spell);
			$spell.append($option);
		}
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
	
	//Buff settings
	var $span3 = $("<span>").html("Prayer");
	var $p1 = $('<select id="p1" />');
	$("#prayer").append($span3, $("<br>"), $p1);
	
	var $o1 = $("<option>").text("No Prayer");
	$p1.append($o1);
	
	getPrayer("magic").done(function(jsondata){
		var data = jsondata.data;
		for (i = 0; i < data.length; i++) {
			var $option = $("<option>");
			var buff = data[i].name + " (" + data[i]["accuracy"] + ")";
			$option.text(buff);
			$p1.append($option);
		}
    });
}

/**
* Clear style options when a different combat style is selected.
 */
function emptyStyle() {
	$(".pick").each(function(){
		$(this).empty();
	});
}

/**
 * Get datalist options for potions for a particular combat style.
 * @param {string} potStyle - Combat style to get potions for.
 * @param {<datalist>} $potList - Datalist to add options to.
 */
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

/**
 * User entered data to simulate melee combat.
 * Results displayed in aggregate and graph sections.
 */
function simulateMelee() {
	getMeleeAccuracy().done(function(acc){ //roll
		getMeleeMax().done(function(max){ //hit
			getDefRoll("melee").done(function(def){ //roll
				getHitChance(acc.roll, def.roll).done(function(chance){ //chance
					simulate(1000, chance.chance, max.hit);
				});
			});
		});
    });
}

/**
 * User entered data to simulate range combat.
 * Results displayed in aggregate and graph sections.
 */
function simulateRange() {
	getRangeAccuracy().done(function(acc){ //roll
		getRangeMax().done(function(max){ //hit
			getDefRoll("range").done(function(def){ //roll
				getHitChance(acc.roll, def.roll).done(function(chance){ //chance
					simulate(1000, chance.chance, max.hit);
				});
			});
		});
    });
}

/**
 * User entered data to simulate magic combat.
 * Results displayed in aggregate and graph sections.
 */
function simulateMagic() {
	getMagicAccuracy().done(function(acc){ //roll
		getDefRoll("magic").done(function(def){ //roll
			getHitChance(acc.roll, def.roll).done(function(chance){ //chance
				simulate(1000, chance.chance, getMagicMax());
			});
		});
    });
}

/**
 * Calculate potion boost.
 * @param {integer} base - Base value.
 * @param {string} boost - Amount to increase base value by.
 * @return - Integer value of augmented base value.
 */
function calculateVisible(base, boost) {
	var p = parseInt(boost.substr(boost.search(/([\d]+%)/)));
	var c = parseInt(boost.substr(boost.search(/( [\d]+)/)));
	return (Math.floor(base + base * p / 100) + c);
}

/**
 * Calculate dice roll, a part of the combat formula.
 * Input data is sent to the server which returns calculated value.
 * @param {object} load - Input values to calculate roll.
 * @return - jqXHR object for ajax call.
 */
function calculateRoll(load) {
	return $.ajax({
        url: "\/calculate\/roll\/melee", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}

/**
 * Calculate melee attack roll, a part of the combat formula.
 * @return - jqXHR object for ajax call.
 */
function getMeleeAccuracy() {
	var visible = parseInt($("#baseAtk").val());
	var potAtk = $("#potAtk option:selected").text();

	if (potAtk.indexOf("No Potion")) {
		visible = calculateVisible(visible, potAtk);
	}
	
	var p1 = $("#p1 option:selected").text();
	var pAcc = 1;
	if (p1.indexOf("No Atk Prayer")) {
		pAcc = parseFloat(p1.substr(p1.search(/([\d]\.?[\d]*)/)));
	}
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 3; }
    else if($("#radioControlled").is(':checked')) { style = 1; }
	else if($("#radioStrength").is(':checked')) { style = 0; }
	else { alert("No style"); }
	
	var v = $("#checkVoid").is(':checked') ? 1.1 : 1;
	var gear = $("#checkSalve").is(':checked') ? 1.2 : $("#checkSlay").is(':checked') ? 7/6 : 1;
	
	var bonus = 0;
	if($("#radioStab").is(':checked')) { bonus = $("#total").find(".st").val() || "0"; }
    else if($("#radioSlash").is(':checked')) { bonus = $("#total").find(".sl").val() || "0"; }
	else if($("#radioCrush").is(':checked')) { bonus = $("#total").find(".cr").val() || "0"; }
	else { alert("No equip bonus"); }

	var load = {visible, pAcc, style, v, bonus, gear};
	return calculateRoll(load);
}

/**
 * Calculate range attack roll, a part of the combat formula.
 * @return - jqXHR object for ajax call.
 */
function getRangeAccuracy() {
	var visible = parseInt($("#baseRange").val());
	var potRange = $("#potRange option:selected").text();

	if (potRange.indexOf("No Potion")) {
		visible = calculateVisible(visible, potRange);
	}

	var p1 = $("#p1 option:selected").text();
	var pAcc = 1;
	if (p1.indexOf("No Prayer")) {
		pAcc = parseFloat(p1.substr(p1.search(/([\d]\.?[\d]*)/)));
	}
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 3; }
    else if($("#radioRapid").is(':checked')) { style = 0; }
	else if($("#radioLongrange").is(':checked')) { style = 0; }
	else { alert("No style"); }
	
	var v = $("#checkVoid").is(':checked') ? 1.1 : 1;
	var gear = $("#checkSalve").is(':checked') ? 1.2 : $("#checkSlay").is(':checked') ? 1.15 : 1;
	var bonus = $("#total").find(".ra").val() || "0";
	
	var load = {visible, pAcc, style, v, bonus, gear};
	return calculateRoll(load);
}

/**
 * Calculate magic attack roll, a part of the combat formula.
 * @return - jqXHR object for ajax call.
 */
function getMagicAccuracy() {
	var visible = parseInt($("#baseMagic").val());
	var potMagic = $("#potMagic option:selected").text();

	if (potMagic.indexOf("No Potion")) {
		visible = calculateVisible(visible, potMagic);
	}
	
	var p1 = $("#p1 option:selected").text();
	var pAcc = 1;
	if (p1.indexOf("No Prayer")) {
		pAcc = parseFloat(p1.substr(p1.search(/([\d]\.?[\d]*)/)));
	}
	
	var style = 0;
	var b = $("#wepSpell option:selected").text();
	if (!b.indexOf("Trident") || !b.indexOf("Swamp Trident")) {
		style = 3;
	}
	
	var v = $("#checkVoid").is(':checked') ? 1.3 : 1;
	var gear = $("#checkSalve").is(':checked') ? 1.2 : $("#checkSlay").is(':checked') ? 1.15 : 1;
	var bonus = $("#total").find(".ma").val() || "0";
	
	var load = {visible, pAcc, style, v, bonus, gear};
	return calculateRoll(load);
}

/**
 * Calculate melee max hit, a part of the combat formula.
 * @return - jqXHR object for ajax call.
 */
function getMeleeMax() {
	var visible = parseInt($("#baseStr").val());
	var potStr = $("#potStr option:selected").text();

	if (potStr.indexOf("No Potion")) {
		visible = calculateVisible(visible, potStr);
	}
	
	var p2 = $("#p2 option:selected").text();
	var pStr = 1;
	if (p2.indexOf("No Str Prayer")) {
		pStr = parseFloat(p2.substr(p2.search(/([\d]\.?[\d]*)/)));
	}
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 0; }
    else if($("#radioControlled").is(':checked')) { style = 1; }
	else if($("#radioStrength").is(':checked')) { style = 3; }
	else { alert("No style"); }
	
	var v = $("#checkVoid").is(':checked') ? 1.1 : 1;
	var gear = $("#checkSalve").is(':checked') ? 1.2 : $("#checkSlay").is(':checked') ? 7/6 : 1;
	var bonus = $("#total").find(".str").val() || 0;

	var load = {visible, pStr, style, v, bonus, gear};
	return $.ajax({
        url: "\/calculate\/hit\/melee", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });	
}

/**
 * Calculate range max hit, a part of the combat formula.
 * @return - jqXHR object for ajax call.
 */
function getRangeMax() {
	var visible = parseInt($("#baseRange").val());
	var potRange = $("#potRange option:selected").text();

	if (potRange.indexOf("No Potion")) {
		visible = calculateVisible(visible, potRange);
	}
	
	var p1 = $("#p1 option:selected").text();
	var pStr = 1;
	if (p1.indexOf("No Prayer")) {
		pStr = parseFloat(p1.substr(p1.search(/([\d]\.?[\d]*)/)));
	}
	
	var style = 0;
	if($("#radioAccurate").is(':checked')) { style = 3; }
    else if($("#radioRapid").is(':checked')) { style = 0; }
	else if($("#radioLongrange").is(':checked')) { style = 0; }
	else { alert("No style"); }
	
	var v = $("#checkVoid").is(':checked') ? 1.1 : 1;
	var gear = $("#checkSalve").is(':checked') ? 1.2 : $("#checkSlay").is(':checked') ? 1.15 : 1;
	var bonus = $("#total").find(".r").val() || 0;

	var load = {visible, pStr, style, v, bonus, gear};
	return $.ajax({
        url: "\/calculate\/hit\/range", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });	
}

/**
 * Calculate magic max hit, a part of the combat formula.
 * @return - Integer value of magic max hit.
 */
function getMagicMax() {
	var spell = $("#spell option:selected").text();
	if (spell.indexOf("Casted Spells")) {
		$("#spellMax").val(parseInt(spell.match(/([\d]+)/)));
	}
	
	var visible = parseInt($("#baseMagic").val());
	var potMagic = $("#potMagic option:selected").text();

	if (potMagic.indexOf("No Potion")) {
		visible = calculateVisible(visible, potMagic);
	}
	
	var a = $("#spell option:selected").text();
	if (!a.indexOf("Magic dart")) {
		$("#spellMax").val(10 + Math.floor(visible / 10));
	}

	var b = $("#wepSpell option:selected").text();
	if (!b.indexOf("Trident")) {
		$("#spellMax").val(Math.floor(visible / 3) - 5);
	}
	else if (!b.indexOf("Swamp Trident")) {
		$("#spellMax").val(Math.floor(visible / 3) - 2);
	}
	else if (!b.indexOf("Black Salamander")) {
		$("#spellMax").val(Math.floor(0.5 + visible * (156/640)));
	}
	
	var str = $("#total").find(".m").val();
	var bonus = 1 + (parseInt(str) / 100 || 0);
	var hit = Math.floor($("#spellMax").val() * bonus);
	
	if($("#checkSalve").is(':checked')) {
		hit = Math.floor(hit * 1.2);
	}
	else if($("#checkSlay").is(':checked')) {
		hit = Math.floor(hit * 1.15);
	}
	
	return hit;
}

/**
 * Send GET request to get datalist options for NPC names.
 */
function loadNpcList() {
	var $datalist = $("#npcList");
	
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

/**
 * Send GET request to get NPC stats.
 */
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

/**
 * Calculate NPC defense roll, a part of the combat formula.
 * @param {string} combat - Combat style to calculate roll for.
 * @return - jqXHR object for ajax call.
 */
function getDefRoll(combat) {
	var visible = $("#npcDef").val();
	var pAcc = 1;
	var style = 1;
	var v = 1;
	var gear = 1;
	var bonus = 0;
	
	if (!combat.indexOf("melee")) {
		if($("#radioStab").is(':checked')) { bonus = $("#npcSl").val() || "0"; }
		else if($("#radioSlash").is(':checked')) { bonus = $("#npcSl").val() || "0"; }
		else if($("#radioCrush").is(':checked')) { bonus = $("#npcCr").val() || "0"; }
		else { alert("No equip bonus"); }
	}
	
	else if (!combat.indexOf("range")) {
		bonus = $("#npcRa").val() || "0";
	}
	
	else if (!combat.indexOf("magic")) {
		visible = $("#npcM").val();
		bonus = $("#npcMa").val() || "0";
	}
	
	var load = {visible, pAcc, style, v, bonus, gear};
	return calculateRoll(load);
}

/**
 * Send values to server to calculate hit chance, a part of the combat formula.
 * Values 'A' and 'B' are values previously calculated.
 * @param {string} A - Accuracy roll.
 * @param {string} B - Defense roll.
 * @return - jqXHR object for ajax call.
 */
function getHitChance(A, B) {
	var load = {A,B};
	return $.ajax({
        url: "\/calculate\/chance", 
        method: "POST",
        dataType: "json",
		data: load
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
}

/**
 * Simulate combat against NPC using calculated combat information.
 * Call function to make graph with results.
 * @param {integer} num - Number of simulations to run.
 * @param {string} chance - Chance to hit.
 * @param {string} max - Max hit.
 */
function simulate(num, chance, max) {
	var hp = parseInt($("#npcHp").val());
	var count = 0;
	var results = [];

	//Simulate combat for 'num' iterations
	for (i = 0; i < num; i++) {
		var current = hp;
		count = 0;
		while(current > 0) {
			var hit = 0;
			if (Math.random() <= parseFloat(chance)) {
				hit = Math.floor(Math.random() * parseInt(max));
			}
			current = current - hit;
			count++;
		}
		results.push(count);
	}
	
	//Calculate aggregate data
	var $avg = $("#avg");
	$avg.empty();
	var $p1 = $("<p>").html("Max Hit: " + max);
	var $p2 = $("<p>").html("Hit Chance: " + chance);
	$avg.append($p1, $p2);
	makeChart(results);
}

/**
 * Make graph to display combat simulations.
 * @param {object} hitCounts - Result of all combat simulations.
 */
function makeChart(hitCounts) {
	var interval = parseInt($("#total").find(".ticks").val());
	var ticks = [];
	var count = [];
	var avg = 0;
	
	if ($("#radioRapid").length) {
		if($("#radioRapid").is(':checked')) {
			interval--;
		}
	}
	
	if ($("#spell").length) {
		interval = 5;
		var b = $("#wepSpell option:selected").text();
		if (!b.indexOf("Trident") || !b.indexOf("Swamp Trident")) {
			interval = 4;
		}
	}
	
	hitCounts.sort(function(a, b){return a-b});
	var begin = parseInt(hitCounts[0]);
	var end = parseInt(hitCounts.slice(-1)[0]);
	
	//Calculate x-axis range
	for (i = 0; i <= end - begin; i++) {
		ticks.push(i + begin);
		count.push(0);
	}

	//Modify data from simulation
	for (i = 0; i < ticks.length; i++) {
		ticks[i] *= interval;
	}
	
	//Add data to graph
	for (j = 0; j < hitCounts.length; j++) {
		var h = hitCounts[j]; 
		var slot = h - begin;
		count[slot]++;
		avg += h;
	}
	
	avg = avg / hitCounts.length;
	
	//Display aggregate data
	var $avg = $("#avg");
	var $p1 = $("<p>").html("Total number of simulations: " + hitCounts.length);
	var $p2 = $("<p>").html("Average ticks to kill: " + avg * interval);
	var $p3 = $("<p>").html("Average number of attacks to kill: " + avg);
	var $p4 = $("<p>").html("Average seconds to kill: " + avg * interval * 0.6);
	$avg.append($p1, $p2, $p3, $p4);
	
	//Create canvas for graph
	$("#graph").empty();
	var graph = $("<canvas>");
	$("#graph").append(graph);
	
	//Create graph
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

/**
 * Input data to allow user to view demo.
 */
function showDemo() {
	$("#wep").find(".name").val("Abyssal whip").change();
	$("#head").find(".name").val("Slayer helmet").change();
	$("#cape").find(".name").val("Fire cape").change();
	$("#neck").find(".name").val("Amulet of glory").change();
	$("#chest").find(".name").val("Fighter torso").change();
	$("#shield").find(".name").val("Dragon defender").change();
	$("#legs").find(".name").val("Rune platelegs").change();
	$("#hands").find(".name").val("Barrows gloves").change();
	$("#feet").find(".name").val("Dragon boots").change();
	$("#ring").find(".name").val("Berserker ring (i)").change();
	pickMelee();
	$("#radioSlash").prop("checked", true);
	$("#checkSlay").prop("checked", true);
	$("#npcName").val("Gargoyle").change();
	$("#demoResult").html("Data entered, begin simulation at the last step");
}

/**
 * Button to send email message. The contents of the text area are
 * send to the server which will then send it as an email.
 */
 $("#sendMsg").click(function() {
	var msg = $("#cMsg").val();
	var load = {msg};
	
	$.ajax({
        url: "\/email", 
        method: "POST",
        dataType: "json",
		data: load
    })
	.done(function(jsondata){
		$("#msg-result").append($("<h4> Message Sent </h4>"));
	})
    .fail(function(jqXHR, textStatus, errorThrown){
        $("#msg-result").append($("<h4> Server Error, try again later </h4>"));
    });
 });

/**
 * Button to switch back to index.html.
 */
 $("#back").click(function() {
	location.href="index.html";
 });