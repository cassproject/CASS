/**
 *  @author djunker
 * 
 * 	RepoEdit Stub for RepoEdit.js
 */
var RepoEdit = /**
 *  
 *  @param data
 *  @param saveButtonId
 *  @param messageContainerId
 */
function(data, saveButtonId, messageContainerId) {
    EcView.call(this);
    this.data = data;
    this.saveButtonId = saveButtonId;
    this.messageContainerId = messageContainerId;
};
RepoEdit = stjs.extend(RepoEdit, EcView, [], function(constructor, prototype) {
    prototype.data = null;
    prototype.saveButtonId = null;
    prototype.messageContainerId = null;
    prototype.getHtmlLocation = function() {
        return "partial/other/repoEdit.html";
    };
}, {data: "Object"}, {});
