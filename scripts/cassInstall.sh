#!/bin/bash

# To install CASS:
# 1. wget https://raw.githubusercontent.com/cassproject/CASS/master/scripts/cassInstall.sh
# 2. chmod +x cassInstall.sh
# 3. sudo ./cassInstall.sh
#
# This is best run on a fresh and new machine. If installing on the same machine as other services, it is recommended to run this script piecewise and by hand.

if [ "$EUID" -ne 0 ];
  then echo "Please run as root."
  exit
fi

cd

echo -----
echo Detecting Platform...

platformFedora=`cat /etc/*release | grep fedora | wc -l`
platformDebian=`cat /etc/*release | grep debian | wc -l`
if [ "$platformDebian" -ne 0 ];
 then
echo Debian based platform found...
fi
if [ "$platformFedora" -ne 0 ];
 then
echo Fedora based platform found...
fi
if [ "$platformDebian" -ne 0 ] && [ "$platformFedora" -ne 0 ];
 then
echo No compatible platform found. Exiting.
exit 1
fi

echo -----
echo Updating Repositories...

if [ "$platformDebian" -ne 0 ];
 then
apt-get -qqy update
fi
if [ "$platformFedora" -ne 0 ];
 then
yum -y -q update
fi

if [ "$platformDebian" -ne 0 ] && [ ! -e "/usr/bin/git" ];
 then
echo -----
echo Installing git...
apt-get -qqy install git
fi
if [ "$platformFedora" -ne 0 ] && [ ! -e "/usr/bin/git" ];
 then
echo -----
echo Installing git...
yum install -y -q git
fi

if [ "$platformDebian" -ne 0 ] && [ ! -e "/usr/bin/mvn" ];
 then
echo -----
echo Installing Maven...
apt-get -qqy install maven
fi
if [ "$platformFedora" -ne 0 ] && [ ! -e "/usr/bin/mvn" ];
 then
echo -----
echo Installing Maven...
wget http://repos.fedorapeople.org/repos/dchen/apache-maven/epel-apache-maven.repo -O /etc/yum.repos.d/epel-apache-maven.repo
sed -i s/\$releasever/6/g /etc/yum.repos.d/epel-apache-maven.repo
yum install -y -q apache-maven
fi

if [ "$platformDebian" -ne 0 ] && [ ! -e "/etc/init.d/tomcat7" ];
 then
echo -----
echo Installing Tomcat 7...
apt-get -qqy install tomcat7
mkdir /var/lib/tomcat7/backup
chown tomcat7:tomcat7 /var/lib/tomcat7/backup
chown tomcat7:tomcat7 /var/lib/tomcat7
fi
if [ "$platformFedora" -ne 0 ] && [ ! -e "/etc/init.d/tomcat7" ];
 then
echo -----
echo Installing Tomcat 7...
yum -y -q install tomcat7
mkdir /usr/share/tomcat7/backup
chown tomcat:tomcat /usr/share/tomcat7/backup
chown tomcat:tomcat /var/lib/tomcat7
fi
sleep 3s
service tomcat7 stop
sleep 3s

echo -----
echo Removing Old Versions of CASS...

if [ "$platformDebian" -ne 0 ]
 then
rm -rf /var/lib/tomcat7/webapps/levr*
rm -rf /var/lib/tomcat7/webapps/cass*
fi
if [ "$platformFedora" -ne 0 ]
 then
rm -rf /usr/share/tomcat7/webapps/levr*
rm -rf /usr/share/tomcat7/webapps/cass*
fi

if [ "$platformDebian" -ne 0 ] && [ ! -e "/etc/init.d/elasticsearch" ]
 then
echo -----
echo Downloading and installing ElasticSearch 5.x...
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
apt-get -qqy install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | tee -a /etc/apt/sources.list.d/elastic-5.x.list
apt-get -qqy update
apt-get -qqy install elasticsearch
update-rc.d elasticsearch defaults 95 10
fi
if [ "$platformFedora" -ne 0 ] && [ ! -e "/etc/init.d/elasticsearch" ]
 then
echo -----
echo Downloading and installing ElasticSearch 5.x...
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
echo "[elasticsearch-5.x]" >> /etc/yum.repos.d/elasticsearch.repo
echo "name=Elasticsearch repository for 5.x packages" >> /etc/yum.repos.d/elasticsearch.repo
echo "baseurl=https://artifacts.elastic.co/packages/5.x/yum" >> /etc/yum.repos.d/elasticsearch.repo
echo "gpgcheck=1" >> /etc/yum.repos.d/elasticsearch.repo
echo "gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch" >> /etc/yum.repos.d/elasticsearch.repo
echo "enabled=1" >> /etc/yum.repos.d/elasticsearch.repo
echo "autorefresh=1" >> /etc/yum.repos.d/elasticsearch.repo
echo "type=rpm-md" >> /etc/yum.repos.d/elasticsearch.repo
yum install elasticsearch
chkconfig --add elasticsearch
chkconfig elasticsearch on
fi

