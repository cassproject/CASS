function loginSuccess(obj){
    $("#skyIdLogin").hide();
    $("#skyIdLogout").show();
    $("#skyIdSave").show();
    $("#skyIdCreate").hide();
    $('#skyIdLoginModal').foundation('reveal', 'close');
}

function logoutSuccess(obj){
    $("#skyIdLogin").show();
    $("#skyIdLogout").hide();
    $("#skyIdSave").hide();
    $("#skyIdCreate").show();
}

function saveSuccess(){
	
}

$("#loginLogin").click(function(e){
    Manager.loginController.login(
        $("#skyIdLoginModalUsername").val(),
        $("#skyIdLoginModalPassword").val()
    );
});

$("#createCreate").click(function(e){
    Manager.loginController.create(
        $("#skyIdLoginModalUsername").val(),
        $("#skyIdLoginModalPassword").val()
    );
});

function saveCredentials()
{
	Manager.loginController.save();
}

function logout()
{
	Manager.loginController.logout();
}