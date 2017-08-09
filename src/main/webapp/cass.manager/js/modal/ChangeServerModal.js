/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
/**
 * Handles changing which server the application is pointed at
 * 
 * @module cass.manager
 * @class ChangeServerModal
 * 
 * @author devlin.junker@eduworks.com
 */
var ChangeServerModal = (function (ChangeServerModal) {
    var ERROR_CONTAINER_ID = "#changeServerError";

    var lastVal;

    /**
     * Occurs on click of submit button, indicating the user has changed the
     * server select and would like to change servers
     * 
     * @memberOf ChangeServerModal
     * @method submitChange
     */
    function submitChange() {
        var server = $("#newServer").val();

        AppController.serverController.selectServer(server, function () {
            ModalManager.hideModal();

			if (!AppController.loginController.loginServer.isGlobal())
			{
            	AppController.loginController.logout();
            	ViewManager.getView("#menuContainer").setLoggedOut();
            }
            AppMenu.prototype.setCurrentServer();

            ScreenManager.changeScreen(new WelcomeScreen());
        }, function (err) {
            $("#newServer").val(lastVal);
            displayError("Unable to change servers, reverting to previous server: " + err);
        });
    }

    /**
     * Adds an error message in the MessageContainer Alert Box
     * 
     * @memberOf ChangeServerModal
     * @method displayError
     * @private
     * @param {String} err
     * 			Error to display 
     */
    function displayError(err) {
        ViewManager.getView("#changeServerMessageContainer").displayAlert(err);
    }

    /**
     * Clears the error message in the MessageContainer Alert Box
     * 
     * @memberOf ChangeServerModal
     * @method clearError
     * @private
     */
    function clearError() {
        ViewManager.getView("#changeServerMessageContainer").clearAlert();
    }

    /**
     * Overridden display function, called once html partial is loaded into DOM
     * 
     * @memberOf ChangeServerModal
     * @method display
     * @param {String} containerId
     * 			The DOM ID of the Modal Container this modal is displayed in
     */
    ChangeServerModal.prototype.display = function (containerId) {
        var view = this;

        ViewManager.showView(new MessageContainer("changeServer"), "#changeServerMessageContainer", function () {
            if (AppController.loginController.getLoggedIn()) {
            	if (!AppController.loginController.loginServer.isGlobal())
                	ViewManager.getView("#changeServerMessageContainer").displayWarning("You are currently logged in, you will be logged out if you change servers");
            }
        });



        $("#changeServerCurrentServer").text(AppController.serverController.selectedServerName);
        $("#changeServerCurrentServer").attr('title', AppController.serverController.selectedServerUrl);

        if ($(AppController.serverController.serverList).size() > 0) {
            $("#newServer").html("");
            for (var serverName in AppController.serverController.serverList) {
                var serverUrl = AppController.serverController.serverList[serverName];

                var option = $("<option></option>");

                if (serverName == AppController.serverController.selectedServerName)
                    option.attr("selected", "selected")
                option.attr("value", serverUrl);
                option.text(serverName);

                $("#newServer").append(option);
            }
        }

        lastVal = AppController.serverController.selectedServerUrl;

        $("#addServer").click(function () {
            ModalManager.showModal(new AddServerModal(function () {
                ModalManager.showModal(new ChangeServerModal());
            }));
        });

        $("#changeServerForm").submit(function (event) {
            event.preventDefault();
            submitChange();
        });

        $("#changeServerCancel").click(function (event) {
            event.preventDefault();
            ModalManager.hideModal();
        });

    }

    return ChangeServerModal;
})(ChangeServerModal);
