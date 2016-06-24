#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd

echo -----
echo Updating Repositories...
apt-get -qq update


#Install git
echo -----
echo Installing git...
apt-get -y -qq install git


#Install Maven
echo -----
echo Installing Maven...
apt-get -y -qq install maven


#Install Tomcat
echo -----
echo Installing Tomcat 7...
apt-get -y -qq install tomcat7
mkdir /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7/etc
chown tomcat7:tomcat7 /var/lib/tomcat7
service tomcat7 stop
apt-get -y -qq install tomcat7-admin

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


#Downloand and Compile CASS
echo -----
echo Downloading CASS Repo...
git clone https://github.com/cassproject/CASS -b 0.1.0-SNAPSHOT
cd CASS
mvn -q clean install
cp target/cass-0.1.0.war /var/lib/tomcat7/webapps
cd ..
rm -rf CASS

echo -----
echo Configuring Apache and Tomcat...

#Point Apache at Tomcat
sed -i "94d" /etc/tomcat7/server.xml 
sed -i "95d" /etc/tomcat7/server.xml

echo "worker.list=worker" >> /etc/apache2/workers.properties
echo "worker.worker.type=ajp13" >> /etc/apache2/workers.properties
echo "worker.worker.host=localhost" >> /etc/apache2/workers.properties
echo "worker.worker.port=8009" >> /etc/apache2/workers.properties


sed -i "/JkWorkersFile/d" /etc/apache2/mods-available/jk.conf
sed -i "/<IfModule jk_module/a JkWorkersFile /etc/apache2/workers.properties" /etc/apache2/mods-available/jk.conf 

sed -i "/<VirtualHost/a RewriteRule ^/(.*) /cass-0.1.0/$1 [PT]" /etc/apache2/sites-enabled/000-default.conf 
sed -i "/<VirtualHost/a RewriteEngine On" /etc/apache2/sites-enabled/000-default.conf 
sed -i "/<\/VirtualHost/i JkMount /* worker" /etc/apache2/sites-enabled/000-default.conf 

a2endmod rewrite

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

read -p "Press [Enter] key to edit app.js using nano..."
nano /cass.example/js/framework/app.js

clear
echo Navigate to this server to see CASS.
