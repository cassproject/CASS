/*
 Copyright 2015-2016 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/


function errorLogin(error) {
    alert(error);
    $("#login").foundation('open');
}

function login() {
    var username = $("#loginUsername").val();
    var password = $("#loginPassword").val();
    $(".status").text("Logging in...");
    $("#login").foundation('close');
    EcRepository.cache={};
    loginServer.startLogin(username, password);
    localStorage["usernameWithSalt"]=loginServer.usernameWithSalt;
    localStorage["passwordWithSalt"]=loginServer.passwordWithSalt;
    localStorage["secretWithSalt"]=loginServer.secretWithSalt;
    loginProcess();
}
    
function loginProcess(){
    loginServer.fetch(
        function (p1) {
            if (EcIdentityManager.ids.length == 0)
                EcPpk.generateKeyAsync(
                    function (p1) {
                        identity = new EcIdentity();
                        identity.ppk = p1;
                        EcIdentityManager.addIdentity(identity);
                        loginServer.commit(
                            function (p1) {
                                login();
                            },
                            errorLogin
                        )
                    }
                );
            else {
                if (EcIdentityManager.ids.length > 0)
                    identity = EcIdentityManager.ids[0];
                $("#login").foundation('close');
                $("#loginButton,.loggedOut").hide();
                $(".requiresLogin").show();
                $("#logoutButton,.loggedIn").show();
                frameworkSearch();
                populateContacts();
                if (typeof(oneToOneSearch) == "function")
                    oneToOneSearch();
            }
        },
        function (p1) {
            loginServer.create(
                function (p1) {
                    EcPpk.generateKeyAsync(
                        function (p1) {
                            identity = new EcIdentity();
                            identity.ppk = p1;
                            EcIdentityManager.addIdentity(identity);
                            loginServer.commit(
                                function (p1) {
                                    login();
                                },
                                errorLogin
                            )
                        }
                    );
                },
                errorLogin
            )
        }
    );
}

logout = function () {
    loginServer.clear();
    delete localStorage["usernameWithSalt"];
    delete localStorage["passwordWithSalt"];
    delete localStorage["secretWithSalt"];
    EcRepository.cache={};
    identity = null;
    EcIdentityManager.ids = new Array();
    $("#loginButton,.loggedOut").show();
    $("#logoutButton").hide();
    $(".requiresLogin,.loggedIn").hide();
    frameworkSearch();
    if (typeof(oneToOneSearch) == "function")
        oneToOneSearch();
    populateContactsActual();
}

$(".requiresLogin").hide();

timeout(function() {
    loginServer.usernameWithSalt=localStorage["usernameWithSalt"];
    loginServer.passwordWithSalt=localStorage["passwordWithSalt"];
    loginServer.secretWithSalt=localStorage["secretWithSalt"];
    if (loginServer.usernameWithSalt != null && loginServer.passwordWithSalt != null && loginServer.secretWithSalt != null)
        loginProcess();
});