function loadInputList() {
	var $input = $("<input>");
	$input.attr({"id":"wName", "list":"wList"});
	$("body").append($input);
	
	var $datalist = $("<datalist>");
	$datalist.attr("id", "wList");
	$("body").append($datalist);
	
	$.ajax({
        url: "wepList",
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

function getOffenseTotal() {
	var $wName = $("#wName");
	
	//Check for other characters in names
	if (/[^a-z\s\d]/gi.test($wName.val()))
		return;
	
	var url = "stats\/wep\/melee";
	
	$.ajax({
		url: url,
		method: "POST",
		data: {"name" : $wName.val()},
		dataType: "json"
	})
	.done(function(jsondata){
		var data = jsondata.data;
		
		if (!data.length)
			alert("Not found");
		
		else {
			alert(JSON.stringify(data));
		}
	})
	.fail(function(jqXHR, textStatus, errorThrown){
        alert( "Request failed: " + errorThrown );
    });
	
	//alert(url);
}