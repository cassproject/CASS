#Install LEVR
export DEBIAN_FRONTEND=noninteractive
echo
echo Updating Repositories...
echo
apt-get -qq update
echo
echo Installing Tomcat 7...
echo
apt-get -y -qq install tomcat7
mkdir /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7
service tomcat7 stop
echo
echo Downloading LEVR...
echo
wget -q http://build.eduworks.com/dist/levr/levr.war
echo
echo Installing LEVR...
echo
rm -rf /var/lib/tomcat7/levr*
mv levr.war /var/lib/tomcat7/webapps/

#Install Elasticsearch
echo
echo Downloading ElasticSearch 2.2...
echo
wget -q https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.2.0/elasticsearch-2.2.0.deb
apt-get -y -qq install gdebi
echo
echo Installing ElasticSearch 2.2...
echo
gdebi -q -n elasticsearch-2.2.0.deb
rm elasticsearch-2.2.0.deb

#Install apache2
echo
echo Installing Apache 2...
echo
apt-get -qq -y install apache2

#Get CASS
echo
echo Downloading CASS...
echo
apt-get -qq -y install git
git clone https://github.com/cassproject/CASS
cp -R ~/CASS/src/rs2 /var/lib/tomcat7/etc
cp -R ~/CASS/src/webapp/cass.example/* /var/www/html
rm -rf CASS

#Some time desynchronization issues may make CASS not function correctly.
echo
echo Synchronizing Time with NIST...
echo
apt-get -qq -y install ntpdate
ntpdate -s time.nist.gov

echo
echo Starting Tomcat...
echo
service tomcat7 start

echo
echo Starting ElasticSearch...
echo
service elasticsearch stop
service elasticsearch start

echo
echo 
echo HEY! I need you to do something.
echo 
echo Change the default identity management server and the repo selectedServer to http://localhost:8080/levr/api/custom/
echo Alternatively, change them to the external IP and service port of the device, so others may use it.

read -p "Press [Enter] key to enter nano..."
nano /var/www/html/js/framework/app.js

clear
echo Navigate to the apache endpoint, http://localhost/
