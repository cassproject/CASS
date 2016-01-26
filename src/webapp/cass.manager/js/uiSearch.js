var searchHandle = null;

function privateDataSearch() {
	var query = $("#privateDataSearchText").val();
	if (query == null || query == "")
		query = "*";
	if (searchHandle != null)
		clearTimeout(searchHandle);
	searchHandle = setTimeout(function() {
		Manager.searchController.search(query);
	}, 100);
}

function addTilesToSearchResults(obj) {
	var tile = '<div class="tile" tabindex="0" style="display:block"><div class="cube app data"><div class="front"><p class="title"></p></div><div class="back"><p class="status"></p><div class="actions"></div></div></div><a class="hotspot finger" title=""></a></div>';

	searchHandle = null;
	$("#searchResultsPrivate").html("");
	for ( var index in obj) {
		$("#searchResultsPrivate").append(tile);
		var t = $("#searchResultsPrivate").children(".tile").last();
		var type = obj[index]["@type"];
		type = type.split("/");
		type = type[type.length - 1];
		t.find(".title").text(type);
		t.attr("id", obj[index]["@id"]);
	}
}

function searchError(obj) {

}

$(".myData").on("keyup", "#privateDataSearchText", function(obj) {
	privateDataSearch();
});

$("#searchResultsPrivate").on("click", ".tile", function() {
	Manager.repositoryController.view($(this).attr("id"));
});
