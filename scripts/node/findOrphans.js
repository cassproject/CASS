require("cassproject")
EcRemote.async = false;

var repo = new EcRepository();
repo.selectedServer = "http://localhost/api/";

var findRelation = function (r) {
    repo.search("@type:Framework AND relation:\"" + r.shortId() + "\"", function (f) {
    }, function (fs) {
        if (fs.length == 0)
            console.log(r.shortId());
    }, function () {
        findRelation(r);
    });
};

repo.searchWithParams("@type:Relation", {size:500}, findRelation, function (rs) {
}, console.error);
