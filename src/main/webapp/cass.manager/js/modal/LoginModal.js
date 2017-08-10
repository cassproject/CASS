/**
 * Modal for authenticating a user and getting keys stored on server
 * 
 * @module cass.manager
 * @class LoginModal
 * 
 * @author devlin.junker@eduworks.com
 */
var LoginModal = (function (LoginModal) {
    var ERROR_CONTAINER_ID = "#loginError";

    /**
     * Overridden display function, called once html partial is loaded into DOM
     * 
     * @memberOf LoginModal
     * @method display
     * @param {String} containerId
     * 			The DOM ID of the Modal Container this modal is displayed in
     */
    LoginModal.prototype.display = function (containerId) {
        var loginSuccess = this.loginSuccess;

		var me = this;
        var warning = this.warning;

        ViewManager.showView(new MessageContainer("login"), "#loginMessageContainer", function () {
            if (warning != undefined)
                ViewManager.getView("#loginMessageContainer").displayWarning(warning);
        });

        if ($(AppController.serverController.serverList).size() > 0) {
            $("#loginServer").html("");
        }
        for (var serverName in AppController.serverController.serverList) {
            var serverUrl = AppController.serverController.serverList[serverName];

            var option = $("<option></option>");
            option.attr("value", serverUrl);
            option.text(serverName);

            if (serverName == AppController.serverController.selectedServerName)
                option.attr("selected", "selected")

            $("#loginServer").append(option);
        }

        $("#loginAddServer").click(function () {
            ModalManager.showModal(new AddServerModal(function () {
                ModalManager.showModal(new LoginModal());
            }));
        });

        $("#loginCreateAccount").click(function () {
            ModalManager.showModal(new CreateUserModal());
        });

        $("#loginForm").submit(function (event) {
            event.preventDefault();
        var server = $("#loginServer").val();
        var userId = $("#loginUserId").val();
        var password = $("#loginPassword").val();
			me.submitLogin(userId,password,server);
        });

        $("#loginCancel").click(function (event) {
            event.preventDefault();
            ModalManager.hideModal();
        });

        $("#loginOauth2Google").click(function (event) {
            event.preventDefault();
            me.submitOauth2("google");
        });
        var testOauth = new OAuth2FileBasedRemoteIdentityManager(
        	function(){
        		$("#oauth").show()
        	}
        );
    }

    return LoginModal;
})(LoginModal);
