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
     * Submits the information from the inputs to the server for authentication
     * and handles response
     * 
     * @memberOf LoginModal
     * @method submitLogin
     * @private
     */
    function submitLogin(loginSuccess) {
        var server = $("#loginServer").val();
        var userId = $("#loginUserId").val();
        var password = $("#loginPassword").val();

        var oldSelectedServer = AppController.serverController.selectedServerName;

        var failure = function (err) {
            AppController.serverController.selectServer(oldSelectedServer,function(){
				if (err == undefined)
					err = "Unable to Connect to Server";

				ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
            });
        }

        AppController.serverController.selectServer(server, function () {
            AppController.loginController.setLoginServer(AppController.serverController.remoteIdentityManager);

            ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");

            AppController.loginController.login(
                userId,
                password,
                function () {
                    if (loginSuccess != undefined) {
                        loginSuccess(URLParams.getParams());
                    } else {
                        ModalManager.hideModal();
                        ScreenManager.changeScreen(new UserIdentityScreen())
                    }

                    AppMenu.prototype.setLoggedIn();
                },failure
            );
        }, failure);
    }

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
            submitLogin(loginSuccess);
        });

        $("#loginCancel").click(function (event) {
            event.preventDefault();
            ModalManager.hideModal();
        });
    }

    return LoginModal;
})(LoginModal);
