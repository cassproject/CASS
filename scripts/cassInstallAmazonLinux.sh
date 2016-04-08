#!/bin/bash
#Install LEVR
cd
echo -----
echo Installing Tomcat 7...
yum -y -q install tomcat7
mkdir /usr/share/tomcat7/etc
chown tomcat:tomcat /usr/share/tomcat7/etc
chown tomcat:tomcat /var/lib/tomcat7
service tomcat7 stop
echo -----
echo Downloading LEVR...
wget -q http://build.eduworks.com/dist/levr/levr.war
echo -----
echo Installing LEVR...
rm -rf /usr/share/tomcat7/levr*
mv levr.war /usr/share/tomcat7/webapps/

#Install Elasticsearch
echo -----
echo Downloading ElasticSearch 2.2...
wget -q https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/rpm/elasticsearch/2.2.1/elasticsearch-2.2.1.rpm
echo -----
echo Installing ElasticSearch 2.2...
yum -y -q --nogpgcheck localinstall elasticsearch-2.2.1.rpm
rm elasticsearch-2.2.1.rpm

#Install apache2
echo -----
echo Installing Apache 2...
yum -q -y install httpd

#Get CASS
echo -----
echo Downloading CASS...
yum -q -y install git
git clone https://github.com/cassproject/CASS
cp -R ~/CASS/src/rs2 /usr/share/tomcat7/etc
cp -R ~/CASS/src/webapp/* /var/www/html
rm -rf CASS

#Some time desynchronization issues may make CASS not function correctly.
echo -----
echo Synchronizing Time with NIST...
yum -q -y install ntpdate
ntpdate -s time.nist.gov

echo -----
echo Starting Tomcat...
service tomcat7 start

echo -----
echo Starting ElasticSearch...
service elasticsearch stop
service elasticsearch start

echo -----
echo Starting HTTPD...
service httpd stop
service httpd start

clear
echo Navigate to this server to see CASS.