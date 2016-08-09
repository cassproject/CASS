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
mkdir /var/lib/tomcat7/backup
chown tomcat7:tomcat7 /var/lib/tomcat7/backup
chown tomcat7:tomcat7 /var/lib/tomcat7
service tomcat7 stop

echo -----
echo Removing Old Versions of CASS...
rm -rf /var/lib/tomcat7/webapps/levr*
rm -rf /var/lib/tomcat7/webapps/cass*

#Install Elasticsearch
echo -----
echo Downloading ElasticSearch 2.2...
wget -q https://download.elasticsearch.org/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.2.1/elasticsearch-2.2.1.deb
apt-get -yq install gdebi
echo -----
echo Installing ElasticSearch 2.2...
gdebi -q -n elasticsearch-2.2.1.deb
rm elasticsearch-2.2.1.deb
update-rc.d elasticsearch defaults


#Install apache2
echo -----
echo Installing Apache 2...
apt-get -qy install apache2


#Download and Compile CASS
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

num=`grep ProxyPass /etc/apache2/sites-enabled/000-default.conf | wc -l`
if [ "$num" -eq 0 ]
 then

#Point Apache at Tomcat
echo -----
echo Configuring Apache...

echo "ProxyRequests Off" >> /etc/apache2/sites-enabled/000-default.conf
echo "ProxyPass / http://localhost:8080/cass-0.1.0/" >> /etc/apache2/sites-enabled/000-default.conf
echo "ProxyPassReverse  /  http://localhost:8080/cass-0.1.0/" >> /etc/apache2/sites-enabled/000-default.conf

a2enmod proxy_http ssl

fi

#Some time desynchronization issues may make CASS not function correctly.
echo -----
echo Synchronizing Time with NIST...
apt-get -qy install ntpdate
ntpdate -s time.nist.gov


#Restart Everything
echo -----
echo Starting Tomcat...
service tomcat7 start

echo -----
echo Starting ElasticSearch...
service elasticsearch stop
service elasticsearch start

echo -----
echo Starting Apache...
service apache2 stop
service apache2 start

clear
echo Navigate to this server to see CASS.
echo
echo We highly recommend the following next steps:
echo  -Mapping DNS to this machine.
echo  -Installing and configuring SSL.
