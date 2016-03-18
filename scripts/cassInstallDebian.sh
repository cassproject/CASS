#!/bin/bash
#Install LEVR
export DEBIAN_FRONTEND=noninteractive
cd
echo -----
echo Updating Repositories...
apt-get -qq update
echo -----
echo Installing Tomcat 7...
apt-get -y -qq install tomcat7
mkdir /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7
service tomcat7 stop
echo -----
echo Downloading LEVR...
wget -q http://build.eduworks.com/dist/levr/levr.war
echo -----
echo Installing LEVR...
rm -rf /var/lib/tomcat7/levr*
mv levr.war /var/lib/tomcat7/webapps/

#Install Elasticsearch
echo -----
echo Downloading ElasticSearch 2.2...
wget -q https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.2.1/elasticsearch-2.2.1.deb
apt-get -y -qq install gdebi
echo -----
echo Installing ElasticSearch 2.2...
gdebi -q -n elasticsearch-2.2.1.deb
rm elasticsearch-2.2.1.deb

#Install apache2
echo -----
echo Installing Apache 2...
apt-get -qq -y install apache2

#Get CASS
echo -----
echo Downloading CASS...
apt-get -qq -y install git
git clone https://github.com/cassproject/CASS
cp -R ~/CASS/src/rs2 /var/lib/tomcat7/etc
cp -R ~/CASS/src/webapp/* /var/www/html
rm -rf CASS

#Some time desynchronization issues may make CASS not function correctly.
echo -----
echo Synchronizing Time with NIST...
apt-get -qq -y install ntpdate
ntpdate -s time.nist.gov

echo -----
echo Starting Tomcat...
service tomcat7 start

echo -----
echo Starting ElasticSearch...
service elasticsearch stop
service elasticsearch start

echo -----
echo 
echo "HEY! I need you to do something."
echo 
echo "Go set up your domain name if you haven't yet."
echo "If you are using a reverse proxy, configure the proxy endpoint to point at:"
echo "   http://<ip>:8080/levr/api/custom/"
echo "If not, strongly consider it:"
echo "   All of the created objects will use the service endpoint as part of their identifier."
echo "   A reverse proxy allows you to change around servers (and not rely, say, on port 8080)."
echo
echo "If you are using the IP or DNS name as the endpoint (say, for testing)"
echo "   Identity Manager and Selected Repository endpoint (in app.js) -> http://<ip or dns name>:8080/levr/api/custom/"
echo "If you are using a reverse proxy'd DNS name as the endpoint (good)"
echo "   Identity Manager and Selected Repository endpoint (in app.js) -> http://<service endpoint>/"
echo -----

read -p "Press [Enter] key to edit app.js using nano..."
nano /var/www/html/cass.example/js/framework/app.js

clear
echo Navigate to this server to see CASS.
