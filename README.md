# CaSS
Competency and Skills Service -- Competency Management

Development: 0.5 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=0.5)](https://travis-ci.org/cassproject/CASS)  
Supported: 1.4 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=1.4)](https://travis-ci.org/cassproject/CASS)  
Supported: 1.3 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=1.3)](https://travis-ci.org/cassproject/CASS)  
Supported: 1.2 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=1.2)](https://travis-ci.org/cassproject/CASS)

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

https://github.com/cassproject/cass-npm

## NPM

https://www.npmjs.com/package/cassproject

# Installation
## Ubuntu/Fedora Linux:

    wget https://raw.githubusercontent.com/cassproject/CaSS/master/scripts/cassInstall.sh
    chmod +x cassInstall.sh
    sudo ./cassInstall.sh
    
During the installation, you will be asked to select a version to install. Versions are listed at the top of this document.

## Docker

Docker images for standalone instances (based on Ubuntu) and distributed/scalable instances (based on Alpine Linux) can be found at:

https://hub.docker.com/r/cassproject/cass

# Post Installation
To support open linked data, it is important that the objects created in CaSS have public, reliable URLs. For this:

 * Assign this server a domain name.
 * Enable HTTPS.
 * (Optional) Use a reverse proxy to control the endpoint closely.

# Running Locally
After cloning this repository (ensure you use git clone with --recurse-submodules!), you can run CaSS locally with Jetty or Docker:

    npm test
