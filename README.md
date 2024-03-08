# CaSS
Competency and Skills Service -- Competency Management

Release Candidate: 1.5.44 [![Build Status](https://travis-ci.org/cassproject/CASS.svg?branch=1.5)](https://travis-ci.org/cassproject/CASS)  
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
After cloning this repository (ensure you use git clone with --recurse-submodules!), you can run CaSS locally.

Dependencies: Docker (will pull and run elasticsearch on port 9200)

## Getting things up and running

 * `git clone --recurse-submodules -b <branch> https://github.com/cassproject/CASS` - Get the code.
 * `npm i` - Install dependencies.
 * `npm run dev` - Starts server, restarts server on-save.

## In a separate command line, if you want unit tests:

 * `npm run automocha` - Runs both cass-npm and cass unit tests, runs them again on-save.
 * `npm run automochafast` - Runs cass unit tests, runs them again on-save.
 * `npm run mocha` - Runs cass-npm and cass unit tests.
 * `npm run mochafast` - Runs cass unit tests.

## Generating documentation
Will be deposited in `/docs`

 * `npm run docs`

## Running in myriad environments (requires Docker)

Where flavors are: ubuntu16, ubuntu18, ubuntu20, ubuntu18:13to15, standaloneWindows, standalone, testReplication
 * `npm run buildRun:<flavor>` - Wipes previous test container, builds and starts flavor container.
 * `npm run buildRun:kill` - Stops the running container.

## Running it like it's in prod

 * `npm run run:cassbase` - Starts PM2 on localhost:8080/cass (used by cassInstall.sh)
 * `npm run run:standalone` - Starts PM2 on localhost/ (used by Docker installs)
 * `npm run run` - Starts PM2 on localhost:8080/
 * `npm run logs` - Tails logs.
 * `npm run stop` - Stops all PM2 services.

 To get the process to restart when your linux machine restarts, run `npm run pm2startup`, run the command the process tells you to, and run `npm run pm2save`. For Windows, an additional library is needed to configure this.

## A note on Elasticsearch and 1.5
Due to the performance improvements in the 1.5 version of CaSS, we highly recommend using Elasticsearch 7 with it as it's better configured to handle the load than previous versions.

## Release Process
 * `npm upgrade --save` Review dependencies, autocomplete version numbers
 * Increment version number in package.json and src/main/swagger.json and docker-compose*.yml
 * Increment elasticsearch version number (in Dockerfile and docker-compose) to latest minor/revision in docker/standalone/DockerFile (https://hub.docker.com/_/elasticsearch)
 * `npm install`
 * `npm run testWithCoverage`
 * In another command window, `npm run test:mocha` - Must not fail any tests.
 * In the command window running testWithCoverage, `ctrl+c`. Record the output of the code coverage for the tests in codeCoverage.md.
 * Update src/main/webapp to point at the appropriate gh-pages commit.
 * Update CHANGELOG.md
 * Update README.md
 * Run `npm run buildRun:standaloneTest` to ensure the container can build.
 * `docker scout cves cass-test > scan-standalone.txt`
 * Use Docker Desktop or the previous output to resolve any high or medium priority (6.0 CVSS and above) issues.
 * In another command window, `npm run test:mocha` - Must not fail any tests.
 * Run `docker-compose up --build` to ensure the container can build.
 * `docker scout cves cass-cass > scan-node.txt`
 * Use Docker Desktop or the previous output to resolve any high or medium priority (6.0 CVSS and above) issues.
 * In another command window, `npm run test:mocha` - Must not fail any tests.
 * Commit with release notes.
 * Tag commit with version number.
 
### FIPS:
FIPS is supported both client-side and server-side in CaSS. Here is the relevant compatibility table.

Sources: https://www.openssl.org/blog/blog/2023/05/29/FIPS-3-0-8/

| --> Server --> | < 1.5.35 | >= 1.5.35 with <br> OpenSSL 3.0.8 and<br> --force-fips | >= 1.5.35 with <br>OpenSSL 3.0.8 and<br> --force-fips and<br> env REJECT_SHA1=true |
| - | - | - | - |
| **Client/Library** | |
| < 1.5.35 | SHA-1 (no FIPS) | SHA-1 (Verify only) | Incompatible
| < 1.5.35 and<br> OpenSSL 3.0.8 and<br> env FIPS=true | SHA-1 (partial FIPS) | SHA-1 (Verify only) | Incompatible
| >= 1.5.35 | SHA-1 (no FIPS) | SHA-1 (Verify only*), SHA-256 (FIPS) | SHA-256 (FIPS)
| >= 1.5.35 and<br> env FIPS=true | SHA-1 (partial FIPS) | SHA-1 (Verify only*), SHA-256 (FIPS) | SHA-256 (FIPS)
| >= 1.5.35 and<br> --force-fips | Incompatible | SHA-256 (FIPS) | SHA-256 (FIPS)

To get FIPS, it is recommended to use the docker container builds.

Partial FIPS means that we are still violating FIPS by using SHA-1 hashing. All other cryptographic operations are using the FIPS module.

Verify only uses the exception that permits SHA-1 verification but not generation.

Verify only* may fall back to SHA-1 verification if SHA-256 negotiation failed, but typically will not use SHA-1.
