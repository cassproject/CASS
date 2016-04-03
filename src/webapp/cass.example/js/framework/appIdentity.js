
function login() {
    var username = $("#loginUsername").val();
    var password = $("#loginPassword").val();

    EcRepository.cache={};
    loginServer.startLogin(username, password);

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
                            error
                        )
                    }
                );
            else {
                if (EcIdentityManager.ids.length > 0)
                    identity = EcIdentityManager.ids[0];
                $("#login").foundation('close');
                $("#loginButton").hide();
                $("#logoutButton").show();
                frameworkSearch();
                populateContacts();
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
                                error
                            )
                        }
                    );
                },
                error
            )
        }
    );
}

logout = function () {
    loginServer.clear();
    EcRepository.cache={};
    identity = null;
    EcIdentityManager.ids = new Array();
    $("#loginButton").show();
    $("#logoutButton").hide();
}