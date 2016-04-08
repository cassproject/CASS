
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
    EcRepository.cache={};
    identity = null;
    EcIdentityManager.ids = new Array();
    $("#loginButton,.loggedOut").show();
    $("#logoutButton").hide();
    $(".requiresLogin,.loggedIn").hide();
    frameworkSearch();
    if (typeof(oneToOneSearch) == "function")
        oneToOneSearch();
}

$(".requiresLogin").hide();