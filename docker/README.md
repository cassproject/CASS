#Docker

##Standalone
The images in the ./standalone/ directory are meant to be tests of the /scripts/cassInstall.sh installer and standalone instances.

##Distributed
To support docker-compose, vagrant and other distributed architectures:
* /docker-compose.yml will represent one or more development / build instances
* ./docker-compose.yml will represent the current recommended production build. 