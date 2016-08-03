WelcomeScreen = (function(WelcomeScreen){
	
	WelcomeScreen.prototype.display = function(containerId, callback)
	{
		var view = this;
		var welcomeMessage = this.welcomeMessage;
		$(containerId).load("partial/screen/welcome.html", function(){

			
			if(callback != undefined)
				callback();
		});
	};
	
	return WelcomeScreen;
})(WelcomeScreen);