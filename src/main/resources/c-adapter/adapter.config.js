//Ensure thisEndpoint ends with a slash.
thisEndpoint=function(){return "http://localhost:8080/api/"};

//Ensure repoEndpoint ends with a slash.
repoEndpoint=function(){return "http://localhost:8080/api/"};

// MORE THAN LIKELY, YOUR SMTP USERNAME WILL OVERRIDE THE EMAIL 'FROM' FIELD (WHEN TESTING WITH GOOGLE'S SMTP SERVER).
// THIS IS A SECURITY/SMTP SERVER SETTING THING.
badgeEmailFrom = function(){return ""};

badgeSMTPHost = function(){return ""};
badgeSMTPUser = function(){return ""};
badgeSMTPPort = function(){return ""};
badgeSMTPPassword = function(){return ""};
