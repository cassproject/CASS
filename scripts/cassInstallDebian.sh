#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd

echo -----
echo Updating Repositories...
apt-get -qy update


#Install git
echo -----
echo Installing git...
apt-get -yq install git


#Install Maven
echo -----
echo Installing Maven...
apt-get -yq install maven


#Install Tomcat
echo -----
echo Installing Tomcat 7...
apt-get -y -q install tomcat7
mkdir /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7
service tomcat7 stop
apt-get -yq install tomcat7-admin


#Install Elasticsearch
echo -----
echo Downloading ElasticSearch 2.2...
wget -q https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.2.1/elasticsearch-2.2.1.deb
apt-get -yq install gdebi
echo -----
echo Installing ElasticSearch 2.2...
gdebi -q -n elasticsearch-2.2.1.deb
rm elasticsearch-2.2.1.deb


#Install apache2
echo -----
echo Installing Apache 2...
apt-get -qy install apache2


#Downloand and Compile CASS
echo -----
echo Downloading CASS Repo...
git clone https://github.com/cassproject/CASS -b 0.1.0-SNAPSHOT
cd CASS
mvn -q clean install
cp target/cass-0.1.0.war /var/lib/tomcat7/webapps
cd ..
rm -rf CASS
service tomcat7 start
service tomcat7 stop


#Point Apache at Tomcat
echo -----
echo Configuring Apache and Tomcat...

apt-get -yq install libapache2-mod-jk

sed -i "94d" /etc/tomcat7/server.xml 
sed -i "95d" /etc/tomcat7/server.xml

echo "worker.list=worker" >> /etc/apache2/workers.properties
echo "worker.worker.type=ajp13" >> /etc/apache2/workers.properties
echo "worker.worker.host=localhost" >> /etc/apache2/workers.properties
echo "worker.worker.port=8009" >> /etc/apache2/workers.properties

sed -i "/JkWorkersFile/d" /etc/apache2/mods-available/jk.conf
sed -i "/<IfModule jk_module/a JkWorkersFile /etc/apache2/workers.properties" /etc/apache2/mods-available/jk.conf 

sed -i "/<VirtualHost/a RewriteRule ^/(.*) /cass-0.1.0/\$1 [PT]" /etc/apache2/sites-enabled/000-default.conf 
sed -i "/<VirtualHost/a RewriteEngine On" /etc/apache2/sites-enabled/000-default.conf 
sed -i "/<\/VirtualHost/i JkMount /cass-0.1.0/* worker" /etc/apache2/sites-enabled/000-default.conf 

a2enmod rewrite


#Some time desynchronization issues may make CASS not function correctly.
echo -----
echo Synchronizing Time with NIST...
apt-get -qy install ntpdate
ntpdate -s time.nist.gov


#Request CASS Crypto Settings
clear
echo "CASS uses salts to secure user's identities and login information."
echo "Before the application starts, you will need to set these:"
echo "(make sure each is different and sufficiently long enough)"
echo ""

echo "Type the Username salt, followed by [ENTER]:"
read userSalt
echo ""

echo "Type the Password salt, followed by [ENTER]:"
read passSalt
echo ""

echo "Type the Secret salt, followed by [ENTER]:"
read secretSalt
echo ""

sed -i "54,56d" /var/lib/tomcat7/webapps/cass-0.1.0/cass.example/js/framework/app.js
sed -i "/loginServer.configure/a '$userSalt', 5000, 64, '$passSalt', 5000, 64, '$secretSalt', 5000, 64" /var/lib/tomcat7/webapps/cass-0.1.0/cass.example/js/framework/app.js

sed -i "13d" /var/lib/tomcat7/webapps/cass-0.1.0/cass.manager/settings/settings.js
sed -i "9d" /var/lib/tomcat7/webapps/cass-0.1.0/cass.manager/settings/settings.js
sed -i "5d" /var/lib/tomcat7/webapps/cass-0.1.0/cass.manager/settings/settings.js

sed -i "4a 'userEncryptionSalt': '$userSalt'," /var/lib/tomcat7/webapps/cass-0.1.0/cass.manager/settings/settings.js
sed -i "8a 'passwordEncryptionSalt': '$passSalt'," /var/lib/tomcat7/webapps/cass-0.1.0/cass.manager/settings/settings.js
sed -i "12a 'secretEncryptionSalt': '$secretSalt'," /var/lib/tomcat7/webapps/cass-0.1.0/cass.manager/settings/settings.js

#Restart Everything
echo -----
echo Starting Tomcat...
service tomcat7 start

echo -----
echo Starting ElasticSearch...
service elasticsearch stop
service elasticsearch start

echo -----
service apache2 stop
service apache2 start

clear
echo Navigate to this server to see CASS.
