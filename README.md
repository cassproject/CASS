# CaSS
Competency and Skills Service -- Competency Management

Stable: 0.4.28 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=0.4)](https://travis-ci.org/cassproject/CASS)  
Latest Unstable: 1.1.2 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?tag=1.1.2)](https://travis-ci.org/cassproject/CASS)  
Development: master [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=master)](https://travis-ci.org/cassproject/CASS)

[High level documentation](https://docs.cassproject.org)  
[Developer documentation](https://devs.cassproject.org)

# Purpose of this Document
This document is intended to act as a technical guide to the installation of CaSS.

This installation of CaSS will provide several components that operate to provide a working system. It is composed of:
 * The CaSS Repository, a Java application that runs in a Servlet Container, such as Tomcat.
 * The CaSS Library, a Javascript library that provides an interoperability layer between web applications and the CaSS Repository.
 * CaSS Embeddable Apps, a set of iframeable applications for branded web applications.
 * CaSS Adapters, an adapter that interprets xAPI statements and asserts competence, and an adapter that synchronizes competencies and frameworks to and from Moodle.

# CaSS Libraries
## From GitHub

https://github.com/cassproject/CaSS/tree/master/src/main/js

## CDN

[https://cdn.jsdelivr.net/gh/cassproject/cass@master/src/main/js/cass.js](https://cdn.jsdelivr.net/gh/cassproject/cass@master/src/main/js/cass.js)

## NPM

https://www.npmjs.com/package/cassproject

# Installation
## Ubuntu/Fedora Linux:

    wget https://raw.githubusercontent.com/cassproject/CaSS/master/scripts/cassInstall.sh
    chmod +x cassInstall.sh
    sudo ./cassInstall.sh
    
During the installation, you will be asked to select a version to install. The 'master' installation will install an unstable version with the latest features. Specific versions can be relied upon to be stable and consistant.

## Windows (experimental)

    @powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    refreshenv
    choco install -y cass
    refreshenv

Go to services, start elasticsearch-service-x64 and set it to start automatically.

## Docker (experimental)

Docker images for standalone instances (based on Ubuntu) and distributed/scalable instances (based on Alpine Linux) can be found at:

https://hub.docker.com/_/cassproject/

## WAR (requires support)

If a simple upgrade is required, replacing the WAR can often be the fastest method. This path is not recommended without significant knowledge.

https://github.com/cassproject/CaSS/releases

# Post Installation
To support open linked data, it is important that the objects created in CaSS have public, reliable URLs. For this:

 * Assign this server a domain name.
 * Enable HTTPS.
 * (Optional) Use a reverse proxy to control the endpoint closely.
