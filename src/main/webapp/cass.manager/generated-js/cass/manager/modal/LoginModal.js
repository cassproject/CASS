/*-
 * --BEGIN_LICENSE--
 * Competency and Skills System
 * -----
 * Copyright (C) 2015 - 2017 Eduworks Corporation and other contributing parties.
 * -----
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * --END_LICENSE--
 */

var LoginModal = function(success, cancel, warningMessage) {
    EcModal.call(this);
    this.loginSuccess = success;
    this.cancel = cancel;
    this.warning = warningMessage;
};
LoginModal = stjs.extend(LoginModal, EcModal, [], function(constructor, prototype) {
    prototype.modalSize = "small";
    prototype.cancel = null;
    prototype.loginSuccess = null;
    prototype.warning = null;
    prototype.onClose = function() {
        if (this.cancel != null) 
            this.cancel();
        return EcView.prototype.onClose.call(this);
    };
    prototype.getModalSize = function() {
        return this.modalSize;
    };
    prototype.getHtmlLocation = function() {
        return "partial/modal/login.html";
    };
    prototype.submitOauth2 = function(server) {
        var me = this;
        var failure = function(err) {
            ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
        };
        ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
        AppController.loginController.hello(server, function() {
            AppController.serverController.checkForAdmin(function() {
                if (me.loginSuccess != null) {
                    me.loginSuccess(URLParams.getParams());
                } else {
                    ModalManager.hideModal();
                }
                new AppMenu().setLoggedIn();
            });
        }, failure);
    };
    prototype.submitLogin = function(userId, password, server) {
        var me = this;
        var failure = function(err) {
            ViewManager.getView("#loginMessageContainer").displayAlert(err, "loginFail");
        };
        ViewManager.getView("#loginMessageContainer").clearAlert("loginFail");
        AppController.loginController.login(userId, password, server, function() {
            AppController.serverController.checkForAdmin(function() {
                AppController.serverController.checkForAdmin(function() {
                    if (me.loginSuccess != null) {
                        me.loginSuccess(URLParams.getParams());
                    } else {
                        ModalManager.hideModal();
                    }
                    new AppMenu().setLoggedIn();
                });
            });
        }, failure);
    };
}, {cancel: "Callback0", loginSuccess: {name: "Callback1", arguments: ["Object"]}}, {});
