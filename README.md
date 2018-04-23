[![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=master)](https://travis-ci.org/cassproject/CASS)
# CASS
Competency and Skills Service -- Competency Management

Stable: 0.3.x
Development: 0.4.x

[High level documentation](https://docs.cassproject.org)  
[Developer documentation](https://devs.cassproject.org)

# Purpose of this Document
This document is intended to act as a technical guide to the installation of CASS.

This installation of CASS will provide several components that operate to provide a working system. It is composed of:
 * The CASS Repository, a Java application that runs in a Servlet Container, such as Tomcat.
 * The CASS Library, a Javascript library that provides an interoperability layer between web applications and the CASS Repository.
 * CASS Embeddable Apps, a set of iframeable applications for branded web applications.
 * CASS Application Examples, a set of CASS branded applications that can be freely used, adapted, modified, or inspected.
 * CASS Manager, a robust application facilitating interoperability across multiple CASS repositories and other services.
 * CASS Visualizer, an example application showing a visualization.
 * CASS Adapters, an adapter that interprets xAPI statements and asserts competence, and an adapter that synchronizes competencies and frameworks to and from Moodle.

# Installation
## Ubuntu/Fedora Linux:

    wget https://raw.githubusercontent.com/cassproject/CASS/master/scripts/cassInstall.sh
    chmod +x cassInstall.sh
    sudo ./cassInstall.sh
    
During the installation, you will be asked to select a version to install. The 'master' installation will install an unstable version with the latest features. Specific versions can be relied upon to be stable and consistant.

## Windows (experimental)

    @powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))" && SET "PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin"
    refreshenv
    choco install -y cass
    refreshenv

Go to services, start elasticsearch-service-x64 and set it to start automatically.

# Post Installation
To support open linked data, it is important that the objects created in CASS have public, reliable URLs. For this:

 * Assign this server a domain name.
 * Enable HTTPS.
 * (Optional) Use a reverse proxy to control the endpoint closely.