#Upgrade script
if [ "$platformDebian" -ne 0 ] && [ ! -e "/usr/share/elasticsearch/lib/elasticsearch-2.2.1.jar" ]
 then
echo -----
echo Upgrading ElasticSearch 2.2 to 5.x...
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
apt-get -qqy install apt-transport-https
echo "deb https://artifacts.elastic.co/packages/5.x/apt stable main" | tee -a /etc/apt/sources.list.d/elastic-5.x.list
apt-get -qqy update
apt-get -qqy install elasticsearch
update-rc.d elasticsearch defaults 95 10
fi
if [ "$platformFedora" -ne 0 ] && [ ! -e "/usr/share/elasticsearch/lib/elasticsearch-2.2.1.jar" ]
 then
echo -----
echo Upgrading ElasticSearch 2.2 to 5.x...
rpm --import https://artifacts.elastic.co/GPG-KEY-elasticsearch
echo "[elasticsearch-5.x]" >> /etc/yum.repos.d/elasticsearch.repo
echo "name=Elasticsearch repository for 5.x packages" >> /etc/yum.repos.d/elasticsearch.repo
echo "baseurl=https://artifacts.elastic.co/packages/5.x/yum" >> /etc/yum.repos.d/elasticsearch.repo
echo "gpgcheck=1" >> /etc/yum.repos.d/elasticsearch.repo
echo "gpgkey=https://artifacts.elastic.co/GPG-KEY-elasticsearch" >> /etc/yum.repos.d/elasticsearch.repo
echo "enabled=1" >> /etc/yum.repos.d/elasticsearch.repo
echo "autorefresh=1" >> /etc/yum.repos.d/elasticsearch.repo
echo "type=rpm-md" >> /etc/yum.repos.d/elasticsearch.repo
yum install elasticsearch
chkconfig --add elasticsearch
chkconfig elasticsearch on
fi

if [ "$platformDebian" -ne 0 ] && [ ! -e "/etc/init.d/apache2" ];
 then
echo -----
echo Installing Apache 2...
apt-get -qqy install apache2
fi
if [ "$platformFedora" -ne 0 ] && [ ! -e "/etc/init.d/httpd" ];
 then
echo -----
echo Installing HTTPD...
yum -q -y install httpd
fi

if [ -z "$1" ];
 then
echo -----
echo Available Recommended Versions:

git ls-remote http://github.com/cassproject/CASS | grep \\. | grep -v - | sed 's/refs\/heads\///g' | awk '{print $2}' | sort

echo
echo Experimental Version: master

read -p "Version to install: " -i "master" branch
 else
branch=$1
fi

echo -----
echo Downloading CASS Repo...
git clone https://github.com/cassproject/CASS -b $branch
cd CASS
mvn -q clean install
cp target/cass.war /var/lib/tomcat7/webapps
cd ..
rm -rf CASS

if [ "$platformDebian" -ne 0 ];
 then
echo -----
echo Configuring Apache
num=`grep ProxyPass /etc/apache2/sites-enabled/000-default.conf | wc -l`
	if [ "$num" -eq 0 ]
	 then

	echo -----
	echo Configuring Apache...

	echo "ProxyRequests Off" >> /etc/apache2/sites-enabled/000-default.conf
	echo "ProxyPass / http://localhost:8080/cass/" >> /etc/apache2/sites-enabled/000-default.conf
	echo "ProxyPassReverse  /  http://localhost:8080/cass/" >> /etc/apache2/sites-enabled/000-default.conf

	fi
	a2enmod proxy_http ssl
fi

if [ "$platformFedora" -ne 0 ];
 then
	num=`grep ProxyPass /etc/httpd/conf/httpd.conf | wc -l`
	if [ "$num" -eq 0 ]
	 then

	echo -----
	echo Configuring HTTPD...

	echo "ProxyRequests Off" >> /etc/httpd/conf/httpd.conf
	echo "ProxyPass / http://localhost:8080/cass/" >> /etc/httpd/conf/httpd.conf
	echo "ProxyPassReverse  /  http://localhost:8080/cass/" >> /etc/httpd/conf/httpd.conf

	fi
fi

if [ "$platformDebian" -ne 0 ];
 then
echo -----
echo Synchronizing Time with NIST...
apt-get -qqy install ntpdate
ntpdate -s time.nist.gov
fi

if [ "$platformFedora" -ne 0 ];
 then
echo -----
echo Synchronizing Time with NIST...
yum -q -y install ntpdate
ntpdate -s time.nist.gov
fi

echo -----
echo Starting Tomcat...
service tomcat7 start

echo -----
echo Starting ElasticSearch...
service elasticsearch stop
service elasticsearch start

if [ "$platformDebian" -ne 0 ];
 then
echo -----
echo Starting Apache...
service apache2 stop
service apache2 start
fi

if [ "$platformFedora" -ne 0 ];
 then
echo -----
echo Starting HTTPD...
service httpd stop
service httpd start
fi

echo -----
echo -----
echo Navigate to this server to see CASS.
echo
echo We highly recommend the following next steps:
echo  -Mapping DNS to this machine.
echo  -Installing and configuring SSL.
