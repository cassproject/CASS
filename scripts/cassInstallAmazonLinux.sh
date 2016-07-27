#!/bin/bash

#Check if running as root
if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd
yum -y -q update

#Install git
echo -----
echo Installing git...
yum -y -q install git


#Install Maven
echo -----
echo Installing Maven...
wget http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo
sed -i s/\$releasever/6/g /etc/yum.repos.d/epel-apache-maven.repo
yum install -y -q apache-maven


#Install Tomcat 
echo -----
echo Installing Tomcat 7...
yum -y -q install tomcat7
mkdir /usr/share/tomcat7/etc
chown tomcat:tomcat /usr/share/tomcat7/etc
chown tomcat:tomcat /var/lib/tomcat7
service tomcat7 stop


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


#Download and compile CASS .war
echo -----
echo Downloading CASS Repo...
git clone https://github.com/cassproject/CASS -b 0.1.0-SNAPSHOT

echo -----
echo Compiling CASS...
cd CASS
mvn -q clean install
cp target/cass-0.1.0.war /usr/share/tomcat7/webapps
cd ..
rm -rf CASS
service tomcat7 start
sleep 3s
service tomcat7 stop

num=`grep ProxyPass /etc/httpd/conf/httpd.conf | wc -l`
if [ "$num" -eq 0 ]
 then

echo -----
echo Configuring Apache and Tomcat...

## Ignored for now, if we need to do this instead of mod_proxy we can uncomment
#Install Apache mod_jk
#yum -q -y install httpd-devel apr apr-devel apr-util apr-util-devel gcc gcc-c++ make autoconf libtool
#mkdir -p /opt/mod_jk/
#cd /opt/mod_jk
#wget http://www.eu.apache.org/dist/tomcat/tomcat-connectors/jk/tomcat-connectors-1.2.41-src.tar.gz
#tar -xvzf tomcat-connectors-1.2.41-src.tar.gz
#cd tomcat-connectors-1.2.41-src/native
#./configure --with-apxs=/usr/sbin/apxs
#make
#libtool --finish /usr/lib64/httpd/modules
#make install
#mkdir -p /var/run/mod_jk
#chown apache:apache /var/run/mod_jk

#Point Apache at Tomcat
echo "ProxyPass / http://localhost:8080/cass-0.1.0/" >> /etc/httpd/conf/httpd.conf
echo "ProxyPassReverse  /  http://localhost:8080/cass-0.1.0/" >> /etc/httpd/conf/httpd.conf

sed -i~ "/<Connector port=\"8080/a proxyPort=\"80\"" /usr/share/tomcat7/conf/server.xml

fi

#Some time desynchronization issues may make CASS not function correctly.
echo -----
echo Synchronizing Time with NIST...
yum -q -y install ntpdate
ntpdate -s time.nist.gov

#Start Services
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
echo
echo We highly recommend the following next steps:
echo  -Mapping DNS to this machine.
echo  -Installing and configuring SSL.

